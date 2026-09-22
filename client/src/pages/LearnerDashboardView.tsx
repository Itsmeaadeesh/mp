import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LearnerDashboardData } from '../types';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { Compass, BookOpen, Award, CheckCircle2, Play, Sparkles, TrendingUp, HelpCircle } from 'lucide-react';

interface LearnerDashboardViewProps {
  onNavigateToQuiz: () => void;
  onNavigateToPath: () => void;
  onNavigateToAssessment: () => void;
}

export const LearnerDashboardView: React.FC<LearnerDashboardViewProps> = ({
  onNavigateToQuiz,
  onNavigateToPath,
  onNavigateToAssessment
}) => {
  const { user } = useAuth();
  const [data, setData] = useState<LearnerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [user]);

  const loadDashboard = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.getLearnerDashboard(user.uid);
      setData(res);
    } catch (err) {
      console.error('Failed to load learner dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <p className="text-slate-500">Failed to load dashboard data. Please try again.</p>
      </div>
    );
  }

  const { track, gapReport, recommendation, quizAttempts, chartData } = data;
  const currentCourse = recommendation?.path.find(p => p.status === 'current');

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in space-y-8">
      {/* Top Greeting & Track Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-3xl bg-white border border-slate-200 shadow-soft">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Learner Workspace
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Welcome back, {user?.displayName || 'Learner'}!
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Target Track: <span className="font-semibold text-slate-800">{track?.trackName || 'Frontend Developer'}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onNavigateToAssessment}
            className="px-4 py-2.5 rounded-full border border-slate-200 hover:border-slate-400 text-slate-700 text-xs font-semibold transition-colors flex items-center space-x-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Retake Assessment</span>
          </button>
          <button
            onClick={onNavigateToQuiz}
            className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Quiz Generator</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Role Alignment</span>
          <div className="text-3xl font-extrabold text-blue-600 mt-2">
            {gapReport?.overallMatchScore || 0}%
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Benchmark readiness</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Skill Gaps</span>
          <div className="text-3xl font-extrabold text-amber-600 mt-2">
            {gapReport?.gaps.filter(g => g.currentLevel < g.requiredLevel).length || 0}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Identified bottlenecks</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Curriculum Progress</span>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2">
            {recommendation?.completionPercentage || 0}%
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {recommendation?.completedCourses || 0} of {recommendation?.totalCourses || 0} courses done
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quizzes Attempted</span>
          <div className="text-3xl font-extrabold text-indigo-600 mt-2">
            {quizAttempts?.length || 0}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Evaluations completed</span>
        </div>
      </div>

      {/* Visual Analytics Row (Recharts Radar & Bar) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radar Chart: Proficiency Matrix */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Skill Competency Radar</h3>
              <p className="text-xs text-slate-500">Current Proficiency vs Role Target (Scale 1-5)</p>
            </div>
            <div className="flex items-center space-x-3 text-[11px] font-semibold">
              <span className="flex items-center space-x-1 text-blue-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span>Current</span>
              </span>
              <span className="flex items-center space-x-1 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                <span>Target</span>
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData.radar}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#64748b', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} stroke="#cbd5e1" />
                <Radar name="Target" dataKey="target" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.2} />
                <Radar name="Current" dataKey="current" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Gap Deficit Magnitude */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Priority Gap Magnitudes</h3>
              <p className="text-xs text-slate-500">Deficit levels needed to meet baseline</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.gaps}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis domain={[0, 5]} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="deficit" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Level Deficit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Next Recommended Course Banner */}
      {currentCourse && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-blue-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-900/60 px-2.5 py-0.5 rounded-full">
              Up Next in Your Path
            </span>
            <h4 className="text-xl font-bold">{currentCourse.title}</h4>
            <p className="text-xs text-slate-300">
              Provider: {currentCourse.provider} • Duration: {currentCourse.duration} • Level: {currentCourse.level}
            </p>
          </div>
          <button
            onClick={onNavigateToPath}
            className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all shrink-0 flex items-center space-x-1.5"
          >
            <span>Resume Learning Path</span>
            <Play className="w-3.5 h-3.5 fill-white" />
          </button>
        </div>
      )}

      {/* Quiz Attempt History */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-soft">
        <h3 className="text-base font-bold text-slate-900 mb-4">Diagnostic & AI Quiz History</h3>

        {quizAttempts && quizAttempts.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {quizAttempts.map((attempt) => (
              <div key={attempt.id} className="py-3.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{attempt.quizTitle}</span>
                  <span className="text-slate-400 text-[10px]">
                    {new Date(attempt.attemptedAt).toLocaleDateString()} at {new Date(attempt.attemptedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-slate-600">
                    {attempt.score}/{attempt.totalQuestions} ({attempt.percentage}%)
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    attempt.percentage >= 60 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {attempt.percentage >= 60 ? 'Passed' : 'Needs Review'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-4">No quiz attempts recorded yet. Generate your first AI quiz above!</p>
        )}
      </div>
    </div>
  );
};
