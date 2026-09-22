import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Course } from '../types';
import { BookOpen, ExternalLink, Star, Filter, Search, Layers } from 'lucide-react';

export const CoursesCatalogueView: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await api.getCourses();
      setCourses(res.courses);
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = courses.filter(c => {
    const matchesLevel = selectedLevel === 'all' || c.level === selectedLevel;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skillTags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-fade-in space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Course Catalogue
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
          Explore Curated Learning Modules
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Every course is indexed against specific competencies to power automated gap recommendations.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by topic, skill tag, or provider..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center space-x-2">
          {['all', 'foundational', 'intermediate', 'advanced'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                selectedLevel === lvl
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(course => (
          <div
            key={course.id}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-soft hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-medium">{course.provider}</span>
                <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{course.rating}</span>
                </div>
              </div>

              <h4 className="text-base font-bold text-slate-900 leading-snug mb-2">
                {course.title}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                {course.description}
              </p>
            </div>

            <div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {course.skillTags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{course.duration}</span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  course.level === 'foundational'
                    ? 'bg-emerald-50 text-emerald-700'
                    : course.level === 'intermediate'
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-purple-50 text-purple-700'
                }`}>
                  {course.level}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
