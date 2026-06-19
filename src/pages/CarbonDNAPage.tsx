import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Award, Compass, RefreshCw } from 'lucide-react';

export const CarbonDNAPage: React.FC = () => {
  const { carbonDNA, baselineBreakdown, setActiveTab } = useApp();

  if (!carbonDNA || !baselineBreakdown) {
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

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100 font-sans pb-16">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Your Carbon DNA Analysis</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Deep dive into your behavioral classification profile.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('onboarding')}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-xs font-bold text-white rounded-xl border border-slate-200 dark:border-white/5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retake Lifestyle Scan</span>
        </button>
      </header>

      {/* Main Profile Info */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Avatar & Summary (4 cols) */}
        <div className="md:col-span-4 p-[1.5px] rounded-3xl bg-gradient-to-b from-white/10 to-transparent glass-card bg-white/70 dark:bg-slate-900/50">
          <div className="p-6 text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-950 border-2 border-emerald-500/30 flex items-center justify-center text-5xl mx-auto shadow-xl">
              {carbonDNA.avatarSymbol}
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">{carbonDNA.title}</h2>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-1 font-bold">DNA Classification</p>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {carbonDNA.description}
            </p>
            <div className="pt-4 border-t border-slate-200 dark:border-white/5 text-xs text-slate-500">
              DNA represents your persistent behaviors over a 12-month trailing horizon.
            </div>
          </div>
        </div>

        {/* Right Column: Contributions & Strengths & Risks (8 cols) */}
        <div className="md:col-span-8 space-y-6">
          {/* Carbon Category Contributions */}
          <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 glass-card space-y-6">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Category DNA Contributions</span>
            </h3>

            <div className="space-y-4">
              {[
                { label: 'Transport & Commutes', pct: carbonDNA.contributions.transport, val: baselineBreakdown.transport, color: 'from-blue-500 to-indigo-500' },
                { label: 'Dietary Nutrition', pct: carbonDNA.contributions.food, val: baselineBreakdown.food, color: 'from-emerald-400 to-teal-500' },
                { label: 'Home Utilities & AC', pct: carbonDNA.contributions.energy, val: baselineBreakdown.energy, color: 'from-yellow-400 to-orange-400' },
                { label: 'Goods & Direct Shopping', pct: carbonDNA.contributions.shopping, val: baselineBreakdown.shopping, color: 'from-indigo-400 to-purple-500' },
                { label: 'Courier & Takeout Delivery', pct: carbonDNA.contributions.delivery, val: baselineBreakdown.delivery, color: 'from-pink-400 to-rose-500' },
                { label: 'Digital Activity & Server Networks', pct: carbonDNA.contributions.digital, val: baselineBreakdown.digital, color: 'from-purple-400 to-fuchsia-500' }
              ].map(item => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {item.val} kg CO₂e / mo ({item.pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Risks Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Strengths (Green) */}
            <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 glass-card space-y-4">
              <h3 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>Personalized Strengths</span>
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                {carbonDNA.strengths.map((st, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risks (Orange) */}
            <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 glass-card space-y-4">
              <h3 className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Personalized Climate Risks</span>
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                {carbonDNA.risks.map((ri, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 font-bold">!</span>
                    <span>{ri}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
