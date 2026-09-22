import {
  SkillTrack,
  Course,
  SkillGapReport,
  RecommendationReport,
  QuizQuestion,
  QuizAttempt,
  LearnerDashboardData,
  AdminDashboardData,
  UserProfile
} from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorData.error || `HTTP ${res.status}: Request failed`);
  }
  return res.json();
}

export const api = {
  // Authentication & Custom Claims
  async setRole(uid: string, role: 'learner' | 'admin', email?: string, displayName?: string) {
    const res = await fetch(`${BASE_URL}/auth/set-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, role, email, displayName })
    });
    return handleResponse<{ success: boolean; user: UserProfile }>(res);
  },

  async syncProfile(uid: string, email?: string, displayName?: string) {
    const res = await fetch(`${BASE_URL}/auth/sync-profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, email, displayName })
    });
    return handleResponse<{ success: boolean; user: UserProfile }>(res);
  },

  // Onboarding & Tracks
  async getTracks(): Promise<{ success: boolean; tracks: SkillTrack[] }> {
    const res = await fetch(`${BASE_URL}/tracks`);
    return handleResponse(res);
  },

  async selectTrack(userId: string, trackId: string) {
    const res = await fetch(`${BASE_URL}/onboarding/select-track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, trackId })
    });
    return handleResponse<{ success: boolean; user: UserProfile; track: SkillTrack }>(res);
  },

  // Assessments
  async startAssessment(trackId: string, mode: 'quiz' | 'self_rate' = 'self_rate') {
    const res = await fetch(`${BASE_URL}/assessment/start?trackId=${trackId}&mode=${mode}`);
    return handleResponse<{
      success: boolean;
      mode: string;
      track: SkillTrack;
      questions?: QuizQuestion[];
      skills?: any[];
    }>(res);
  },

  async submitAssessment(payload: {
    userId: string;
    trackId: string;
    mode: 'quiz' | 'self_rate';
    ratings?: Record<string, number>;
    quizAnswers?: Record<string, number>;
  }) {
    const res = await fetch(`${BASE_URL}/assessment/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse<{
      success: boolean;
      assessment: any;
      gapReport: SkillGapReport;
      recommendation: RecommendationReport;
      updatedUser: UserProfile;
    }>(res);
  },

  async getAssessmentResults(userId: string) {
    const res = await fetch(`${BASE_URL}/assessment/results?userId=${userId}`);
    return handleResponse<{ success: boolean; assessment: any; gapReport: SkillGapReport }>(res);
  },

  // Skill-Gap Analysis
  async analyzeSkillGap(userId: string, trackId?: string) {
    const res = await fetch(`${BASE_URL}/skillgap/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, trackId })
    });
    return handleResponse<{ success: boolean; report: SkillGapReport; recommendation: RecommendationReport }>(res);
  },

  async getLatestSkillGap(userId: string) {
    const res = await fetch(`${BASE_URL}/skillgap/latest?userId=${userId}`);
    return handleResponse<{ success: boolean; report: SkillGapReport }>(res);
  },

  // Recommendations & Learning Paths
  async generateRecommendations(userId: string, trackId?: string) {
    const res = await fetch(`${BASE_URL}/recommendations/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, trackId })
    });
    return handleResponse<{ success: boolean; recommendation: RecommendationReport }>(res);
  },

  async getLatestRecommendation(userId: string) {
    const res = await fetch(`${BASE_URL}/recommendations/latest?userId=${userId}`);
    return handleResponse<{ success: boolean; recommendation: RecommendationReport }>(res);
  },

  async completeCourse(userId: string, courseId: string) {
    const res = await fetch(`${BASE_URL}/recommendations/complete-course`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, courseId })
    });
    return handleResponse<{
      success: boolean;
      message: string;
      updatedUser: UserProfile;
      recommendation: RecommendationReport;
    }>(res);
  },

  // AI Quiz Generation
  async generateQuiz(data: FormData | { text: string; topic: string; questionCount?: number }) {
    let res: Response;
    if (data instanceof FormData) {
      res = await fetch(`${BASE_URL}/quiz/generate`, {
        method: 'POST',
        body: data
      });
    } else {
      res = await fetch(`${BASE_URL}/quiz/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
    return handleResponse<{
      success: boolean;
      quizId: string;
      topic: string;
      totalQuestions: number;
      questions: QuizQuestion[];
    }>(res);
  },

  async getQuiz(quizId: string) {
    const res = await fetch(`${BASE_URL}/quiz/${quizId}`);
    return handleResponse<{ success: boolean; quizId: string; questions: QuizQuestion[] }>(res);
  },

  async submitQuiz(quizId: string, payload: {
    userId: string;
    answers: Record<string, number>;
    quizTitle?: string;
  }) {
    const res = await fetch(`${BASE_URL}/quiz/${quizId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse<{
      success: boolean;
      attempt: QuizAttempt;
      updatedRecommendations?: RecommendationReport;
      message: string;
    }>(res);
  },

  async getQuizAttempts(userId: string) {
    const res = await fetch(`${BASE_URL}/quiz/attempts/${userId}`);
    return handleResponse<{ success: boolean; attempts: QuizAttempt[] }>(res);
  },

  // Progress Updates
  async updateProgress(userId: string, skillUpdates: Record<string, number>) {
    const res = await fetch(`${BASE_URL}/progress/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, skillUpdates })
    });
    return handleResponse<{
      success: boolean;
      user: UserProfile;
      gapReport: SkillGapReport;
      recommendation: RecommendationReport;
    }>(res);
  },

  async getProgressHistory(userId: string) {
    const res = await fetch(`${BASE_URL}/progress/history?userId=${userId}`);
    return handleResponse<{ success: boolean; logs: any[] }>(res);
  },

  // Courses Catalogue (CRUD)
  async getCourses(params?: { skill?: string; level?: string }) {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${BASE_URL}/courses${query ? `?${query}` : ''}`);
    return handleResponse<{ success: boolean; count: number; courses: Course[] }>(res);
  },

  async createCourse(course: Omit<Course, 'id'>) {
    const res = await fetch(`${BASE_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course)
    });
    return handleResponse<{ success: boolean; course: Course }>(res);
  },

  async updateCourse(id: string, course: Partial<Course>) {
    const res = await fetch(`${BASE_URL}/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course)
    });
    return handleResponse<{ success: boolean; course: Course }>(res);
  },

  async deleteCourse(id: string) {
    const res = await fetch(`${BASE_URL}/courses/${id}`, {
      method: 'DELETE'
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  // Dashboards
  async getLearnerDashboard(userId: string): Promise<LearnerDashboardData> {
    const res = await fetch(`${BASE_URL}/dashboard/learner?userId=${userId}`);
    return handleResponse<LearnerDashboardData>(res);
  },

  async getAdminDashboard(): Promise<AdminDashboardData> {
    const res = await fetch(`${BASE_URL}/dashboard/admin`);
    return handleResponse<AdminDashboardData>(res);
  }
};
