import { Router, Request, Response } from 'express';
import { dbService } from '../services/firestore.service';

const router = Router();

// GET /api/tracks - Retrieve all skill tracks
router.get('/tracks', async (_req: Request, res: Response) => {
  try {
    const tracks = await dbService.getTracks();
    return res.json({ success: true, tracks });
  } catch (error) {
    console.error('Error getting tracks:', error);
    return res.status(500).json({ error: 'Failed to fetch tracks' });
  }
});

// POST /api/onboarding/select-track - Save learner's target track
router.post('/onboarding/select-track', async (req: Request, res: Response) => {
  try {
    const { userId, trackId } = req.body;
    if (!userId || !trackId) {
      return res.status(400).json({ error: 'userId and trackId are required' });
    }

    const track = await dbService.getTrack(trackId);
    if (!track) {
      return res.status(404).json({ error: 'Selected track does not exist' });
    }

    let user = await dbService.getUser(userId);
    if (!user) {
      user = {
        uid: userId,
        email: `${userId}@skillsetu.io`,
        displayName: 'Learner',
        role: 'learner',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    user.targetTrackId = trackId;
    // Initialize default skill levels to 0 if absent
    if (!user.skillLevels) {
      user.skillLevels = {};
      track.skills.forEach(s => {
        user!.skillLevels![s.id] = 0;
      });
    }

    await dbService.setUser(user);
    return res.json({ success: true, user, track });
  } catch (error) {
    console.error('Error selecting track:', error);
    return res.status(500).json({ error: 'Failed to save selected track' });
  }
});

export default router;
