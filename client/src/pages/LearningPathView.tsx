import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { RecommendationReport, RecommendedCourseItem } from '../types';
import { BookOpen, CheckCircle, Lock, Play, ExternalLink, Award, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LearningPathViewProps {
  initialReport?: RecommendationReport | null;
  onNavigateToQuiz: () => void;
}

export const LearningPathView: React.FC<LearningPathViewProps> = ({ initialReport, onNavigateToQuiz }) => {
  const { user, refreshProfile } = useAuth();
  const [report, setReport] = useState<RecommendationReport | null>(initialReport || null);
  const [loading, setLoading] = useState<boolean>(!initialReport);
  const [updatingCourseId, setUpdatingCourseId] = useState<string | null>(null);

  useEffect(() => {
    if (!initialReport && user) {
      loadPath();
    }
  }, [user, initialReport]);

  const loadPath = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.getLatestRecommendation(user.uid);
      if (res.recommendation) {
        setReport(res.recommendation);
      }
    } catch (err) {
      console.error('Failed to load recommendation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteCourse = async (courseId: string) => {
    if (!user) return;
    setUpdatingCourseId(courseId);
    try {
      const res = await api.completeCourse(user.uid, courseId);
      setReport(res.recommendation);
      await refreshProfile();

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Failed to complete course:', err);
    } finally {
      setUpdatingCourseId(null);
    }
  };

  const getTierBadge = (level: string) => {
    switch (level) {
      case 'foundational':
        return { label: 'Step 1: Foundational Prerequisite', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'intermediate':
        return { label: 'Step 2: Core Competency', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      default:
        return { label: 'Step 3: Advanced Specialization', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!report || report.path.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">No Learning Path Generated Yet</h3>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          Complete your baseline assessment first so our algorithm can assemble your sequenced curriculum.
        </p>
        <button
          onClick={onNavigateToQuiz}
          className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold text-xs shadow-md"
        >
          Take Baseline Assessment
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      {/* Path Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Module 4: Curated Learning Path
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
          Your Sequenced Curriculum
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Strictly sequenced: foundational essentials are unlocked before complex specializations.
        </p>
      </div>

      {/* Progress Card */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-soft mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Path Completion</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {report.completedCourses} of {report.totalCourses} Courses Completed
            </div>
          </div>
          <span className="text-2xl font-extrabold text-blue-600 sm:text-right">
            {report.completionPercentage}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${report.completionPercentage}%` }}
          ></div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Completing a course dynamically recalibrates next modules</span>
          </span>
          <button
            onClick={onNavigateToQuiz}
            className="text-blue-600 font-semibold hover:underline flex items-center space-x-1"
          >
            <span>Test Skills with AI Quiz</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Timeline Courses */}
      <div className="space-y-5 relative">
        {report.path.map((item, index) => {
          const tier = getTierBadge(item.level);
          const isCurrent = item.status === 'current';
          const isCompleted = item.completed;
          const isLocked = item.status === 'locked';

          return (
            <div
              key={item.courseId}
              className={`p-6 sm:p-8 rounded-3xl border transition-all duration-200 relative ${
                isCompleted
                  ? 'bg-slate-50/80 border-slate-200 opacity-90'
                  : isCurrent
                  ? 'bg-white border-blue-500 shadow-soft ring-2 ring-blue-500/10'
                  : 'bg-white/60 border-slate-200 opacity-75'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start space-x-4">
                  {/* Status Indicator circle */}
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-700'
                      : isCurrent
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : isCurrent ? (
                      <Play className="w-4 h-4 fill-white" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${tier.bg}`}>
                        {tier.label}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {item.provider} • {item.duration}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h4>

                    {/* Skill Tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.skillTags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {isCompleted ? (
                    <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Completed</span>
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleCompleteCourse(item.courseId)}
                        disabled={updatingCourseId === item.courseId}
                        className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
                      >
                        {updatingCourseId === item.courseId ? 'Upgrading Skills...' : 'Mark Completed'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
