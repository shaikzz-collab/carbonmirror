import React from 'react';
import { useApp } from '../context/AppContext';
import { Leaf, Zap, DollarSign, Smile, AlertCircle, ArrowRight } from 'lucide-react';

export const OnboardingResult: React.FC = () => {
  const {
    carbonDNA,
    hotspot,
    baselineBreakdown,
    top3Changes,
    toggleAction,
    completedActions,
    setActiveTab
  } = useApp();

  if (!carbonDNA || !hotspot || !baselineBreakdown || !top3Changes) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors duration-300">
        No onboarding data found. Please complete the Lifestyle Scan first.
      </div>
    );
  }

  const { highestReduction, highestMoneySaving, easiestChange } = top3Changes;

  return (
    <div className="min-h-screen relative bg-slate-50 dark:bg-slate-950 px-4 py-12 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[20%] left-[10%] h-[60%] w-[50%] rounded-full bg-emerald-500/5 blur-[130px] animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[10%] h-[60%] w-[50%] rounded-full bg-indigo-500/5 blur-[130px] animate-pulse-slow" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-12">
        {/* Title */}
        <header className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            Scan Complete
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Your Carbon Twin is Revealed
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            We have generated a digital double of your lifestyle habits. Below is your baseline profile and the top actions to shift your future trajectory.
          </p>
        </header>

        {/* CARBON TWIN REVEAL CARD */}
        <section className="p-[1.5px] rounded-3xl bg-gradient-to-br from-emerald-500/30 via-slate-800/40 to-indigo-500/30 shadow-2xl overflow-hidden">
          <div className="bg-white/90 dark:bg-slate-900/90 rounded-[22px] p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Visual Silhouette Double (Left) */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-100/50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-white/5 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-tr from-emerald-400 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative w-36 h-36 rounded-full bg-white dark:bg-slate-900 border-2 border-emerald-400/40 flex items-center justify-center text-7xl select-none animate-reveal-twin shadow-xl shadow-emerald-500/10">
                {carbonDNA.avatarSymbol}
              </div>
              <h2 className="text-xl font-bold mt-4 text-emerald-600 dark:text-emerald-400 text-center">
                {carbonDNA.title}
              </h2>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                Carbon DNA Type
              </div>
            </div>

            {/* DNA Details & Hotspot (Right) */}
            <div className="md:col-span-8 space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Baseline Footprint</div>
                <div className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-baseline gap-1.5">
                  {baselineBreakdown.total}
                  <span className="text-sm font-normal text-slate-500 dark:text-slate-400">kg CO₂e / month</span>
                </div>
              </div>

              <div className="p-4 bg-slate-100/50 dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4" />
                  <span>Primary Hotspot Driver</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  <strong>{hotspot.category}</strong> drives <strong>{hotspot.percentage}%</strong> of your carbon mirror profile.
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {hotspot.description} {hotspot.action && `Try: ${hotspot.action}`}
                </p>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {carbonDNA.description}
              </p>

              {/* Category distribution badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  { label: 'Transit', val: carbonDNA.contributions.transport, color: 'border-blue-500/30 text-blue-600 dark:text-blue-400' },
                  { label: 'Diet', val: carbonDNA.contributions.food, color: 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400' },
                  { label: 'Utilities', val: carbonDNA.contributions.energy, color: 'border-yellow-500/30 text-yellow-600 dark:text-yellow-400' },
                  { label: 'Goods', val: carbonDNA.contributions.shopping, color: 'border-indigo-500/30 text-indigo-600 dark:text-indigo-400' },
                  { label: 'Courier', val: carbonDNA.contributions.delivery, color: 'border-pink-500/30 text-pink-600 dark:text-pink-400' },
                  { label: 'Digital', val: carbonDNA.contributions.digital, color: 'border-purple-500/30 text-purple-600 dark:text-purple-400' }
                ].map(item => (
                  <span key={item.label} className={`text-xs px-2.5 py-1 rounded-full border bg-slate-100/50 dark:bg-slate-950/40 font-medium ${item.color}`}>
                    {item.label}: {item.val}%
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TOP 3 LIFESTYLE CHANGES HERO SECTION */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-2xl font-bold tracking-tight">Top 3 Recommended Lifestyle Changes</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Based on your Carbon DNA, our Intervention Engine calculated these high-impact changes to save carbon, money, and effort.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Highest Carbon Reduction */}
            <div className="rounded-2xl p-[1px] bg-gradient-to-tr from-emerald-400 to-transparent shadow-xl glass-card bg-white/50 dark:bg-slate-900/40 relative overflow-hidden group">
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                Max Carbon Cut
              </div>
              <div className="p-5 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Leaf className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors text-base line-clamp-2">
                    {highestReduction.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">
                    {highestReduction.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-200 dark:border-white/5 text-xs">
                  <div>
                    <span className="text-slate-500 block">Carbon Cut</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">-{highestReduction.carbonReduction} kg/yr</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Money Saved</span>
                    <span className="font-extrabold text-teal-600 dark:text-teal-400">
                      {highestReduction.moneySavings >= 0 ? `$${highestReduction.moneySavings}` : `-$${Math.abs(highestReduction.moneySavings)}`} /yr
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Effort Level</span>
                    <span className="font-bold text-yellow-600 dark:text-yellow-400">{highestReduction.effortLevel}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Timeline</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{highestReduction.timeline}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleAction(highestReduction.id)}
                  className={`w-full py-2 rounded-xl text-xs font-semibold border transition-all ${
                    completedActions.includes(highestReduction.id)
                      ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold'
                      : 'border-slate-200 dark:border-white/5 hover:border-emerald-500/30 text-slate-600 dark:text-slate-300 hover:bg-emerald-500/5'
                  }`}
                >
                  {completedActions.includes(highestReduction.id) ? '✓ Added to Action Plan' : '+ Add to Action Plan'}
                </button>
              </div>
            </div>

            {/* Card 2: Highest Money Saving */}
            <div className="rounded-2xl p-[1px] bg-gradient-to-tr from-teal-400 to-transparent shadow-xl glass-card bg-white/50 dark:bg-slate-900/40 relative overflow-hidden group">
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-md text-[10px] font-bold uppercase tracking-wider border border-teal-500/20">
                Max Money Saved
              </div>
              <div className="p-5 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors text-base line-clamp-2">
                    {highestMoneySaving.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">
                    {highestMoneySaving.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-200 dark:border-white/5 text-xs">
                  <div>
                    <span className="text-slate-500 block">Carbon Cut</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">-{highestMoneySaving.carbonReduction} kg/yr</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Money Saved</span>
                    <span className="font-extrabold text-teal-600 dark:text-teal-400">
                      {highestMoneySaving.moneySavings >= 0 ? `$${highestMoneySaving.moneySavings}` : `-$${Math.abs(highestMoneySaving.moneySavings)}`} /yr
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Effort Level</span>
                    <span className="font-bold text-yellow-600 dark:text-yellow-400">{highestMoneySaving.effortLevel}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Timeline</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{highestMoneySaving.timeline}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleAction(highestMoneySaving.id)}
                  className={`w-full py-2 rounded-xl text-xs font-semibold border transition-all ${
                    completedActions.includes(highestMoneySaving.id)
                      ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold'
                      : 'border-slate-200 dark:border-white/5 hover:border-emerald-500/30 text-slate-600 dark:text-slate-300 hover:bg-emerald-500/5'
                  }`}
                >
                  {completedActions.includes(highestMoneySaving.id) ? '✓ Added to Action Plan' : '+ Add to Action Plan'}
                </button>
              </div>
            </div>

            {/* Card 3: Easiest Change */}
            <div className="rounded-2xl p-[1px] bg-gradient-to-tr from-indigo-400 to-transparent shadow-xl glass-card bg-white/50 dark:bg-slate-900/40 relative overflow-hidden group">
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-md text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20">
                Easiest Habit Swap
              </div>
              <div className="p-5 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Smile className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors text-base line-clamp-2">
                    {easiestChange.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">
                    {easiestChange.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-200 dark:border-white/5 text-xs">
                  <div>
                    <span className="text-slate-500 block">Carbon Cut</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">-{easiestChange.carbonReduction} kg/yr</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Money Saved</span>
                    <span className="font-extrabold text-teal-600 dark:text-teal-400">
                      {easiestChange.moneySavings >= 0 ? `$${easiestChange.moneySavings}` : `-$${Math.abs(easiestChange.moneySavings)}`} /yr
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Effort Level</span>
                    <span className="font-bold text-yellow-600 dark:text-yellow-400">{easiestChange.effortLevel}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Timeline</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{easiestChange.timeline}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleAction(easiestChange.id)}
                  className={`w-full py-2 rounded-xl text-xs font-semibold border transition-all ${
                    completedActions.includes(easiestChange.id)
                      ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold'
                      : 'border-slate-200 dark:border-white/5 hover:border-emerald-500/30 text-slate-600 dark:text-slate-300 hover:bg-emerald-500/5'
                  }`}
                >
                  {completedActions.includes(easiestChange.id) ? '✓ Added to Action Plan' : '+ Add to Action Plan'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Enter Dashboard button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="group relative flex items-center gap-2 px-8 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-emerald-500/30 rounded-2xl text-slate-800 dark:text-slate-100 font-bold text-base shadow-xl transition-all duration-200 hover:scale-102 focus:outline-none"
          >
            <span>Enter Climate Intelligence Dashboard</span>
            <ArrowRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
