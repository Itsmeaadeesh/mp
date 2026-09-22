import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbService } from '../services/firestore.service';
import { aiService } from '../services/ai.service';
import { recommendationService } from '../services/recommendation.service';
import { BASELINE_QUIZZES } from '../data/seedData';
import { AssessmentRecord } from '../types';

const router = Router();

// GET /api/assessment/start - Get questions or skill criteria for baseline assessment
router.get('/assessment/start', async (req: Request, res: Response) => {
  try {
    const { trackId, mode = 'self_rate' } = req.query as { trackId: string; mode: string };
    if (!trackId) {
      return res.status(400).json({ error: 'trackId query param is required' });
    }

    const track = await dbService.getTrack(trackId);
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    if (mode === 'quiz') {
      const questions = BASELINE_QUIZZES[trackId] || BASELINE_QUIZZES['frontend-dev'];
      // Strip answers from returned questions for security
      const sanitized = questions.map(({ correctAnswerIndex, explanation, ...q }) => q);
      return res.json({ success: true, mode: 'quiz', track, questions: sanitized });
    }

    return res.json({ success: true, mode: 'self_rate', track, skills: track.skills });
  } catch (error) {
    console.error('Error starting assessment:', error);
    return res.status(500).json({ error: 'Failed to start assessment' });
  }
});

// POST /api/assessment/submit - Submit baseline assessment (quiz or self-rate)
router.post('/assessment/submit', async (req: Request, res: Response) => {
  try {
    const { userId, trackId, mode, ratings, quizAnswers } = req.body;

    if (!userId || !trackId || !mode) {
      return res.status(400).json({ error: 'userId, trackId, and mode are required' });
    }

    const track = await dbService.getTrack(trackId);
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    let calculatedSkills: Record<string, number> = {};
    let overallScore = 0;

    if (mode === 'self_rate') {
      // Direct proficiency self-rating (1 to 5 per skill)
      track.skills.forEach(skill => {
        const rating = Number(ratings?.[skill.id]);
        calculatedSkills[skill.id] = (!isNaN(rating) && rating >= 1 && rating <= 5) ? rating : 1;
      });
      const sum = Object.values(calculatedSkills).reduce((a, b) => a + b, 0);
      overallScore = Math.round((sum / (track.skills.length * 5)) * 100);
    } else if (mode === 'quiz') {
      // Diagnostic quiz scoring
      const questions = BASELINE_QUIZZES[trackId] || BASELINE_QUIZZES['frontend-dev'];
      let correctCount = 0;

      // Map question performance to skill tags
      const skillCorrect: Record<string, number> = {};
      const skillTotal: Record<string, number> = {};

      track.skills.forEach(s => {
        skillCorrect[s.id] = 0;
        skillTotal[s.id] = 0;
      });

      questions.forEach(q => {
        const userChoice = quizAnswers?.[q.id];
        if (skillTotal[q.skillTag] !== undefined) {
          skillTotal[q.skillTag]++;
        }
        if (userChoice === q.correctAnswerIndex) {
          correctCount++;
          if (skillCorrect[q.skillTag] !== undefined) {
            skillCorrect[q.skillTag]++;
          }
        }
      });

      track.skills.forEach(s => {
        const total = skillTotal[s.id] || 0;
        const correct = skillCorrect[s.id] || 0;
        if (total > 0) {
          // Scale from 1 to 5
          calculatedSkills[s.id] = Math.max(1, Math.min(5, Math.round((correct / total) * 4) + 1));
        } else {
          calculatedSkills[s.id] = 2; // Baseline conservative estimation
        }
      });

      overallScore = Math.round((correctCount / questions.length) * 100);
    }

    // 1. Save assessment record in Firestore
    const assessmentRecord: AssessmentRecord = {
      id: `asmt-${uuidv4().slice(0, 8)}`,
      userId,
      trackId,
      mode,
      results: calculatedSkills,
      score: overallScore,
      completedAt: new Date().toISOString()
    };
    await dbService.saveAssessment(assessmentRecord);

    // 2. Update user profile with new skill levels
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
    user.skillLevels = { ...(user.skillLevels || {}), ...calculatedSkills };
    await dbService.setUser(user);

    // 3. Immediately run Skill-Gap Analysis & priority ranking via Gemini
    const gapAnalysis = await aiService.analyzeSkillGaps(track, user.skillLevels);
    const gapReport = {
      id: `gap-${uuidv4().slice(0, 8)}`,
      userId,
      trackId,
      trackName: track.trackName,
      gaps: gapAnalysis.gaps,
      overallMatchScore: gapAnalysis.overallMatchScore,
      aiSummary: gapAnalysis.aiSummary,
      generatedAt: new Date().toISOString()
    };
    await dbService.saveSkillGapReport(gapReport);

    // 4. Generate ordered learning path (foundational -> advanced)
    const recReport = await recommendationService.generateLearningPath(userId, trackId, gapAnalysis.gaps);

    // 5. Record progress log
    await dbService.logProgress({
      id: `prog-${uuidv4().slice(0, 8)}`,
      userId,
      timestamp: new Date().toISOString(),
      skillLevels: user.skillLevels,
      overallMastery: gapAnalysis.overallMatchScore,
      trigger: 'assessment'
    });

    return res.json({
      success: true,
      assessment: assessmentRecord,
      gapReport,
      recommendation: recReport,
      updatedUser: user
    });
  } catch (error) {
    console.error('Error submitting assessment:', error);
    return res.status(500).json({ error: 'Failed to evaluate assessment' });
  }
});

// GET /api/assessment/results - Get latest assessment results
router.get('/assessment/results', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query as { userId: string };
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const assessment = await dbService.getLatestAssessment(userId);
    if (!assessment) {
      return res.status(404).json({ error: 'No assessment records found for this user' });
    }

    const gapReport = await dbService.getLatestSkillGapReport(userId);
    return res.json({ success: true, assessment, gapReport });
  } catch (error) {
    console.error('Error getting assessment results:', error);
    return res.status(500).json({ error: 'Failed to retrieve assessment results' });
  }
});

export default router;
