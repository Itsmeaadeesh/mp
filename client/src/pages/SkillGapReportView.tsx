import React from 'react';
import { SkillGapReport, SkillGapItem } from '../types';
import { AlertTriangle, Sparkles, CheckCircle2, ArrowRight, ShieldAlert, BookOpen } from 'lucide-react';

interface SkillGapReportViewProps {
  report: SkillGapReport;
  onProceedToPath: () => void;
}

export const SkillGapReportView: React.FC<SkillGapReportViewProps> = ({ report, onProceedToPath }) => {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          label: 'Critical Bottleneck',
          icon: ShieldAlert
        };
      case 'high':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          label: 'High Priority',
          icon: AlertTriangle
        };
      case 'medium':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          label: 'Medium Priority',
          icon: Sparkles
        };
      default:
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          label: 'On Target',
          icon: CheckCircle2
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Module 3: Skill-Gap Diagnostics
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
          Your Personalized Gap Analysis
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Ranked in strict order of priority. Resolving top bottlenecks accelerates subsequent learning.
        </p>
      </div>

      {/* Readiness Score Card */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-soft mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Specialization</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{report.trackName}</h3>
          </div>

          <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Overall Alignment</span>
              <span className="text-2xl font-extrabold text-blue-600">{report.overallMatchScore}%</span>
            </div>
            <div className="w-14 h-14 rounded-full border-4 border-blue-600 border-t-blue-100 flex items-center justify-center text-xs font-bold text-slate-700">
              {report.overallMatchScore}%
            </div>
          </div>
        </div>

        {/* Gemini AI Summary */}
        <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-100">
          <div className="flex items-center space-x-2 text-blue-800 font-bold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Gemini AI Learning Advisor Commentary</span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {report.aiSummary}
          </p>
        </div>
      </div>

      {/* Priority-Ranked Gaps List */}
      <div className="mb-10">
        <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
          <span>Identified Gaps (Ordered by Impact)</span>
          <span className="text-xs text-slate-400 font-normal">{report.gaps.length} competencies diagnosed</span>
        </h4>

        <div className="space-y-4">
          {report.gaps.map((gap, index) => {
            const badge = getPriorityBadge(gap.priority);
            const IconComponent = badge.icon;
            const isDeficit = gap.currentLevel < gap.requiredLevel;

            return (
              <div
                key={gap.skillId}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-soft transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                      #{index + 1}
                    </span>
                    <h5 className="text-base font-bold text-slate-900">{gap.skillName}</h5>
                  </div>

                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{badge.label}</span>
                  </span>
                </div>

                {/* Level Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-500 mb-1">
                      <span>Current Level: {gap.currentLevel}/5</span>
                      <span>Target: {gap.requiredLevel}/5</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(gap.currentLevel / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end text-right">
                    {isDeficit ? (
                      <span className="text-xs font-semibold text-rose-600">
                        Deficit: -{gap.requiredLevel - gap.currentLevel} levels required
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-600 flex items-center space-x-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Proficiency Benchmark Met</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Rationale */}
                <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  <span className="font-semibold text-slate-700">Rationale: </span>
                  {gap.rationale}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="flex justify-center">
        <button
          onClick={onProceedToPath}
          className="px-10 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-500/25 transition-all flex items-center space-x-2"
        >
          <span>View Sequenced Learning Path</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
