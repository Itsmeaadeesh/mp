import { Router, Request, Response } from 'express';
import { dbService } from '../services/firestore.service';
import { recommendationService } from '../services/recommendation.service';
import { aiService } from '../services/ai.service';

const router = Router();

// POST /api/recommendations/generate - Generate or recalculate ordered learning path
router.post('/recommendations/generate', async (req: Request, res: Response) => {
  try {
    const { userId, trackId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const user = await dbService.getUser(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const targetTrackId = trackId || user.targetTrackId;
    if (!targetTrackId) return res.status(400).json({ error: 'No track specified' });

    const track = await dbService.getTrack(targetTrackId);
    if (!track) return res.status(404).json({ error: 'Track not found' });

    // Check existing gap report or compute fresh
    let gapReport = await dbService.getLatestSkillGapReport(userId);
    if (!gapReport || gapReport.trackId !== targetTrackId) {
      const analysis = await aiService.analyzeSkillGaps(track, user.skillLevels || {});
      gapReport = {
        id: `gap-${Date.now()}`,
        userId,
        trackId: track.id,
        trackName: track.trackName,
        gaps: analysis.gaps,
        overallMatchScore: analysis.overallMatchScore,
        aiSummary: analysis.aiSummary,
        generatedAt: new Date().toISOString()
      };
      await dbService.saveSkillGapReport(gapReport);
    }

    // Existing completed courses from previous recommendation if any
    const prevRec = await dbService.getLatestRecommendation(userId);
    const completedCourseIds = prevRec ? prevRec.path.filter(p => p.completed).map(p => p.courseId) : [];

    const recReport = await recommendationService.generateLearningPath(
      userId,
      targetTrackId,
      gapReport.gaps,
      completedCourseIds
    );

    return res.json({ success: true, recommendation: recReport });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// GET /api/recommendations/latest - Get learner's current learning path
router.get('/recommendations/latest', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query as { userId: string };
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    let rec = await dbService.getLatestRecommendation(userId);
    if (!rec) {
      // If user has a track, auto-generate initial path
      const user = await dbService.getUser(userId);
      if (user && user.targetTrackId) {
        const track = await dbService.getTrack(user.targetTrackId);
        if (track) {
          const analysis = await aiService.analyzeSkillGaps(track, user.skillLevels || {});
          rec = await recommendationService.generateLearningPath(userId, track.id, analysis.gaps);
        }
      }
    }

    return res.json({ success: true, recommendation: rec });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// POST /api/recommendations/complete-course - Mark course completed, advance skills and path
router.post('/recommendations/complete-course', async (req: Request, res: Response) => {
  try {
    const { userId, courseId } = req.body;
    if (!userId || !courseId) {
      return res.status(400).json({ error: 'userId and courseId are required' });
    }

    const user = await dbService.getUser(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const course = await dbService.getCourse(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // 1. Upgrade skill levels for skills tagged by this course (+1 proficiency level up to 5)
    user.skillLevels = user.skillLevels || {};
    course.skillTags.forEach(tag => {
      const current = user.skillLevels![tag] || 1;
      user.skillLevels![tag] = Math.min(5, current + 1);
    });
    await dbService.setUser(user);

    // 2. Update recommendation path
    let rec = await dbService.getLatestRecommendation(userId);
    let completedIds: string[] = [];

    if (rec) {
      completedIds = rec.path.filter(p => p.completed || p.courseId === courseId).map(p => p.courseId);
      if (!completedIds.includes(courseId)) completedIds.push(courseId);
    } else {
      completedIds = [courseId];
    }

    const track = await dbService.getTrack(user.targetTrackId || 'frontend-dev');
    if (track) {
      // Re-run gap analysis with upgraded skills
      const gapAnalysis = await aiService.analyzeSkillGaps(track, user.skillLevels);
      await dbService.saveSkillGapReport({
        id: `gap-${Date.now()}`,
        userId,
        trackId: track.id,
        trackName: track.trackName,
        gaps: gapAnalysis.gaps,
        overallMatchScore: gapAnalysis.overallMatchScore,
        aiSummary: gapAnalysis.aiSummary,
        generatedAt: new Date().toISOString()
      });

      // Recalculate recommendation path with newly unlocked courses
      rec = await recommendationService.generateLearningPath(userId, track.id, gapAnalysis.gaps, completedIds);

      // Log progress update
      await dbService.logProgress({
        id: `prog-${Date.now()}`,
        userId,
        timestamp: new Date().toISOString(),
        skillLevels: user.skillLevels,
        overallMastery: gapAnalysis.overallMatchScore,
        trigger: 'course_completion'
      });
    }

    return res.json({
      success: true,
      message: `Course "${course.title}" marked as complete! Skill levels upgraded.`,
      updatedUser: user,
      recommendation: rec
    });
  } catch (error) {
    console.error('Error completing course:', error);
    return res.status(500).json({ error: 'Failed to complete course' });
  }
});

export default router;
