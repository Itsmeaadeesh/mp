import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, ShieldCheck, Sparkles, BookOpen, Compass } from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
  onNavigate: (view: string) => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onNavigate, currentView }) => {
  const { user, logout, switchRole } = useAuth();

  return (
    <nav className="w-full flex items-center justify-between py-4 px-6 md:px-10 border-b border-slate-100/80 bg-white/70 backdrop-blur-md rounded-t-3xl relative z-30">
      {/* Left: Two-tone Dot Logo + Wordmark */}
      <div
        onClick={() => onNavigate('landing')}
        className="flex items-center space-x-3 cursor-pointer group select-none"
      >
        <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span className="w-2 h-2 rounded-full bg-blue-300"></span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
            Skill Setu
          </span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-blue-600 mt-0.5">
            AI Skill Bridge
          </span>
        </div>
      </div>

      {/* Center: Nav links */}
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
        <button
          onClick={() => onNavigate('features')}
          className={`transition-colors hover:text-blue-600 ${currentView === 'features' ? 'text-blue-600 font-semibold' : ''}`}
        >
          Features
        </button>
        <button
          onClick={() => onNavigate('assessment')}
          className={`transition-colors hover:text-blue-600 ${currentView === 'assessment' ? 'text-blue-600 font-semibold' : ''}`}
        >
          Assessments
        </button>
        <button
          onClick={() => onNavigate('courses')}
          className={`transition-colors hover:text-blue-600 ${currentView === 'courses' ? 'text-blue-600 font-semibold' : ''}`}
        >
          Courses
        </button>
        <button
          onClick={() => onNavigate('quiz-gen')}
          className={`transition-colors hover:text-blue-600 flex items-center space-x-1 ${currentView === 'quiz-gen' ? 'text-blue-600 font-semibold' : ''}`}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>AI Quiz</span>
        </button>
      </div>

      {/* Right side: User actions / Sign in & Get Demo */}
      <div className="flex items-center space-x-3">
        {user ? (
          <div className="flex items-center space-x-3">
            {/* Role switch toggle */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-full text-xs">
              <button
                onClick={() => switchRole('learner')}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  user.role === 'learner'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Learner
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`px-3 py-1 rounded-full font-medium transition-all flex items-center space-x-1 ${
                  user.role === 'admin'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Admin</span>
              </button>
            </div>

            {/* Dashboard Quick link */}
            <button
              onClick={() => onNavigate(user.role === 'admin' ? 'admin-dashboard' : 'dashboard')}
              className="hidden lg:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            {/* User Avatar & Logout */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center shadow-sm">
                {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
              </div>
              <button
                onClick={logout}
                title="Log out"
                className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <button
              onClick={onOpenAuth}
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={onOpenAuth}
              className="text-xs font-semibold px-4 py-2 rounded-full border border-slate-300 text-slate-800 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
            >
              Get Demo
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
