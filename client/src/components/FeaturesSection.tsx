import React from 'react';
import { Target, BarChart2, BookOpen, Sparkles, RefreshCw, ShieldCheck, ArrowRight } from 'lucide-react';

interface FeaturesSectionProps {
  onStartAssessment: () => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onStartAssessment }) => {
  const features = [
    {
      icon: Target,
      color: 'bg-blue-50 text-blue-600',
      title: 'Baseline Diagnostic Assessment',
      description: 'Choose between an interactive quiz or fine-grained self-rating to establish your precise baseline proficiency per track skill.'
    },
    {
      icon: BarChart2,
      color: 'bg-indigo-50 text-indigo-600',
      title: 'AI Skill-Gap Analysis',
      description: 'Intelligent algorithms compare your capabilities against required benchmarks, prioritizing critical bottlenecks first.'
    },
    {
      icon: BookOpen,
      color: 'bg-emerald-50 text-emerald-600',
      title: 'Sequenced Learning Paths',
      description: 'Curated courses sequenced strictly foundational before advanced, ensuring prerequisite knowledge is cemented before complexity.'
    },
    {
      icon: Sparkles,
      color: 'bg-amber-50 text-amber-600',
      title: 'Gemini Document Quiz Generator',
      description: 'Upload PDF, PPT, or lecture notes. Gemini extracts concepts and automatically creates multiple-choice quizzes with explanations.'
    },
    {
      icon: RefreshCw,
      color: 'bg-purple-50 text-purple-600',
      title: 'Continuous Recalibration Loop',
      description: 'Completing a quiz or course upgrades your skill profile in Firestore, automatically unlocking the next tier in your learning journey.'
    },
    {
      icon: ShieldCheck,
      color: 'bg-rose-50 text-rose-600',
      title: 'Role-Based Dashboards',
      description: 'Personalized Recharts radar visualization for learners, alongside cohort-level gap aggregations and completion metrics for admins.'
    }
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-20">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          How Skill Setu Works
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-4">
          From Baseline to Job-Ready Mastery
        </h2>
        <p className="text-slate-500 mt-3 text-base">
          A closed-loop learning engine that bridges what you know with where you need to be.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feat, i) => {
          const IconComponent = feat.icon;
          return (
            <div
              key={i}
              className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-soft hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl ${feat.color} flex items-center justify-center mb-6`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Bottom Banner */}
      <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex flex-col sm:flex-row items-center justify-between shadow-xl">
        <div className="mb-6 sm:mb-0 text-center sm:text-left">
          <h3 className="text-2xl font-bold">Ready to discover your career readiness score?</h3>
          <p className="text-blue-100 text-sm mt-1">Takes only 3 minutes to diagnose baseline strengths & gaps.</p>
        </div>
        <button
          onClick={onStartAssessment}
          className="px-6 py-3.5 rounded-full bg-white text-blue-600 font-bold text-sm shadow-md hover:bg-blue-50 transition-colors shrink-0 flex items-center space-x-2"
        >
          <span>Start Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
