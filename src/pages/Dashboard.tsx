import React from 'react';
import { useApp } from '../context/AppContext';
import { calculateTimeCapsule } from '../utils/calculations';
import {
  Zap,
  TrendingDown,
  AlertTriangle,
  Clock,
  ArrowRight,
  Calendar,
  Layers,
  Heart
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    baselineBreakdown,
    carbonDNA,
    hotspot,
    top3Changes,
    toggleAction,
    completedActions,
    setActiveTab
  } = useApp();

  if (!baselineBreakdown || !carbonDNA || !hotspot || !top3Changes) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-slate-500 dark:text-slate-400 space-y-4">
        <p>No lifestyle footprint profile found. Please run the onboarding scan first.</p>
        <button
          onClick={() => setActiveTab('onboarding')}
          className="px-6 py-2.5 bg-emerald-500 rounded-xl text-slate-950 font-bold"
        >
          Start Lifestyle Scan
        </button>
      </div>
    );
  }

  // Calculate Shadow Score
  const maxFootprintValue = 1100;
  const shadowScore = Math.max(15, Math.min(98, Math.round(100 - (baselineBreakdown.total / maxFootprintValue) * 85)));

  // Calculate 10-year capsule metrics
  const capsule10Yr = calculateTimeCapsule(baselineBreakdown, 10);

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100 font-sans pb-16">
      {/* Welcome & Top Summary */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Climate Intelligence Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Digital twin profile: <strong className="text-emerald-600 dark:text-emerald-400">{carbonDNA.title}</strong>
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-500 dark:text-slate-400">
          <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>June 2026 Assessment</span>
        </div>
      </header>

      {/* PRIMARY HERO BANNER: TOP 3 LIFESTYLE CHANGES */}
      <section className="p-[1.5px] rounded-3xl bg-gradient-to-r from-emerald-500/30 via-teal-500/20 to-indigo-500/30 shadow-xl overflow-hidden">
        <div className="bg-white/90 dark:bg-slate-900/90 rounded-[22px] p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-xl font-bold tracking-tight">Top 3 Primary Action Interventions</h2>
            </div>
            <button
              onClick={() => setActiveTab('actions')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group"
            >
              <span>View Full Plan</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Highest Carbon Reduction */}
            <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 space-y-3 relative group">
              <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md inline-block">
                Max Carbon Cut
              </div>
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200 line-clamp-1">{top3Changes.highestReduction.name}</h3>
              <div className="flex justify-between text-xs pt-1 border-t border-slate-200 dark:border-white/5">
                <span className="text-slate-500">Savings</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">-{top3Changes.highestReduction.carbonReduction} kg/yr</span>
              </div>
              <button
                onClick={() => toggleAction(top3Changes.highestReduction.id)}
                className={`w-full py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  completedActions.includes(top3Changes.highestReduction.id)
                    ? 'bg-emerald-500 text-slate-950 border-emerald-500 font-bold'
                    : 'border-slate-200 dark:border-white/5 hover:border-emerald-500/30 text-slate-600 dark:text-slate-300'
                }`}
              >
                {completedActions.includes(top3Changes.highestReduction.id) ? '✓ Active Action' : '+ Enroll Action'}
              </button>
            </div>

            {/* 2. Highest Money Saving */}
            <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 space-y-3 relative group">
              <div className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-md inline-block">
                Max Savings
              </div>
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200 line-clamp-1">{top3Changes.highestMoneySaving.name}</h3>
              <div className="flex justify-between text-xs pt-1 border-t border-slate-200 dark:border-white/5">
                <span className="text-slate-500">Savings</span>
                <span className="font-semibold text-teal-600 dark:text-teal-400">${top3Changes.highestMoneySaving.moneySavings}/yr</span>
              </div>
              <button
                onClick={() => toggleAction(top3Changes.highestMoneySaving.id)}
                className={`w-full py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  completedActions.includes(top3Changes.highestMoneySaving.id)
                    ? 'bg-emerald-500 text-slate-950 border-emerald-500 font-bold'
                    : 'border-slate-200 dark:border-white/5 hover:border-emerald-500/30 text-slate-600 dark:text-slate-300'
                }`}
              >
                {completedActions.includes(top3Changes.highestMoneySaving.id) ? '✓ Active Action' : '+ Enroll Action'}
              </button>
            </div>

            {/* 3. Easiest Change */}
            <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 space-y-3 relative group">
              <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md inline-block">
                Easiest Habit Swap
              </div>
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200 line-clamp-1">{top3Changes.easiestChange.name}</h3>
              <div className="flex justify-between text-xs pt-1 border-t border-slate-200 dark:border-white/5">
                <span className="text-slate-500">Effort</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">Low (Level {top3Changes.easiestChange.difficulty})</span>
              </div>
              <button
                onClick={() => toggleAction(top3Changes.easiestChange.id)}
                className={`w-full py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  completedActions.includes(top3Changes.easiestChange.id)
                    ? 'bg-emerald-500 text-slate-950 border-emerald-500 font-bold'
                    : 'border-slate-200 dark:border-white/5 hover:border-emerald-500/30 text-slate-600 dark:text-slate-300'
                }`}
              >
                {completedActions.includes(top3Changes.easiestChange.id) ? '✓ Active Action' : '+ Enroll Action'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Row (Shadow Score & Hotspot & Narrative) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Shadow Score Gauge (4 cols) */}
        <div className="lg:col-span-4 p-[1px] rounded-3xl bg-gradient-to-b from-white/10 to-transparent glass-card bg-white/70 dark:bg-slate-900/50 flex flex-col justify-between">
          <div className="p-6 space-y-6 flex-grow flex flex-col justify-between items-center text-center">
            <div className="w-full text-left">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Carbon Shadow Score</span>
              </h3>
            </div>

            {/* Circular Gauge */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* SVG Background Ring */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  className="stroke-emerald-400 transition-all duration-1000"
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 68}
                  strokeDashoffset={2 * Math.PI * 68 * (1 - shadowScore / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-extrabold text-slate-800 dark:text-white leading-none tracking-tight">{shadowScore}</span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Index Score</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {shadowScore >= 80 ? 'Highly Resilient Profile' : shadowScore >= 50 ? 'Moderate Climate Risk' : 'High Ecological Footprint'}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-[200px]">
                Score represents sustainability capacity. Closer to 100 implies net-zero alignment.
              </p>
            </div>
          </div>
        </div>

        {/* Hotspot & Personal Impact Story (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Carbon Hotspot Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-red-500/10 to-slate-100 dark:to-slate-900 border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">
                <AlertTriangle className="w-4 h-4" />
                <span>Primary Hotspot Detected</span>
              </div>
              <h3 className="text-lg font-bold">
                {hotspot.percentage}% of emissions driven by {hotspot.category}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Fastest way to improve: <span className="text-emerald-600 dark:text-emerald-400 font-medium">{hotspot.action}</span>
              </p>
            </div>
            <button
              onClick={() => setActiveTab('receipt')}
              className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-xs font-bold text-white rounded-xl border border-slate-200 dark:border-white/5 flex-shrink-0"
            >
              Log Daily Actions
            </button>
          </div>

          {/* Personal Impact Story Card */}
          <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 glass-card flex-grow flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Your Environmental Story</span>
              </h3>
              <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                "You are classified as <strong className="text-emerald-600 dark:text-emerald-400">{carbonDNA.title}</strong> because {hotspot.category.toLowerCase()} comprises your largest environmental pressure. By enacting the top action, you will cut your footprint by <strong className="text-emerald-600 dark:text-emerald-400">{Math.round(top3Changes.highestReduction.carbonReduction / 12)} kg</strong> this month and save <strong className="text-teal-600 dark:text-teal-400">${Math.round(top3Changes.highestReduction.moneySavings / 12)}</strong> in expenditures."
              </p>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400 mt-4">
              <span>Classified via 12 lifestyle data nodes</span>
              <button
                onClick={() => setActiveTab('dna')}
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-0.5"
              >
                <span>Full Carbon DNA Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Charts (Breakdown & History) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category breakdown (SVG chart) */}
        <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 glass-card space-y-6">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Category Distribution (kg CO₂e/mo)</h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* SVG Pie Chart */}
            <div className="w-32 h-32 relative flex-shrink-0">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                {/* We will draw a simple stacked ring represent 5 categories */}
                {/* 1. Transport */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#60a5fa" strokeWidth="3.5" strokeDasharray={`${carbonDNA.contributions.transport} ${100 - carbonDNA.contributions.transport}`} strokeDashoffset="25" />
                {/* 2. Food */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#34d399" strokeWidth="3.5" strokeDasharray={`${carbonDNA.contributions.food} ${100 - carbonDNA.contributions.food}`} strokeDashoffset={`${25 - carbonDNA.contributions.transport}`} />
                {/* 3. Energy */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#fbbf24" strokeWidth="3.5" strokeDasharray={`${carbonDNA.contributions.energy} ${100 - carbonDNA.contributions.energy}`} strokeDashoffset={`${25 - carbonDNA.contributions.transport - carbonDNA.contributions.food}`} />
                {/* 4. Goods */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#818cf8" strokeWidth="3.5" strokeDasharray={`${carbonDNA.contributions.shopping + carbonDNA.contributions.delivery} ${100 - (carbonDNA.contributions.shopping + carbonDNA.contributions.delivery)}`} strokeDashoffset={`${25 - carbonDNA.contributions.transport - carbonDNA.contributions.food - carbonDNA.contributions.energy}`} />
                {/* 5. Digital */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#c084fc" strokeWidth="3.5" strokeDasharray={`${carbonDNA.contributions.digital} ${100 - carbonDNA.contributions.digital}`} strokeDashoffset={`${25 - carbonDNA.contributions.transport - carbonDNA.contributions.food - carbonDNA.contributions.energy - (carbonDNA.contributions.shopping + carbonDNA.contributions.delivery)}`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-slate-800 dark:text-white">{baselineBreakdown.total}</span>
                <span className="text-[8px] font-bold text-slate-500 dark:text-slate-400">Total kg</span>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs flex-grow w-full">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                <span className="text-slate-500 dark:text-slate-400">Transport:</span>
                <span className="text-slate-700 dark:text-slate-200 font-semibold">{baselineBreakdown.transport}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-slate-500 dark:text-slate-400">Dietary:</span>
                <span className="text-slate-700 dark:text-slate-200 font-semibold">{baselineBreakdown.food}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="text-slate-500 dark:text-slate-400">Utilities:</span>
                <span className="text-slate-700 dark:text-slate-200 font-semibold">{baselineBreakdown.energy}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                <span className="text-slate-500 dark:text-slate-400">Shopping:</span>
                <span className="text-slate-700 dark:text-slate-200 font-semibold">{baselineBreakdown.shopping + baselineBreakdown.delivery}</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                <span className="text-slate-500 dark:text-slate-400">Digital:</span>
                <span className="text-slate-700 dark:text-slate-200 font-semibold">{baselineBreakdown.digital}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Trend (SVG representation) */}
        <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 glass-card space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Weekly Trend (Shadow score)</h3>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>+4% improvement</span>
            </span>
          </div>

          {/* Sparkline chart */}
          <div className="h-32 w-full pt-4 relative">
            <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Fill area */}
              <path
                d="M0 25 L20 22 L40 20 L60 21 L80 16 L100 12 L100 30 L0 30 Z"
                fill="url(#trendGrad)"
              />
              {/* Line path */}
              <path
                d="M0 25 L20 22 L40 20 L60 21 L80 16 L100 12"
                fill="none"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Dots */}
              <circle cx="0" cy="25" r="1.5" fill="#14b8a6" />
              <circle cx="20" cy="22" r="1.5" fill="#14b8a6" />
              <circle cx="40" cy="20" r="1.5" fill="#14b8a6" />
              <circle cx="60" cy="21" r="1.5" fill="#14b8a6" />
              <circle cx="80" cy="16" r="1.5" fill="#14b8a6" />
              <circle cx="100" cy="12" r="1.5" fill="#10b981" />
            </svg>
            <div className="absolute inset-x-0 bottom-0 flex justify-between text-[10px] text-slate-500 font-semibold px-1">
              <span>Wk 21</span>
              <span>Wk 22</span>
              <span>Wk 23</span>
              <span>Wk 24</span>
              <span>Wk 25</span>
              <span>Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* SIGNATURE MODULE: CARBON TIME CAPSULE PREVIEW */}
      <section className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 glass-card space-y-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[30%] h-[100%] bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none" />
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Carbon Time Capsule (10-Year Outlook)</span>
            </h3>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Your compounding carbon debt if lifestyle habits continue.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('future')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-600 dark:text-indigo-300 hover:underline flex items-center gap-0.5"
          >
            <span>Simulate Futures</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Metaphors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl p-4 space-y-2">
            <div className="text-3xl">🏊‍♂️</div>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-300">{capsule10Yr.co2SwimmingPools}</div>
            <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300">Olympic CO₂ Pools</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Volume of gas generated at standard temperature.
            </p>
          </div>

          <div className="bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl p-4 space-y-2">
            <div className="text-3xl">🚛</div>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-300">{capsule10Yr.garbageTrucks.toFixed(1)}</div>
            <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300">Garbage Trucks of Waste</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Based on your domestic waste recycling behavior.
            </p>
          </div>

          <div className="bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl p-4 space-y-2">
            <div className="text-3xl">🌳</div>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-300">{capsule10Yr.forestAcres}</div>
            <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300">Acres of Forest Absorption</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Required for mature forest to offset your emissions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
