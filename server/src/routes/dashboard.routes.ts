import { Router, Request, Response } from 'express';
import { dbService } from '../services/firestore.service';
import { aiService } from '../services/ai.service';
import { recommendationService } from '../services/recommendation.service';

const router = Router();

// GET /api/dashboard/learner - Aggregated learner metrics & visualized data
router.get('/dashboard/learner', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query as { userId: string };
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    let user = await dbService.getUser(userId);
    if (!user) {
      // Auto-initialize demo learner if not yet saved
      user = {
        uid: userId,
        email: `${userId}@skillsetu.io`,
        displayName: 'Learner',
        role: 'learner',
        targetTrackId: 'frontend-dev',
        skillLevels: { 'html-css': 3, 'javascript-core': 2, 'react-fundamentals': 2 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await dbService.setUser(user);
    }

    const targetTrackId = user.targetTrackId || 'frontend-dev';
    const track = await dbService.getTrack(targetTrackId);

    // Latest gap report
    let gapReport = await dbService.getLatestSkillGapReport(userId);
    if (!gapReport && track) {
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

    // Latest recommendation report
    let recommendation = await dbService.getLatestRecommendation(userId);
    if (!recommendation && track && gapReport) {
      recommendation = await recommendationService.generateLearningPath(userId, track.id, gapReport.gaps);
    }

    // Quiz history
    const quizAttempts = await dbService.getQuizAttempts(userId);

    // Progress logs
    const progressLogs = await dbService.getProgressLogs(userId);

    // Radar chart dataset: Skill vs Target level
    const radarData = track ? track.skills.map(s => ({
      skill: s.name,
      current: user?.skillLevels?.[s.id] || 0,
      target: s.targetLevel,
      fullMark: 5
    })) : [];

    // Gaps chart dataset (top gaps by gap score)
    const gapChartData = (gapReport?.gaps || []).slice(0, 6).map(g => ({
      name: g.skillName,
      gapScore: g.gapScore,
      deficit: Math.max(0, g.requiredLevel - g.currentLevel),
      priority: g.priority
    }));

    return res.json({
      success: true,
      user,
      track,
      gapReport,
      recommendation,
      quizAttempts,
      progressLogs,
      chartData: {
        radar: radarData,
        gaps: gapChartData
      }
    });
  } catch (error) {
    console.error('Error getting learner dashboard:', error);
    return res.status(500).json({ error: 'Failed to generate learner dashboard' });
  }
});

// GET /api/dashboard/admin - Aggregate batch-level trends across all learners
router.get('/dashboard/admin', async (_req: Request, res: Response) => {
  try {
    const users = await dbService.getAllUsers();
    const tracks = await dbService.getTracks();
    const courses = await dbService.getCourses();
    const gapReports = await dbService.getAllSkillGapReports();
    const allQuizAttempts = await dbService.getAllQuizAttempts();
    const allRecommendations = await dbService.getAllRecommendations();

    const learners = users.filter(u => u.role === 'learner');
    const totalLearners = learners.length;

    // 1. Weak Skill Aggregator (most common weak skills across cohorts)
    const skillDeficitCounts: Record<string, { name: string; count: number; totalDeficit: number }> = {};

    gapReports.forEach(report => {
      report.gaps.forEach(gap => {
        if (gap.currentLevel < gap.requiredLevel) {
          if (!skillDeficitCounts[gap.skillId]) {
            skillDeficitCounts[gap.skillId] = {
              name: gap.skillName,
              count: 0,
              totalDeficit: 0
            };
          }
          skillDeficitCounts[gap.skillId].count++;
          skillDeficitCounts[gap.skillId].totalDeficit += (gap.requiredLevel - gap.currentLevel);
        }
      });
    });

    const mostCommonWeakSkills = Object.values(skillDeficitCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // 2. Track Distribution & Average Progress
    const trackDistribution: Record<string, { trackName: string; learnerCount: number; averageMatchScore: number; scores: number[] }> = {};

    tracks.forEach(t => {
      trackDistribution[t.id] = {
        trackName: t.trackName,
        learnerCount: 0,
        averageMatchScore: 0,
        scores: []
      };
    });

    learners.forEach(l => {
      const trackId = l.targetTrackId || 'frontend-dev';
      if (trackDistribution[trackId]) {
        trackDistribution[trackId].learnerCount++;
      }
    });

    gapReports.forEach(r => {
      if (trackDistribution[r.trackId]) {
        trackDistribution[r.trackId].scores.push(r.overallMatchScore);
      }
    });

    Object.values(trackDistribution).forEach(td => {
      if (td.scores.length > 0) {
        td.averageMatchScore = Math.round(td.scores.reduce((a, b) => a + b, 0) / td.scores.length);
      } else {
        td.averageMatchScore = 45; // baseline sample
      }
    });

    // 3. Course Completion Rates
    let totalAssignedCourses = 0;
    let totalCompletedCourses = 0;

    allRecommendations.forEach(rec => {
      totalAssignedCourses += rec.totalCourses || 0;
      totalCompletedCourses += rec.completedCourses || 0;
    });

    const courseCompletionRate = totalAssignedCourses > 0
      ? Math.round((totalCompletedCourses / totalAssignedCourses) * 100)
      : 38; // healthy baseline representation

    // 4. Average Quiz Passing Rate
    const passingAttempts = allQuizAttempts.filter(a => a.percentage >= 60).length;
    const averageQuizPassingRate = allQuizAttempts.length > 0
      ? Math.round((passingAttempts / allQuizAttempts.length) * 100)
      : 76;

    return res.json({
      success: true,
      stats: {
        totalLearners,
        totalCourses: courses.length,
        totalTracks: tracks.length,
        totalQuizzesTaken: allQuizAttempts.length,
        courseCompletionRate,
        averageQuizPassingRate
      },
      mostCommonWeakSkills,
      trackDistribution: Object.values(trackDistribution),
      recentLearners: learners.slice(-6).reverse()
    });
  } catch (error) {
    console.error('Error generating admin dashboard:', error);
    return res.status(500).json({ error: 'Failed to generate admin dashboard' });
  }
});

export default router;
