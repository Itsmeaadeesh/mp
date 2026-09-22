import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbService } from '../services/firestore.service';
import { aiService } from '../services/ai.service';
import { recommendationService } from '../services/recommendation.service';

const router = Router();

// POST /api/skillgap/analyze - Run full AI-powered skill-gap analysis
router.post('/skillgap/analyze', async (req: Request, res: Response) => {
  try {
    const { userId, trackId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const user = await dbService.getUser(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const targetTrackId = trackId || user.targetTrackId;
    if (!targetTrackId) {
      return res.status(400).json({ error: 'No target track specified or associated with user' });
    }

    const track = await dbService.getTrack(targetTrackId);
    if (!track) return res.status(404).json({ error: 'Target track not found' });

    const currentSkills = user.skillLevels || {};
    const analysis = await aiService.analyzeSkillGaps(track, currentSkills);

    const report = {
      id: `gap-${uuidv4().slice(0, 8)}`,
      userId,
      trackId: track.id,
      trackName: track.trackName,
      gaps: analysis.gaps,
      overallMatchScore: analysis.overallMatchScore,
      aiSummary: analysis.aiSummary,
      generatedAt: new Date().toISOString()
    };

    await dbService.saveSkillGapReport(report);

    // Refresh recommendations automatically based on gaps
    const recReport = await recommendationService.generateLearningPath(userId, track.id, analysis.gaps);

    return res.json({ success: true, report, recommendation: recReport });
  } catch (error) {
    console.error('Error in /skillgap/analyze:', error);
    return res.status(500).json({ error: 'Failed to analyze skill gaps' });
  }
});

// GET /api/skillgap/latest - Get latest skill-gap report for learner
router.get('/skillgap/latest', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query as { userId: string };
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const report = await dbService.getLatestSkillGapReport(userId);
    if (!report) {
      return res.status(404).json({ error: 'No skill gap report found for this user' });
    }

    return res.json({ success: true, report });
  } catch (error) {
    console.error('Error fetching skill gap report:', error);
    return res.status(500).json({ error: 'Failed to fetch skill gap report' });
  }
});

export default router;
