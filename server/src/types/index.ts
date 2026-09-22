export type UserRole = 'learner' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  targetTrackId?: string;
  skillLevels?: Record<string, number>; // skillId -> proficiency 1..5
  createdAt: string;
  updatedAt: string;
}

export interface SkillItem {
  id: string;
  name: string;
  description: string;
  category: 'foundational' | 'core' | 'advanced';
  targetLevel: number; // 1 to 5
  weight: number; // 1 to 3 priority weight
}

export interface SkillTrack {
  id: string;
  trackName: string;
  description: string;
  icon: string;
  skills: SkillItem[];
}

export interface AssessmentRecord {
  id: string;
  userId: string;
  trackId: string;
  mode: 'quiz' | 'self_rate';
  results: Record<string, number>; // skillId -> level (1..5)
  score?: number;
  completedAt: string;
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
  overallMatchScore: number; // percentage (0..100)
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
  quizId: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  skillTag: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
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
  skillImpact: Record<string, number>; // skillId -> increment
  attemptedAt: string;
}

export interface ProgressLog {
  id: string;
  userId: string;
  timestamp: string;
  skillLevels: Record<string, number>;
  overallMastery: number;
  trigger: 'assessment' | 'quiz' | 'course_completion' | 'manual_update';
}
