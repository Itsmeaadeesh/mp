import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 bg-white py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          </div>
          <span className="font-bold text-slate-900">Skill Setu</span>
          <span className="text-xs text-slate-400">© 2026 AI-Enabled Skill Assessment Platform</span>
        </div>

        <div className="flex items-center space-x-6 text-xs font-medium">
          <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#assessments" className="hover:text-blue-600 transition-colors">Assessments</a>
          <a href="#courses" className="hover:text-blue-600 transition-colors">Courses</a>
          <a href="#privacy" className="hover:text-blue-600 transition-colors">Privacy & Rules</a>
        </div>
      </div>
    </footer>
  );
};
