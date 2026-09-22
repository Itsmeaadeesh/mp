import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbService } from '../services/firestore.service';
import { aiService } from '../services/ai.service';
import { recommendationService } from '../services/recommendation.service';

const router = Router();

// POST /api/progress/update - Explicitly update skill levels and recalculate learning path
router.post('/progress/update', async (req: Request, res: Response) => {
  try {
    const { userId, skillUpdates, trigger = 'manual_update' } = req.body;
    if (!userId || !skillUpdates) {
      return res.status(400).json({ error: 'userId and skillUpdates are required' });
    }

    const user = await dbService.getUser(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.skillLevels = {
      ...(user.skillLevels || {}),
      ...skillUpdates
    };
    await dbService.setUser(user);

    let updatedRecs = null;
    let gapReport = null;

    if (user.targetTrackId) {
      const track = await dbService.getTrack(user.targetTrackId);
      if (track) {
        const gapAnalysis = await aiService.analyzeSkillGaps(track, user.skillLevels || {});
        gapReport = {
          id: `gap-${Date.now()}`,
          userId,
          trackId: track.id,
          trackName: track.trackName,
          gaps: gapAnalysis.gaps,
          overallMatchScore: gapAnalysis.overallMatchScore,
          aiSummary: gapAnalysis.aiSummary,
          generatedAt: new Date().toISOString()
        };
        await dbService.saveSkillGapReport(gapReport);

        updatedRecs = await recommendationService.generateLearningPath(
          userId,
          track.id,
          gapAnalysis.gaps
        );

        await dbService.logProgress({
          id: `prog-${uuidv4().slice(0, 8)}`,
          userId,
          timestamp: new Date().toISOString(),
          skillLevels: user.skillLevels || {},
          overallMastery: gapAnalysis.overallMatchScore,
          trigger
        });
      }
    }

    return res.json({
      success: true,
      user,
      gapReport,
      recommendation: updatedRecs
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    return res.status(500).json({ error: 'Failed to update skill progress' });
  }
});

// GET /api/progress/history - Historical logs of skill changes over time
router.get('/progress/history', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query as { userId: string };
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const logs = await dbService.getProgressLogs(userId);
    return res.json({ success: true, logs });
  } catch (error) {
    console.error('Error getting progress history:', error);
    return res.status(500).json({ error: 'Failed to fetch progress logs' });
  }
});

export default router;
