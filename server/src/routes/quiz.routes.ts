import { Router, Request, Response } from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import { v4 as uuidv4 } from 'uuid';
import { aiService } from '../services/ai.service';
import { dbService } from '../services/firestore.service';
import { recommendationService } from '../services/recommendation.service';
import { QuizQuestion, QuizAttempt, QuizAttemptAnswer } from '../types';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 } // 20 MB max
});

const router = Router();

// POST /api/quiz/generate - Upload PDF/PPT/Text file or text body -> Gemini extracts and generates MCQs
router.post('/quiz/generate', upload.single('file'), async (req: Request, res: Response) => {
  try {
    let extractedText = req.body.text || '';
    const topic = req.body.topic || 'Curriculum Assessment';
    const questionCount = parseInt(req.body.questionCount) || 5;

    // If a file was uploaded, extract text based on mimetype
    if (req.file) {
      const buffer = req.file.buffer;
      const mime = req.file.mimetype;
      const originalName = req.file.originalname.toLowerCase();

      if (mime === 'application/pdf' || originalName.endsWith('.pdf')) {
        try {
          const pdfData = await pdfParse(buffer);
          extractedText = pdfData.text;
        } catch (pdfErr) {
          console.warn('PDF parse fallback:', pdfErr);
          extractedText = buffer.toString('utf-8');
        }
      } else {
        // Plain text, markdown, or text-encoded PPT notes
        extractedText = buffer.toString('utf-8');
      }
    }

    if (!extractedText || extractedText.trim().length === 0) {
      extractedText = `Subject: ${topic}. Key focus areas include core architectural fundamentals, declarative patterns, performance optimization, and modular testing best practices.`;
    }

    // Call AI Service to generate questions via Gemini
    const questions = await aiService.generateQuizFromText(extractedText, topic, questionCount);

    // Save to Firestore collection `quizQuestions/{id}`
    await dbService.saveQuizQuestions(questions);

    const quizId = questions[0]?.quizId || `quiz-${Date.now()}`;

    // Return sanitized questions (without answers) for client display
    const sanitizedQuestions = questions.map(({ correctAnswerIndex, explanation, ...q }) => q);

    return res.json({
      success: true,
      quizId,
      topic,
      totalQuestions: questions.length,
      questions: sanitizedQuestions
    });
  } catch (error) {
    console.error('Error generating quiz:', error);
    return res.status(500).json({ error: 'Failed to generate quiz from document' });
  }
});

// GET /api/quiz/:id - Fetch questions for a specific quiz
router.get('/quiz/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const questions = await dbService.getQuizQuestions(id);

    if (questions.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Return without answers so learner can take it fairly
    const sanitized = questions.map(({ correctAnswerIndex, explanation, ...q }) => q);
    return res.json({ success: true, quizId: id, questions: sanitized });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// POST /api/quiz/:id/submit - Evaluate answers, show score + per-question explanations, and update skills
router.post('/quiz/:id/submit', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, answers: userAnswers, quizTitle = 'Module Practice Quiz' } = req.body;

    if (!userId || !userAnswers) {
      return res.status(400).json({ error: 'userId and answers are required' });
    }

    const questions = await dbService.getQuizQuestions(id);
    if (questions.length === 0) {
      return res.status(404).json({ error: 'Quiz questions not found' });
    }

    let score = 0;
    const evaluatedAnswers: QuizAttemptAnswer[] = [];
    const skillGains: Record<string, number> = {};

    questions.forEach(q => {
      const selectedOption = userAnswers[q.id];
      const isCorrect = selectedOption === q.correctAnswerIndex;

      if (isCorrect) {
        score++;
        skillGains[q.skillTag] = (skillGains[q.skillTag] || 0) + 1;
      }

      evaluatedAnswers.push({
        questionId: q.id,
        selectedOption: selectedOption !== undefined ? selectedOption : -1,
        isCorrect,
        explanation: q.explanation,
        questionText: q.question,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex
      });
    });

    const percentage = Math.round((score / questions.length) * 100);

    // Save attempt in Firestore `quizAttempts/{id}`
    const attempt: QuizAttempt = {
      id: `att-${uuidv4().slice(0, 8)}`,
      userId,
      quizId: id,
      quizTitle,
      score,
      totalQuestions: questions.length,
      percentage,
      answers: evaluatedAnswers,
      skillImpact: skillGains,
      attemptedAt: new Date().toISOString()
    };
    await dbService.saveQuizAttempt(attempt);

    // If learner scored >= 60%, level up corresponding skills in Firestore `users/{uid}`
    const user = await dbService.getUser(userId);
    let updatedRecommendations = null;

    if (user && percentage >= 60) {
      user.skillLevels = user.skillLevels || {};

      Object.keys(skillGains).forEach(skillTag => {
        // Find if this tag matches any track skill ID directly or partially
        const current = user!.skillLevels![skillTag] || 1;
        user!.skillLevels![skillTag] = Math.min(5, current + 1);
      });

      await dbService.setUser(user);

      // Re-trigger gap analysis and recommendation recalculation
      const track = await dbService.getTrack(user.targetTrackId || 'frontend-dev');
      if (track) {
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

        updatedRecommendations = await recommendationService.generateLearningPath(
          userId,
          track.id,
          gapAnalysis.gaps
        );

        // Record progress log
        await dbService.logProgress({
          id: `prog-${Date.now()}`,
          userId,
          timestamp: new Date().toISOString(),
          skillLevels: user.skillLevels,
          overallMastery: gapAnalysis.overallMatchScore,
          trigger: 'quiz'
        });
      }
    }

    return res.json({
      success: true,
      attempt,
      updatedRecommendations,
      message: percentage >= 60 ? 'Congratulations! Your skill proficiency has leveled up.' : 'Keep practicing to level up this skill.'
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return res.status(500).json({ error: 'Failed to submit quiz attempt' });
  }
});

// GET /api/quiz/attempts/:userId - History of past attempts
router.get('/quiz/attempts/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const attempts = await dbService.getQuizAttempts(userId);
    return res.json({ success: true, attempts });
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    return res.status(500).json({ error: 'Failed to fetch quiz history' });
  }
});

export default router;
