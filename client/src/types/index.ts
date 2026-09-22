export type UserRole = 'learner' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  targetTrackId?: string;
  skillLevels?: Record<string, number>;
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  description: string;
  category: 'foundational' | 'core' | 'advanced';
  targetLevel: number;
  weight: number;
}

export interface SkillTrack {
  id: string;
  trackName: string;
  description: string;
  icon: string;
  skills: SkillItem[];
}

export interface SkillGapItem {
  skillId: string;
  skillName: string;
  currentLevel: number;
  requiredLevel: number;
  gapScore: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  rationale: string;
}

export interface SkillGapReport {
  id: string;
  userId: string;
  trackId: string;
  trackName: string;
  gaps: SkillGapItem[];
  overallMatchScore: number;
  aiSummary: string;
  generatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  provider: string;
  description: string;
  url: string;
  duration: string;
  rating: number;
  level: 'foundational' | 'intermediate' | 'advanced';
  skillTags: string[];
}

export interface RecommendedCourseItem {
  courseId: string;
  title: string;
  provider: string;
  duration: string;
  level: 'foundational' | 'intermediate' | 'advanced';
  skillTags: string[];
  order: number;
  completed: boolean;
  status: 'current' | 'locked' | 'completed';
}

export interface RecommendationReport {
  id: string;
  userId: string;
  trackId: string;
  path: RecommendedCourseItem[];
  totalCourses: number;
  completedCourses: number;
  completionPercentage: number;
  generatedAt: string;
  updatedAt: string;
}

export interface QuizQuestion {
  id: string;
  quizId?: string;
  question: string;
  options: string[];
  correctAnswerIndex?: number;
  explanation?: string;
  skillTag?: string;
  difficulty?: string;
}

export interface QuizAttemptAnswer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  explanation: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: QuizAttemptAnswer[];
  skillImpact?: Record<string, number>;
  attemptedAt: string;
}

export interface ProgressLog {
  id: string;
  userId: string;
  timestamp: string;
  skillLevels: Record<string, number>;
  overallMastery: number;
  trigger: string;
}

export interface LearnerDashboardData {
  user: UserProfile;
  track: SkillTrack;
  gapReport: SkillGapReport;
  recommendation: RecommendationReport;
  quizAttempts: QuizAttempt[];
  progressLogs: ProgressLog[];
  chartData: {
    radar: Array<{ skill: string; current: number; target: number; fullMark: number }>;
    gaps: Array<{ name: string; gapScore: number; deficit: number; priority: string }>;
  };
}

export interface AdminDashboardData {
  stats: {
    totalLearners: number;
    totalCourses: number;
    totalTracks: number;
    totalQuizzesTaken: number;
    courseCompletionRate: number;
    averageQuizPassingRate: number;
  };
  mostCommonWeakSkills: Array<{ name: string; count: number; totalDeficit: number }>;
  trackDistribution: Array<{ trackName: string; learnerCount: number; averageMatchScore: number }>;
  recentLearners: UserProfile[];
}
