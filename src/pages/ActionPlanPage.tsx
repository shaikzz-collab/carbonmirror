import React from 'react';
import { useApp } from '../context/AppContext';
import { Zap, Leaf, CheckCircle2, Circle, AlertCircle, Sparkles } from 'lucide-react';

export const ActionPlanPage: React.FC = () => {
  const {
    interventions,
    completedActions,
    toggleAction,
    top3Changes,
    setActiveTab
  } = useApp();

  if (interventions.length === 0 || !top3Changes) {
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

  // Progress calculations
  const totalActions = interventions.length;
  const activeActionsCount = completedActions.length;
  const progressPercent = totalActions > 0 ? Math.round((activeActionsCount / totalActions) * 100) : 0;

  // Total projected savings
  const activeInterventions = interventions.filter(x => completedActions.includes(x.id));
  const totalCarbonSaved = activeInterventions.reduce((sum, x) => sum + x.carbonReduction, 0);
  const totalMoneySaved = activeInterventions.reduce((sum, x) => sum + x.moneySavings, 0);

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100 font-sans pb-16">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Your Personalized Action Plan</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enact these prioritized climate interventions to rewrite your future trajectory.
          </p>
        </div>

        {/* Progress Badge */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 px-4 py-2.5 rounded-2xl">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 font-semibold block uppercase">Plan Enrollment</span>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{activeActionsCount} of {totalActions} Active</span>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-emerald-400/20 flex items-center justify-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {progressPercent}%
          </div>
        </div>
      </header>

      {/* Dynamic Summary Widget */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-3xl bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 glass-card">
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Projected Carbon Mitigation</span>
          </h3>
          <div className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            -{totalCarbonSaved.toLocaleString()} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">kg CO₂e / yr</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Based on your currently enrolled sustainable actions.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Projected Annual Savings</span>
          </h3>
          <div className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            ${totalMoneySaved.toLocaleString()} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">/ yr</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Direct reduction in fuel, utility bills, and impulse buys.
          </p>
        </div>
      </section>

      {/* CENTERPIECE: INTERVENTION ENGINE (TOP HIGHLIGHT CARDS) */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-bold tracking-tight">Intervention Engine Recommendations</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Best Action */}
          <div className="p-5 rounded-2xl bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 space-y-4 relative overflow-hidden group">
            <div className="absolute top-2 right-2 text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Best Match
            </div>
            <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{top3Changes.highestReduction.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal line-clamp-2">{top3Changes.highestReduction.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-200 dark:border-white/5 font-medium">
              <div>
                <span className="text-slate-500 block">Carbon Saved</span>
                <span className="text-emerald-600 dark:text-emerald-400">-{top3Changes.highestReduction.carbonReduction} kg/yr</span>
              </div>
              <div>
                <span className="text-slate-500 block">Difficulty</span>
                <span className="text-slate-700 dark:text-slate-200">Level {top3Changes.highestReduction.difficulty}/5</span>
              </div>
            </div>
            <button
              onClick={() => toggleAction(top3Changes.highestReduction.id)}
              className={`w-full py-2 rounded-xl text-xs font-semibold border transition-all ${
                completedActions.includes(top3Changes.highestReduction.id)
                  ? 'bg-emerald-500 text-slate-950 border-emerald-500 font-bold'
                  : 'border-slate-200 dark:border-white/5 hover:border-emerald-500/30 text-slate-600 dark:text-slate-300'
              }`}
            >
              {completedActions.includes(top3Changes.highestReduction.id) ? '✓ Enrolled' : 'Enroll Action'}
            </button>
          </div>

          {/* Easiest Action */}
          <div className="p-5 rounded-2xl bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 space-y-4 relative overflow-hidden group">
            <div className="absolute top-2 right-2 text-[10px] bg-teal-500/10 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Easiest Cut
            </div>
            <div className="w-9 h-9 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Zap className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{top3Changes.easiestChange.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal line-clamp-2">{top3Changes.easiestChange.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-200 dark:border-white/5 font-medium">
              <div>
                <span className="text-slate-500 block">Carbon Saved</span>
                <span className="text-emerald-600 dark:text-emerald-400">-{top3Changes.easiestChange.carbonReduction} kg/yr</span>
              </div>
              <div>
                <span className="text-slate-500 block">Difficulty</span>
                <span className="text-slate-700 dark:text-slate-200">Level {top3Changes.easiestChange.difficulty}/5</span>
              </div>
            </div>
            <button
              onClick={() => toggleAction(top3Changes.easiestChange.id)}
              className={`w-full py-2 rounded-xl text-xs font-semibold border transition-all ${
                completedActions.includes(top3Changes.easiestChange.id)
                  ? 'bg-emerald-500 text-slate-950 border-emerald-500 font-bold'
                  : 'border-slate-200 dark:border-white/5 hover:border-emerald-500/30 text-slate-600 dark:text-slate-300'
              }`}
            >
              {completedActions.includes(top3Changes.easiestChange.id) ? '✓ Enrolled' : 'Enroll Action'}
            </button>
          </div>

          {/* Maximum Impact Action */}
          {/* Note: In our selections, highest reduction represents max impact */}
          {/* We will pick the second highest carbon reduction for the third card to add variety */}
          {(() => {
            const sorted = [...interventions].sort((a, b) => b.carbonReduction - a.carbonReduction);
            const maxImpact = sorted[1] || sorted[0];
            return (
              <div className="p-5 rounded-2xl bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 space-y-4 relative overflow-hidden group">
                <div className="absolute top-2 right-2 text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Max Impact
                </div>
                <div className="w-9 h-9 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{maxImpact.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal line-clamp-2">{maxImpact.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-200 dark:border-white/5 font-medium">
                  <div>
                    <span className="text-slate-500 block">Carbon Saved</span>
                    <span className="text-emerald-600 dark:text-emerald-400">-{maxImpact.carbonReduction} kg/yr</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Difficulty</span>
                    <span className="text-slate-700 dark:text-slate-200">Level {maxImpact.difficulty}/5</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleAction(maxImpact.id)}
                  className={`w-full py-2 rounded-xl text-xs font-semibold border transition-all ${
                    completedActions.includes(maxImpact.id)
                      ? 'bg-emerald-500 text-slate-950 border-emerald-500 font-bold'
                      : 'border-slate-200 dark:border-white/5 hover:border-emerald-500/30 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {completedActions.includes(maxImpact.id) ? '✓ Enrolled' : 'Enroll Action'}
                </button>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ALL INTERVENTIONS CHECKLIST */}
      <section className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 glass-card space-y-6">
        <h2 className="text-xl font-bold tracking-tight">Lifestyle Change Checklist</h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Inspect, evaluate, and check items to enroll them in your active carbon plan.
        </p>

        <div className="space-y-3">
          {interventions.map(act => {
            const isCompleted = completedActions.includes(act.id);
            return (
              <div
                key={act.id}
                onClick={() => toggleAction(act.id)}
                className={`p-4 rounded-2xl border transition-all flex items-center gap-4 cursor-pointer select-none ${
                  isCompleted
                    ? 'bg-emerald-500/5 border-emerald-500/30 hover:border-emerald-500/40'
                    : 'bg-slate-100/50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 hover:border-slate-800'
                }`}
              >
                {/* Checkbox Icon */}
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-400/10" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className={`font-bold text-sm truncate ${isCompleted ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-200'}`}>
                      {act.name}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase flex-shrink-0 bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded">
                      {act.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {act.description}
                  </p>
                </div>

                {/* Savings stats */}
                <div className="flex-shrink-0 text-right text-xs pl-2">
                  <span className="block font-bold text-emerald-600 dark:text-emerald-400">-{act.carbonReduction} kg CO₂e/yr</span>
                  {act.moneySavings > 0 && <span className="block text-[10px] text-teal-600 dark:text-teal-400">+${act.moneySavings}/yr</span>}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
