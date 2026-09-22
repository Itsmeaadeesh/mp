import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { AdminDashboardData, Course } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ShieldCheck, Users, BookOpen, Plus, Trash2, Edit3, Award, TrendingUp, AlertTriangle } from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newProvider, setNewProvider] = useState('Skill Setu Academy');
  const [newLevel, setNewLevel] = useState<'foundational' | 'intermediate' | 'advanced'>('foundational');
  const [newDuration, setNewDuration] = useState('6 hours');
  const [newSkillTags, setNewSkillTags] = useState('react-fundamentals, javascript-core');
  const [savingCourse, setSavingCourse] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [adminData, courseList] = await Promise.all([
        api.getAdminDashboard(),
        api.getCourses()
      ]);
      setData(adminData);
      setCourses(courseList.courses);
    } catch (err) {
      console.error('Error loading admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCourse(true);
    try {
      const tags = newSkillTags.split(',').map(s => s.trim()).filter(Boolean);
      await api.createCourse({
        title: newTitle,
        provider: newProvider,
        description: 'Comprehensive curriculum module added via Administrator Portal.',
        url: 'https://skillsetu.io',
        duration: newDuration,
        rating: 4.9,
        level: newLevel,
        skillTags: tags
      });
      setShowAddModal(false);
      setNewTitle('');
      await loadAdminData();
    } catch (err) {
      console.error('Failed to create course:', err);
    } finally {
      setSavingCourse(false);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this course from the catalogue?')) return;
    try {
      await api.deleteCourse(id);
      await loadAdminData();
    } catch (err) {
      console.error('Failed to delete course:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) return null;

  const COLORS = ['#2563eb', '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in space-y-8">
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator Control Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Batch Analytics & Curriculum Operations
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Aggregate telemetry on collective cohort deficits, course completion rates, and learning curves.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Aggregate Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Learners</span>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{data.stats.totalLearners}</div>
          <span className="text-xs text-slate-500 mt-1 block">Active on platform</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Course Completion Rate</span>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2">{data.stats.courseCompletionRate}%</div>
          <span className="text-xs text-slate-500 mt-1 block">Across assigned paths</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Quiz Pass Rate</span>
          <div className="text-3xl font-extrabold text-blue-600 mt-2">{data.stats.averageQuizPassingRate}%</div>
          <span className="text-xs text-slate-500 mt-1 block">Score ≥ 60%</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Courses in Catalogue</span>
          <div className="text-3xl font-extrabold text-indigo-600 mt-2">{data.stats.totalCourses}</div>
          <span className="text-xs text-slate-500 mt-1 block">Available for auto-mapping</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weak Skills Chart */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-soft">
          <div className="flex items-center space-x-2 text-rose-600 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="text-base font-bold text-slate-900">Most Common Weak Skills in Cohort</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">Frequency of identified skill deficits across all learners</p>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.mostCommonWeakSkills}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#f43f5e" radius={[6, 6, 0, 0]} name="Learners with Deficit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Track Readiness Chart */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-soft">
          <div className="flex items-center space-x-2 text-blue-600 mb-2">
            <TrendingUp className="w-4 h-4" />
            <h3 className="text-base font-bold text-slate-900">Average Readiness by Track</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">Mean benchmark match score (%) per track</p>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.trackDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="trackName" tick={{ fill: '#64748b', fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="averageMatchScore" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Avg Readiness %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Course Catalogue Table (CRUD) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Course Catalogue Repository</h3>
            <p className="text-xs text-slate-500">Live catalogue queried by recommendation engine</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">{courses.length} courses loaded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-y border-slate-100">
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Tier / Level</th>
                <th className="py-3 px-4">Skill Tags</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{course.title}</td>
                  <td className="py-3.5 px-4 text-slate-600">{course.provider}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      course.level === 'foundational'
                        ? 'bg-emerald-50 text-emerald-700'
                        : course.level === 'intermediate'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-purple-50 text-purple-700'
                    }`}>
                      {course.level}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {course.skillTags.slice(0, 3).map(t => (
                        <span key={t} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-600">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for adding course */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Add Course to Catalogue</h3>

            <form onSubmit={handleAddCourse} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Advanced TypeScript Generics"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Provider</label>
                  <input
                    type="text"
                    required
                    value={newProvider}
                    onChange={e => setNewProvider(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Level Tier</label>
                  <select
                    value={newLevel}
                    onChange={e => setNewLevel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="foundational">Foundational</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration</label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={e => setNewDuration(e.target.value)}
                    placeholder="e.g. 8 hours"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Skill Tags (Comma separated)</label>
                  <input
                    type="text"
                    required
                    value={newSkillTags}
                    onChange={e => setNewSkillTags(e.target.value)}
                    placeholder="react-fundamentals, typescript"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCourse}
                  className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:opacity-50"
                >
                  {savingCourse ? 'Saving...' : 'Save to Catalogue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
