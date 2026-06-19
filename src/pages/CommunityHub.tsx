import React from 'react';
import { Users, Trees, Milestone, Flame } from 'lucide-react';

export const CommunityHub: React.FC = () => {

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100 font-sans pb-16">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Community Impact Hub</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Monitor the crowd-sourced environmental mitigation of Carbon Mirror users.
        </p>
      </header>

      {/* Aggregate Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 glass-card space-y-3">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Flame className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">Collective Mitigation</span>
          <div className="text-2xl font-black text-slate-800 dark:text-white">
            1,420,580 kg <span className="text-sm font-normal text-slate-500 dark:text-slate-400">CO₂e</span>
          </div>
          <p className="text-[10px] text-slate-500">Total emissions avoided across all active platforms.</p>
        </div>

        <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 glass-card space-y-3">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Trees className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">Forest Absorption Equivalent</span>
          <div className="text-2xl font-black text-slate-800 dark:text-white">
            56,823 <span className="text-sm font-normal text-slate-500 dark:text-slate-400">Trees/yr</span>
          </div>
          <p className="text-[10px] text-slate-500">Acre-equivalent mature woodlands absorbing carbon.</p>
        </div>

        <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 glass-card space-y-3">
          <div className="w-10 h-10 bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">Missions Fulfilled</span>
          <div className="text-2xl font-black text-slate-800 dark:text-white">
            84,250 <span className="text-sm font-normal text-slate-500 dark:text-slate-400">Challenges</span>
          </div>
          <p className="text-[10px] text-slate-500">Habit switches registered this calendar year.</p>
        </div>
      </section>

      {/* Community Milestones */}
      <section className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 glass-card space-y-6">
        <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
          <Milestone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Active Community Milestones</span>
        </h2>

        <div className="space-y-4">
          {[
            { title: 'Operation Solar Grid', desc: 'Transition 500 active households to renewable matched utility plans.', progress: 84, target: '500 households' },
            { title: 'The Circular Resale Wave', desc: 'Divert 10,000 kg of apparel waste by sourcing secondary resale markets.', progress: 62, target: '10,000 kg waste' },
            { title: 'commute-less June', desc: 'Carpool or work remotely to save 20,000 kg of gasoline transport emissions.', progress: 41, target: '20,000 kg CO2' }
          ].map(mile => (
            <div key={mile.title} className="p-4 rounded-xl bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <h4 className="font-extrabold text-slate-700 dark:text-slate-200">{mile.title}</h4>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{mile.progress}%</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{mile.desc}</p>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full"
                  style={{ width: `${mile.progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[8px] text-slate-500 font-bold uppercase">
                <span>Objective: {mile.target}</span>
                <span>Active Campaign</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
