import fs from 'fs';
import path from 'path';
import { admin, isFirebaseInitialized } from '../config/firebase';
import {
  UserProfile,
  SkillTrack,
  Course,
  AssessmentRecord,
  SkillGapReport,
  RecommendationReport,
  QuizQuestion,
  QuizAttempt,
  ProgressLog
} from '../types';
import { INITIAL_TRACKS, INITIAL_COURSES } from '../data/seedData';

const STORE_PATH = path.join(__dirname, '../../data/firestore_store.json');

// Local fallback store structure
interface MemoryStore {
  users: Record<string, UserProfile>;
  skillCategories: Record<string, SkillTrack>;
  assessments: Record<string, AssessmentRecord>;
  skillGapReports: Record<string, SkillGapReport>;
  courses: Record<string, Course>;
  recommendations: Record<string, RecommendationReport>;
  quizQuestions: Record<string, QuizQuestion>;
  quizAttempts: Record<string, QuizAttempt>;
  progressLogs: Record<string, ProgressLog>;
}

class FirestoreService {
  private localStore: MemoryStore;

  constructor() {
    this.localStore = {
      users: {
        'demo-learner-123': {
          uid: 'demo-learner-123',
          email: 'learner@skillsetu.io',
          displayName: 'Aarav Sharma',
          role: 'learner',
          targetTrackId: 'frontend-dev',
          skillLevels: {
            'html-css': 3,
            'javascript-core': 2,
            'react-fundamentals': 2,
            'typescript': 1,
            'state-management': 1,
            'web-performance': 1,
            'testing-qa': 1
          },
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          updatedAt: new Date().toISOString()
        },
        'demo-admin-999': {
          uid: 'demo-admin-999',
          email: 'admin@skillsetu.io',
          displayName: 'Prof. Vikram Seth',
          role: 'admin',
          createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
          updatedAt: new Date().toISOString()
        }
      },
      skillCategories: {},
      assessments: {},
      skillGapReports: {},
      courses: {},
      recommendations: {},
      quizQuestions: {},
      quizAttempts: {},
      progressLogs: {}
    };

    this.initStore();
  }

  private initStore() {
    // Seed initial tracks and courses
    INITIAL_TRACKS.forEach(t => {
      this.localStore.skillCategories[t.id] = t;
    });

    INITIAL_COURSES.forEach(c => {
      this.localStore.courses[c.id] = c;
    });

    // Try loading persistent local file if exists
    try {
      if (fs.existsSync(STORE_PATH)) {
        const data = fs.readFileSync(STORE_PATH, 'utf-8');
        const parsed = JSON.parse(data);
        this.localStore = {
          ...this.localStore,
          ...parsed,
          skillCategories: { ...this.localStore.skillCategories, ...(parsed.skillCategories || {}) },
          courses: { ...this.localStore.courses, ...(parsed.courses || {}) }
        };
      } else {
        const dir = path.dirname(STORE_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(STORE_PATH, JSON.stringify(this.localStore, null, 2), 'utf-8');
      }
    } catch (err) {
      console.warn('Notice loading local store:', err);
    }
  }

  private persist() {
    try {
      const dir = path.dirname(STORE_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(STORE_PATH, JSON.stringify(this.localStore, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to persist store:', e);
    }
  }

  // ================= USERS =================
  async getUser(uid: string): Promise<UserProfile | null> {
    if (isFirebaseInitialized) {
      const snap = await admin.firestore().collection('users').doc(uid).get();
      if (snap.exists) return snap.data() as UserProfile;
    }
    return this.localStore.users[uid] || null;
  }

  async setUser(user: UserProfile): Promise<UserProfile> {
    user.updatedAt = new Date().toISOString();
    if (isFirebaseInitialized) {
      await admin.firestore().collection('users').doc(user.uid).set(user, { merge: true });
    }
    this.localStore.users[user.uid] = user;
    this.persist();
    return user;
  }

  async getAllUsers(): Promise<UserProfile[]> {
    if (isFirebaseInitialized) {
      const snap = await admin.firestore().collection('users').get();
      return snap.docs.map(d => d.data() as UserProfile);
    }
    return Object.values(this.localStore.users);
  }

  // ================= TRACKS & SKILLS =================
  async getTracks(): Promise<SkillTrack[]> {
    if (isFirebaseInitialized) {
      const snap = await admin.firestore().collection('skillCategories').get();
      if (!snap.empty) return snap.docs.map(d => d.data() as SkillTrack);
    }
    return Object.values(this.localStore.skillCategories);
  }

  async getTrack(id: string): Promise<SkillTrack | null> {
    if (isFirebaseInitialized) {
      const snap = await admin.firestore().collection('skillCategories').doc(id).get();
      if (snap.exists) return snap.data() as SkillTrack;
    }
    return this.localStore.skillCategories[id] || null;
  }

  // ================= COURSES =================
  async getCourses(): Promise<Course[]> {
    if (isFirebaseInitialized) {
      const snap = await admin.firestore().collection('courses').get();
      if (!snap.empty) return snap.docs.map(d => d.data() as Course);
    }
    return Object.values(this.localStore.courses);
  }

  async getCourse(id: string): Promise<Course | null> {
    if (isFirebaseInitialized) {
      const snap = await admin.firestore().collection('courses').doc(id).get();
      if (snap.exists) return snap.data() as Course;
    }
    return this.localStore.courses[id] || null;
  }

  async saveCourse(course: Course): Promise<Course> {
    if (isFirebaseInitialized) {
      await admin.firestore().collection('courses').doc(course.id).set(course);
    }
    this.localStore.courses[course.id] = course;
    this.persist();
    return course;
  }

  async deleteCourse(id: string): Promise<boolean> {
    if (isFirebaseInitialized) {
      await admin.firestore().collection('courses').doc(id).delete();
    }
    delete this.localStore.courses[id];
    this.persist();
    return true;
  }

  // ================= ASSESSMENTS =================
  async saveAssessment(record: AssessmentRecord): Promise<AssessmentRecord> {
    if (isFirebaseInitialized) {
      await admin.firestore().collection('assessments').doc(record.id).set(record);
    }
    this.localStore.assessments[record.id] = record;
    this.persist();
    return record;
  }

  async getLatestAssessment(userId: string): Promise<AssessmentRecord | null> {
    if (isFirebaseInitialized) {
      const snap = await admin.firestore().collection('assessments')
        .where('userId', '==', userId)
        .orderBy('completedAt', 'desc')
        .limit(1)
        .get();
      if (!snap.empty) return snap.docs[0].data() as AssessmentRecord;
    }
    const userAssessments = Object.values(this.localStore.assessments)
      .filter(a => a.userId === userId)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
    return userAssessments[0] || null;
  }

  // ================= SKILL GAP REPORTS =================
  async saveSkillGapReport(report: SkillGapReport): Promise<SkillGapReport> {
    if (isFirebaseInitialized) {
      await admin.firestore().collection('skillGapReports').doc(report.id).set(report);
    }
    this.localStore.skillGapReports[report.id] = report;
    this.persist();
    return report;
  }

  async getLatestSkillGapReport(userId: string): Promise<SkillGapReport | null> {
    if (isFirebaseInitialized) {
      const snap = await admin.firestore().collection('skillGapReports')
        .where('userId', '==', userId)
        .orderBy('generatedAt', 'desc')
        .limit(1)
        .get();
      if (!snap.empty) return snap.docs[0].data() as SkillGapReport;
    }
    const reports = Object.values(this.localStore.skillGapReports)
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());
    return reports[0] || null;
  }

  async getAllSkillGapReports(): Promise<SkillGapReport[]> {
    if (isFirebaseInitialized) {
      const snap = await admin.firestore().collection('skillGapReports').get();
      return snap.docs.map(d => d.data() as SkillGapReport);
    }
    return Object.values(this.localStore.skillGapReports);
  }

  // ================= RECOMMENDATIONS =================
  async saveRecommendation(rec: RecommendationReport): Promise<RecommendationReport> {
    rec.updatedAt = new Date().toISOString();
    if (isFirebaseInitialized) {
      await admin.firestore().collection('recommendations').doc(rec.id).set(rec);
    }
    this.localStore.recommendations[rec.id] = rec;
    this.persist();
    return rec;
  }

  async getLatestRecommendation(userId: string): Promise<RecommendationReport | null> {
    if (isFirebaseInitialized) {
      const snap = await admin.firestore().collection('recommendations')
        .where('userId', '==', userId)
        .orderBy('updatedAt', 'desc')
        .limit(1)
        .get();
      if (!snap.empty) return snap.docs[0].data() as RecommendationReport;
    }
    const recs = Object.values(this.localStore.recommendations)
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return recs[0] || null;
  }

  async getAllRecommendations(): Promise<RecommendationReport[]> {
    if (isFirebaseInitialized) {
      const snap = await admin.firestore().collection('recommendations').get();
      return snap.docs.map(d => d.data() as RecommendationReport);
    }
    return Object.values(this.localStore.recommendations);
  }

  // ================= QUIZZES & QUESTIONS =================
  async saveQuizQuestions(questions: QuizQuestion[]): Promise<QuizQuestion[]> {
    if (isFirebaseInitialized) {
      const batch = admin.firestore().batch();
      questions.forEach(q => {
        const ref = admin.firestore().collection('quizQuestions').doc(q.id);
        batch.set(ref, q);
      });
      await batch.commit();
    }
    questions.forEach(q => {
      this.localStore.quizQuestions[q.id] = q;
    });
    this.persist();
    return questions;
  }

  async getQuizQuestions(quizId: string): Promise<QuizQuestion[]> {
    if (isFirebaseInitialized) {
      const snap = await admin.firestore().collection('quizQuestions')
        .where('quizId', '==', quizId)
        .get();
      if (!snap.empty) return snap.docs.map(d => d.data() as QuizQuestion);
    }
    return Object.values(this.localStore.quizQuestions).filter(q => q.quizId === quizId);
  }

  // ================= QUIZ ATTEMPTS =================
  async saveQuizAttempt(attempt: QuizAttempt): Promise<QuizAttempt> {
    if (isFirebaseInitialized) {
      await admin.firestore().collection('quizAttempts').doc(attempt.id).set(attempt);
    }
    this.localStore.quizAttempts[attempt.id] = attempt;
    this.persist();
    return attempt;
  }

  async getQuizAttempts(userId: string): Promise<QuizAttempt[]> {
    if (isFirebaseInitialized) {
      const snap = await admin.firestore().collection('quizAttempts')
        .where('userId', '==', userId)
        .orderBy('attemptedAt', 'desc')
        .get();
      return snap.docs.map(d => d.data() as QuizAttempt);
    }
    return Object.values(this.localStore.quizAttempts)
      .filter(a => a.userId === userId)
      .sort((a, b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime());
  }

  async getAllQuizAttempts(): Promise<QuizAttempt[]> {
    if (isFirebaseInitialized) {
      const snap = await admin.firestore().collection('quizAttempts').get();
      return snap.docs.map(d => d.data() as QuizAttempt);
    }
    return Object.values(this.localStore.quizAttempts);
  }

  // ================= PROGRESS LOGS =================
  async logProgress(log: ProgressLog): Promise<ProgressLog> {
    if (isFirebaseInitialized) {
      await admin.firestore().collection('progressLogs').doc(log.id).set(log);
    }
    this.localStore.progressLogs[log.id] = log;
    this.persist();
    return log;
  }

  async getProgressLogs(userId: string): Promise<ProgressLog[]> {
    if (isFirebaseInitialized) {
      const snap = await admin.firestore().collection('progressLogs')
        .where('userId', '==', userId)
        .orderBy('timestamp', 'asc')
        .get();
      return snap.docs.map(d => d.data() as ProgressLog);
    }
    return Object.values(this.localStore.progressLogs)
      .filter(l => l.userId === userId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }
}

export const dbService = new FirestoreService();
