import React from 'react';
import { Check, Clock, Calendar, Code, Database, Globe, Play } from 'lucide-react';

export const FloatingMockupCards: React.FC = () => {
  return (
    <>
      {/* 1. TOP-LEFT CLUSTER (Yellow Sticky Note + Small Checkmark Card) */}
      <div className="hidden lg:block absolute -top-10 -left-12 z-20 pointer-events-none select-none">
        {/* Yellow Sticky Note Card */}
        <div className="w-56 p-4 rounded-xl bg-[#fef08a] text-amber-950 shadow-float transform -rotate-6 hover:rotate-0 transition-transform duration-300 border border-amber-300/60">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-300/40">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Weekly Goal</span>
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          </div>
          <p className="font-handwriting text-xl leading-tight text-amber-900">
            "Master React Hooks & bridge TypeScript gaps before Friday!"
          </p>
          <div className="mt-2 text-[10px] text-amber-700/80 font-medium text-right">
            ★ Priority #1
          </div>
        </div>

        {/* Small White Card with Blue Checkmark */}
        <div className="w-40 p-3 mt-3 ml-6 rounded-2xl bg-white shadow-float transform rotate-3 hover:rotate-0 transition-transform duration-300 border border-slate-100 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-900">SQL Basics</div>
            <div className="text-[10px] text-emerald-600 font-medium">100% Passed</div>
          </div>
        </div>
      </div>

      {/* 2. TOP-RIGHT CLUSTER (Timer Card + Schedule/Meeting Card) */}
      <div className="hidden lg:block absolute -top-8 -right-10 z-20 pointer-events-none select-none">
        {/* Small Clock/Timer Card */}
        <div className="w-44 p-3 rounded-2xl bg-white shadow-float transform rotate-6 hover:rotate-0 transition-transform duration-300 border border-slate-100 flex items-center space-x-3 ml-auto">
          <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-900">Daily Sprint</div>
            <div className="text-[10px] text-slate-500 font-medium">15 min streak</div>
          </div>
        </div>

        {/* Taller Reminders / Schedule Card */}
        <div className="w-56 p-4 mt-3 rounded-2xl bg-white shadow-float transform -rotate-3 hover:rotate-0 transition-transform duration-300 border border-slate-100">
          <div className="flex items-center space-x-2 text-slate-500 mb-3">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-700">Next Milestone</span>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100">
            <div className="text-xs font-bold text-blue-950">AI Quiz: State Mgmt</div>
            <div className="text-[11px] text-blue-700 font-medium mt-0.5">Today at 4:30 PM</div>
            <div className="mt-2 flex items-center text-[10px] text-blue-600 font-semibold space-x-1">
              <Play className="w-2.5 h-2.5 fill-blue-600" />
              <span>5 MCQs ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM-LEFT CLUSTER ("Today's Skills" with 2 rows, icons, progress bars, and dates) */}
      <div className="hidden lg:block absolute -bottom-12 -left-10 z-20 pointer-events-none select-none">
        <div className="w-64 p-4 rounded-2xl bg-white shadow-float transform rotate-2 hover:rotate-0 transition-transform duration-300 border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-900">Today's Skills</span>
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">In Progress</span>
          </div>

          <div className="space-y-3">
            {/* Row 1 */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center space-x-1.5 font-medium text-slate-800">
                  <div className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Code className="w-3 h-3" />
                  </div>
                  <span>React Hooks</span>
                </div>
                <span className="text-[10px] text-slate-400">Sep 22</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-indigo-600 h-1.5 rounded-full w-4/5"></div>
              </div>
            </div>

            {/* Row 2 */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center space-x-1.5 font-medium text-slate-800">
                  <div className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Database className="w-3 h-3" />
                  </div>
                  <span>SQL Joins</span>
                </div>
                <span className="text-[10px] text-slate-400">Sep 24</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full w-3/5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM-RIGHT CLUSTER ("100+ Courses" with 3 small app/course logo tiles in a row) */}
      <div className="hidden lg:block absolute -bottom-10 -right-8 z-20 pointer-events-none select-none">
        <div className="w-60 p-4 rounded-2xl bg-white shadow-float transform -rotate-3 hover:rotate-0 transition-transform duration-300 border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-900">100+ Courses</span>
            <span className="text-[10px] font-medium text-slate-400">Top Tier</span>
          </div>

          <div className="flex items-center justify-between space-x-2">
            {/* Tile 1 */}
            <div className="flex-1 p-2 rounded-xl bg-slate-50 border border-slate-100 text-center hover:bg-slate-100 transition-colors">
              <div className="w-7 h-7 mx-auto rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold mb-1 shadow-sm">
                TS
              </div>
              <span className="text-[10px] font-semibold text-slate-700 block truncate">TypeScript</span>
            </div>

            {/* Tile 2 */}
            <div className="flex-1 p-2 rounded-xl bg-slate-50 border border-slate-100 text-center hover:bg-slate-100 transition-colors">
              <div className="w-7 h-7 mx-auto rounded-lg bg-cyan-500 text-white flex items-center justify-center text-xs font-bold mb-1 shadow-sm">
                ⚛️
              </div>
              <span className="text-[10px] font-semibold text-slate-700 block truncate">React 18</span>
            </div>

            {/* Tile 3 */}
            <div className="flex-1 p-2 rounded-xl bg-slate-50 border border-slate-100 text-center hover:bg-slate-100 transition-colors">
              <div className="w-7 h-7 mx-auto rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs font-bold mb-1 shadow-sm">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="text-[10px] font-semibold text-slate-700 block truncate">Next.js</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
