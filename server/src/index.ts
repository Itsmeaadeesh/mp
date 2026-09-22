import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as functions from 'firebase-functions';

import authRoutes from './routes/auth.routes';
import onboardingRoutes from './routes/onboarding.routes';
import assessmentRoutes from './routes/assessment.routes';
import skillgapRoutes from './routes/skillgap.routes';
import recommendationRoutes from './routes/recommendation.routes';
import quizRoutes from './routes/quiz.routes';
import progressRoutes from './routes/progress.routes';
import coursesRoutes from './routes/courses.routes';
import dashboardRoutes from './routes/dashboard.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'Skill Setu Backend API',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api', onboardingRoutes);
app.use('/api', assessmentRoutes);
app.use('/api', skillgapRoutes);
app.use('/api', recommendationRoutes);
app.use('/api', quizRoutes);
app.use('/api', progressRoutes);
app.use('/api', coursesRoutes);
app.use('/api', dashboardRoutes);

// Root Fallback
app.get('/', (_req: Request, res: Response) => {
  res.send('Skill Setu API is running. Access API endpoints under /api/*');
});

// Conditionally start local HTTP server if not invoked inside Firebase Cloud Function environment
if (process.env.NODE_ENV !== 'test' && !process.env.FUNCTION_NAME) {
  app.listen(PORT, () => {
    console.log(`🚀 Skill Setu Server is running on port ${PORT}`);
    console.log(`📡 API Endpoints available at http://localhost:${PORT}/api`);
  });
}

// Export for Firebase Cloud Functions deployment
export const api = functions.https.onRequest(app);

export default app;
