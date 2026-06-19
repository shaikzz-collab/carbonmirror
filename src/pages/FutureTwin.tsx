import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { simulateFuturePaths, calculateTimeCapsule } from '../utils/calculations';
import { Clock, ShieldAlert } from 'lucide-react';

export const FutureTwin: React.FC = () => {
  const { baselineBreakdown, interventions, setActiveTab } = useApp();
  const [timeframe, setTimeframe] = useState<'1m' | '6m' | '1y'>('1y');
  const [capsuleYears, setCapsuleYears] = useState<10 | 20 | 50>(20);

  if (!baselineBreakdown || interventions.length === 0) {
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

  // Generate paths
  const paths = simulateFuturePaths(baselineBreakdown, interventions);

  // Time capsule projections
  const currentCapsule = calculateTimeCapsule(baselineBreakdown, capsuleYears);

  // Calculate sustainable breakdown (Path C)
  // Let's say Path C reduces carbon footprint by 65% and waste by 70%.
  const sustainableBreakdown = {
    ...baselineBreakdown,
    total: Math.round(baselineBreakdown.total * 0.35),
    waste: Math.round(baselineBreakdown.waste * 0.30)
  };
  const sustainableCapsule = calculateTimeCapsule(sustainableBreakdown, capsuleYears);

  // Helper to extract values based on active timeframe
  const getPathMetrics = (path: typeof paths[0]) => {
    switch (timeframe) {
      case '1m':
        return path.projections.oneMonth;
      case '6m':
        return path.projections.sixMonths;
      case '1y':
      default:
        return path.projections.oneYear;
    }
  };

  const currentMetrics = getPathMetrics(paths[0]); // Path A
  const sustainableMetrics = getPathMetrics(paths[2]); // Path C

  // Regret calculations
  const carbonRegret = currentMetrics.carbon - sustainableMetrics.carbon;
  const moneyRegret = sustainableMetrics.moneySaved; // money spent extra if we take no action
  const wasteRegret = currentMetrics.waste - sustainableMetrics.waste;

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100 font-sans pb-16">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Future Twin Engine</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Compare possible futures: Current habits vs Sustainability pathways.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl p-1 text-xs font-semibold">
          {[
            { key: '1m', label: '1 Month' },
            { key: '6m', label: '6 Months' },
            { key: '1y', label: '1 Year' }
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => setTimeframe(opt.key as any)}
              className={`px-4 py-2 rounded-lg transition-all ${
                timeframe === opt.key
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </header>

      {/* THREE POSSIBLE FUTURES (LIFE PATHS ENGINE) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paths.map(path => {
          const metrics = getPathMetrics(path);
          let borderGradient = 'border-slate-200 dark:border-white/5';
          let titleColor = 'text-slate-800 dark:text-slate-100';

          if (path.pathway === 'A') {
            borderGradient = 'hover:border-red-500/30';
            titleColor = 'text-red-600 dark:text-red-400';
          } else if (path.pathway === 'B') {
            borderGradient = 'hover:border-teal-500/30';
            titleColor = 'text-teal-600 dark:text-teal-400';
          } else if (path.pathway === 'C') {
            borderGradient = 'hover:border-emerald-500/30 bg-gradient-to-tr from-emerald-500/5 to-transparent';
            titleColor = 'text-emerald-600 dark:text-emerald-400';
          }

          return (
            <div
              key={path.pathway}
              className={`p-6 rounded-3xl bg-white/70 dark:bg-slate-900/50 border glass-card flex flex-col justify-between space-y-6 ${borderGradient}`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className={`font-bold text-lg ${titleColor}`}>{path.name}</h3>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100/70 dark:bg-slate-950/60 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Path {path.pathway}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed min-h-[48px]">
                  {path.description}
                </p>
              </div>

              {/* Projections stats */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">CO₂ Emitted</span>
                  <span className="font-extrabold text-slate-700 dark:text-slate-200">{metrics.carbon} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Waste Output</span>
                  <span className="font-extrabold text-slate-700 dark:text-slate-200">{metrics.waste} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Extra Expense / Savings</span>
                  {path.pathway === 'A' ? (
                    <span className="font-extrabold text-red-600 dark:text-red-400">Baseline Cost</span>
                  ) : (
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">+${metrics.moneySaved} Saved</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* SIGNATURE MODULE: CARBON REGRET METER */}
      <section className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 glass-card space-y-6">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
          <h2 className="text-xl font-bold tracking-tight">Carbon Regret Meter (Compounding Cost of Inaction)</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Visualizing the difference between taking zero environmental action (Path A) and executing your full recommended action plan (Path C) over your selected timeframe (<strong>{timeframe === '1m' ? '1 Month' : timeframe === '6m' ? '6 Months' : '1 Year'}</strong>).
        </p>

        {/* Dynamic split meters */}
        <div className="space-y-6 pt-2">
          {/* Carbon Regret Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-300">Cumulative Carbon Emitted</span>
              <span className="text-red-600 dark:text-red-400 font-extrabold">Regret: +{carbonRegret} kg CO₂e</span>
            </div>
            <div className="h-6 w-full bg-slate-950 rounded-xl overflow-hidden flex relative items-center">
              <div
                className="h-full bg-emerald-500 transition-all duration-500 flex items-center justify-end px-3 text-[10px] font-black text-slate-950"
                style={{ width: `${(sustainableMetrics.carbon / (currentMetrics.carbon || 1)) * 100}%` }}
              >
                Path C: {sustainableMetrics.carbon}kg
              </div>
              <div
                className="h-full bg-red-500 transition-all duration-500 flex items-center justify-end px-3 text-[10px] font-black text-white"
                style={{ width: `${((currentMetrics.carbon - sustainableMetrics.carbon) / (currentMetrics.carbon || 1)) * 100}%` }}
              >
                Inaction Gap
              </div>
            </div>
          </div>

          {/* Money Regret Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-300">Compounding Expenditure</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">Regret: ${moneyRegret} Extra Spent</span>
            </div>
            <div className="h-6 w-full bg-slate-950 rounded-xl overflow-hidden flex relative items-center">
              {/* Sustainable shows savings, so let's represent standard expenditure vs savings */}
              <div
                className="h-full bg-red-400 transition-all duration-500 flex items-center justify-end px-3 text-[10px] font-black text-slate-950"
                style={{ width: '65%' }}
              >
                Baseline Cost
              </div>
              <div
                className="h-full bg-emerald-400 transition-all duration-500 flex items-center justify-end px-3 text-[10px] font-black text-slate-950"
                style={{ width: '35%' }}
              >
                Path C: ${moneyRegret} Saved
              </div>
            </div>
          </div>

          {/* Waste Regret Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-300">Compounding Municipal Waste</span>
              <span className="text-red-600 dark:text-red-400 font-extrabold">Regret: +{wasteRegret} kg Landfilled</span>
            </div>
            <div className="h-6 w-full bg-slate-950 rounded-xl overflow-hidden flex relative items-center">
              <div
                className="h-full bg-emerald-500 transition-all duration-500 flex items-center justify-end px-3 text-[10px] font-black text-slate-950"
                style={{ width: `${(sustainableMetrics.waste / (currentMetrics.waste || 1)) * 100}%` }}
              >
                Path C: {sustainableMetrics.waste}kg
              </div>
              <div
                className="h-full bg-red-500 transition-all duration-500 flex items-center justify-end px-3 text-[10px] font-black text-white"
                style={{ width: `${((currentMetrics.waste - sustainableMetrics.waste) / (currentMetrics.waste || 1)) * 100}%` }}
              >
                Inaction Gap
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SIGNATURE MODULE: CARBON TIME CAPSULE SIDE-BY-SIDE */}
      <section className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 glass-card space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Carbon Time Capsule (Long-Term Side-by-Side)</span>
            </h3>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Projecting ecological accumulation over decades.
            </p>
          </div>

          {/* Decade selector */}
          <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl p-1 text-xs font-semibold">
            {[10, 20, 50].map(y => (
              <button
                key={y}
                onClick={() => setCapsuleYears(y as any)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  capsuleYears === y
                    ? 'bg-indigo-500 text-white font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
                }`}
              >
                {y} Years
              </button>
            ))}
          </div>
        </div>

        {/* Side-by-Side comparison columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {/* Path A: Current You */}
          <div className="p-6 rounded-2xl bg-slate-100/50 dark:bg-slate-950/40 border border-red-500/10 space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="font-extrabold text-red-600 dark:text-red-400 text-sm">Path A: Current Habits</h4>
              <span className="text-[10px] bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-0.5 rounded font-bold">Inaction</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-slate-500 text-xs block">CO₂ Pools</span>
                <span className="text-2xl font-black text-slate-700 dark:text-slate-200">{currentCapsule.co2SwimmingPools} Pools</span>
                <span className="text-[9px] text-slate-500 block">Olympic pools of gas</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 text-xs block">Forest offset</span>
                <span className="text-2xl font-black text-slate-700 dark:text-slate-200">{currentCapsule.forestAcres} Acres</span>
                <span className="text-[9px] text-slate-500 block">Acres of forest to offset</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 text-xs block">Coal Equivalent</span>
                <span className="text-2xl font-black text-slate-700 dark:text-slate-200">{currentCapsule.coalTons} Tons</span>
                <span className="text-[9px] text-slate-500 block">Tons of coal burned</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 text-xs block">Waste trucks</span>
                <span className="text-2xl font-black text-slate-700 dark:text-slate-200">{currentCapsule.garbageTrucks.toFixed(1)} Trucks</span>
                <span className="text-[9px] text-slate-500 block">Garbage trucks of trash</span>
              </div>
            </div>
          </div>

          {/* Path C: Sustainable You */}
          <div className="p-6 rounded-2xl bg-slate-100/50 dark:bg-slate-950/40 border border-emerald-500/10 space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">Path C: Sustainable Habits</h4>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-bold">Optimized</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-slate-500 text-xs block">CO₂ Pools</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{sustainableCapsule.co2SwimmingPools} Pools</span>
                <span className="text-[9px] text-slate-500 block">Olympic pools of gas</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 text-xs block">Forest offset</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{sustainableCapsule.forestAcres} Acres</span>
                <span className="text-[9px] text-slate-500 block">Acres of forest to offset</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 text-xs block">Coal Equivalent</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{sustainableCapsule.coalTons} Tons</span>
                <span className="text-[9px] text-slate-500 block">Tons of coal burned</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 text-xs block">Waste trucks</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{sustainableCapsule.garbageTrucks.toFixed(1)} Trucks</span>
                <span className="text-[9px] text-slate-500 block">Garbage trucks of trash</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
