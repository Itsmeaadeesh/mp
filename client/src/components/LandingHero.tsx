import React from 'react';
import { Navbar } from './Navbar';
import { FloatingMockupCards } from './FloatingMockupCards';
import { ArrowRight, Sparkles, Target, Award, BarChart3 } from 'lucide-react';

interface LandingHeroProps {
  onOpenAuth: () => void;
  onStartAssessment: () => void;
  onNavigate: (view: string) => void;
  currentView: string;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onOpenAuth,
  onStartAssessment,
  onNavigate,
  currentView
}) => {
  return (
    <div className="w-full min-h-[92vh] flex items-center justify-center p-4 sm:p-6 md:p-10 lg:p-14 relative select-none">
      {/* Outer framing wrapper */}
      <div className="w-full max-w-6xl relative">
        {/* Decorative Floating Cards Layer (overflowing outer borders) */}
        <FloatingMockupCards />

        {/* Main White Rounded Card (Framed Browser Mockup Style) */}
        <div className="w-full bg-white rounded-3xl shadow-soft border border-slate-200/80 overflow-visible relative z-10">
          {/* Top Navbar nested INSIDE the white card */}
          <Navbar onOpenAuth={onOpenAuth} onNavigate={onNavigate} currentView={currentView} />

          {/* Hero Body with faint dot-grid texture */}
          <div className="relative px-6 py-20 sm:py-24 md:py-28 lg:py-32 flex flex-col items-center text-center bg-dot-grid overflow-hidden rounded-b-3xl">
            {/* Subtle radial glow inside */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none"></div>

            {/* Small square icon badge above headline (rounded white card with 4 colored dots) */}
            <div className="mb-6 p-2 rounded-2xl bg-white shadow-sm border border-slate-200/90 flex items-center justify-center space-x-1.5 hover:scale-105 transition-transform cursor-pointer">
              <div className="grid grid-cols-2 gap-1 p-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
            </div>

            {/* Large bold two-line headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-3xl leading-[1.08] mb-6">
              <span className="text-slate-950 block">Assess, learn, and grow</span>
              <span className="text-slate-400 font-bold block mt-1">all in one place</span>
            </h1>

            {/* Short gray subtext */}
            <p className="text-base sm:text-lg md:text-xl text-slate-500 max-w-xl mb-10 leading-relaxed font-normal">
              Identify your skill gaps and get a personalized learning path.
            </p>

            {/* Single solid blue pill/rounded button */}
            <div className="flex flex-col sm:flex-row items-center gap-4 relative z-20">
              <button
                onClick={onStartAssessment}
                className="px-8 py-4 rounded-full bg-blue-600 text-white font-semibold text-base sm:text-lg shadow-lg shadow-blue-500/25 hover:bg-blue-700 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center space-x-2 group"
              >
                <span>Get Free Assessment</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('dashboard')}
                className="sm:hidden px-6 py-3 rounded-full border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
              >
                Explore Demo Dashboard
              </button>
            </div>

            {/* Micro proof badges below CTA */}
            <div className="mt-14 pt-8 border-t border-slate-200/60 w-full max-w-md flex items-center justify-around text-xs text-slate-500 font-medium">
              <div className="flex items-center space-x-1.5">
                <Target className="w-4 h-4 text-blue-600" />
                <span>Diagnostic Precision</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Gemini AI Engine</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <div className="flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Role-Ready Paths</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
