import React from 'react';
import { useApp } from '../context/AppContext';
import { TrendingDown, Calendar, BarChart2 } from 'lucide-react';

export const TrendsPage: React.FC = () => {
  const { baselineBreakdown, setActiveTab } = useApp();

  if (!baselineBreakdown) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-slate-500 dark:text-slate-400 space-y-4">
        <p>No lifestyle profile found. Please run the onboarding scan first.</p>
        <button
          onClick={() => setActiveTab('onboarding')}
          className="px-6 py-2.5 bg-emerald-500 rounded-xl text-slate-950 font-bold"
        >
          Start Lifestyle Scan
        </button>
      </div>
    );
  }

  // Week-over-week mock data
  const weeklyHistory = [
    { week: 'Wk 21', carbon: baselineBreakdown.total + 30, adherence: 65 },
    { week: 'Wk 22', carbon: baselineBreakdown.total + 18, adherence: 70 },
    { week: 'Wk 23', carbon: baselineBreakdown.total + 10, adherence: 78 },
    { week: 'Wk 24', carbon: baselineBreakdown.total + 5, adherence: 80 },
    { week: 'Wk 25', carbon: baselineBreakdown.total - 12, adherence: 85 },
    { week: 'Today', carbon: baselineBreakdown.total - 25, adherence: 92 }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100 font-sans pb-16">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Trends & History</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Monitor your weekly footprint history and habit compliance scores.
        </p>
      </header>

      {/* Stats row */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 glass-card space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">Monthly Improvement</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <TrendingDown className="w-6 h-6" />
            <span>-12.4%</span>
          </div>
          <p className="text-[10px] text-slate-500">Relative to your baseline onboarding scan.</p>
        </div>

        <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 glass-card space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">Habit Adherence Rate</span>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
            92% <span className="text-sm font-normal text-slate-500 dark:text-slate-400">Score</span>
          </div>
          <p className="text-[10px] text-slate-500">Based on completed weekly checklist items.</p>
        </div>

        <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 glass-card space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">Compounding Offset</span>
          <div className="text-3xl font-black text-teal-600 dark:text-teal-400">
            -340 kg <span className="text-sm font-normal text-slate-500 dark:text-slate-400">Saved</span>
          </div>
          <p className="text-[10px] text-slate-500">Total emissions avoided since start of log.</p>
        </div>
      </section>

      {/* Historical Bars Chart (SVG) */}
      <section className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 glass-card space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Weekly Footprint Trajectory (kg CO₂e)</span>
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Past 6 Weeks</span>
          </div>
        </div>

        {/* Dynamic bar charts */}
        <div className="space-y-4 pt-2">
          {weeklyHistory.map(item => {
            const maxVal = Math.max(...weeklyHistory.map(w => w.carbon));
            const pct = Math.round((item.carbon / maxVal) * 100);
            const isToday = item.week === 'Today';

            return (
              <div key={item.week} className="flex items-center gap-4">
                <span className="w-12 text-xs font-bold text-slate-500 dark:text-slate-400 flex-shrink-0 text-left">{item.week}</span>
                <div className="flex-grow h-6 bg-slate-950 rounded-lg overflow-hidden flex relative items-center">
                  <div
                    className={`h-full rounded-r-md transition-all duration-500 flex items-center px-3 text-[10px] font-black ${
                      isToday
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950'
                        : 'bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                    style={{ width: `${pct}%` }}
                  >
                    {item.carbon} kg
                  </div>
                </div>
                <span className="w-12 text-xs font-bold text-slate-500 dark:text-slate-400 flex-shrink-0 text-right">
                  {item.adherence}% compliance
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footprint Comparison */}
      <section className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 glass-card space-y-4">
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Week-over-Week Adherence comparison</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
          In Week 25, you logged 5 vehicle trips replaced by public transit and maintained a vegan diet on Wednesday. That reduced your transportation category by 18% compared to Week 24. Keep up the high compliance to unlock the Level 3 Eco explorer status!
        </p>
      </section>
    </div>
  );
};
