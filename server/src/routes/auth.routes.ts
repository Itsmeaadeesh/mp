import { Router, Request, Response } from 'express';
import { admin, isFirebaseInitialized } from '../config/firebase';
import { dbService } from '../services/firestore.service';
import { UserProfile } from '../types';

const router = Router();

// POST /api/auth/set-role - Set custom claims or update user profile role
router.post('/set-role', async (req: Request, res: Response) => {
  try {
    const { uid, role, email, displayName } = req.body;

    if (!uid || !role) {
      return res.status(400).json({ error: 'uid and role are required' });
    }

    if (role !== 'learner' && role !== 'admin') {
      return res.status(400).json({ error: 'Role must be either learner or admin' });
    }

    // Set custom claims in Firebase Auth if available
    if (isFirebaseInitialized) {
      try {
        await admin.auth().setCustomUserClaims(uid, { role, admin: role === 'admin' });
      } catch (authError) {
        console.warn('Notice setting custom claims:', authError);
      }
    }

    // Update or create user record in Firestore
    let existing = await dbService.getUser(uid);
    if (!existing) {
      existing = {
        uid,
        email: email || `${uid}@skillsetu.io`,
        displayName: displayName || (role === 'admin' ? 'Administrator' : 'Learner'),
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } else {
      existing.role = role;
      if (email) existing.email = email;
      if (displayName) existing.displayName = displayName;
    }

    const saved = await dbService.setUser(existing);
    return res.json({ success: true, user: saved });
  } catch (error) {
    console.error('Error in /set-role:', error);
    return res.status(500).json({ error: 'Failed to assign role' });
  }
});

// POST /api/auth/sync-profile - Sync user on login
router.post('/sync-profile', async (req: Request, res: Response) => {
  try {
    const { uid, email, displayName } = req.body;
    if (!uid) return res.status(400).json({ error: 'uid is required' });

    let user = await dbService.getUser(uid);
    if (!user) {
      user = {
        uid,
        email: email || 'user@skillsetu.io',
        displayName: displayName || 'Learner',
        role: 'learner',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await dbService.setUser(user);
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error('Error syncing profile:', error);
    return res.status(500).json({ error: 'Failed to sync profile' });
  }
});

export default router;
