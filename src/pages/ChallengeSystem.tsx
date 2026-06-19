import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, Flame, CheckCircle2, Circle, Target, Trophy } from 'lucide-react';

export const ChallengeSystem: React.FC = () => {
  const {
    challenges,
    badges,
    streak,
    toggleChallenge
  } = useApp();

  // Calculate stats
  const totalRewardSaved = challenges
    .filter(c => c.isCompleted)
    .reduce((sum, c) => sum + c.carbonReward, 0);

  const level = Math.floor(streak / 5) + 1;

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100 font-sans pb-16">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Eco Challenge Hub</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Participate in daily habits, unlock badges, and check streak milestones.
          </p>
        </div>

        {/* Streak and Level Widget */}
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 px-4 py-2.5 rounded-2xl">
            <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400 fill-orange-400/10 animate-bounce" />
            <div className="text-left">
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">Streak Log</span>
              <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{streak} Days</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 px-4 py-2.5 rounded-2xl">
            <Trophy className="w-5 h-5 text-yellow-400 fill-yellow-400/10" />
            <div className="text-left">
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">Eco Level</span>
              <span className="text-sm font-bold text-yellow-400">Level {level}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Summary Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-3xl bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 glass-card">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">Daily Carbon Offset Saved</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            -{totalRewardSaved.toFixed(1)} kg CO₂e
          </div>
          <p className="text-xs text-slate-500">Compounded across currently completed daily/weekly habits.</p>
        </div>
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">Total Tasks Done</span>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
            {challenges.filter(c => c.isCompleted).length} Tasks
          </div>
          <p className="text-xs text-slate-500">Strengthen your streak to unlock higher eco tiers.</p>
        </div>
      </section>

      {/* Challenges & Missions Split Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Active Challenges (7 cols) */}
        <div className="lg:col-span-7 p-[1.5px] rounded-3xl bg-gradient-to-br from-white/10 to-transparent glass-card bg-white/50 dark:bg-slate-900/40">
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Active Missions & Daily Tasks</span>
            </h2>

            <div className="space-y-3">
              {challenges.map(ch => (
                <div
                  key={ch.id}
                  onClick={() => toggleChallenge(ch.id)}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer select-none ${
                    ch.isCompleted
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-100/50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 hover:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 pr-4">
                    <div className="flex-shrink-0">
                      {ch.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-400/10" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200">{ch.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{ch.description}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 text-xs font-semibold">
                    <span className="block text-emerald-600 dark:text-emerald-400">-{ch.carbonReward} kg</span>
                    <span className="text-[10px] text-slate-500 uppercase">{ch.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Carbon Achievement Journey Badges (5 cols) */}
        <div className="lg:col-span-5 p-[1.5px] rounded-3xl bg-gradient-to-br from-white/10 to-transparent glass-card bg-white/50 dark:bg-slate-900/40">
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Achievement Journey</span>
            </h2>

            <div className="space-y-4">
              {badges.map(bg => (
                <div key={bg.id} className="p-4 rounded-xl bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl" role="img" aria-label={bg.title}>
                        {bg.iconName === 'leaf' && '🌿'}
                        {bg.iconName === 'shopping-bag' && '🛍️'}
                        {bg.iconName === 'car' && '🚗'}
                        {bg.iconName === 'trash' && '♻️'}
                        {bg.iconName === 'award' && '🏅'}
                      </span>
                      <div>
                        <h4 className="font-bold text-xs text-slate-700 dark:text-slate-200">{bg.title}</h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{bg.description}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      bg.progress === 100
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    }`}>
                      {bg.progress === 100 ? 'Unlocked' : 'In Progress'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full transition-all duration-300"
                        style={{ width: `${bg.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[8px] text-slate-500 font-bold uppercase">
                      <span>{bg.milestone}</span>
                      <span>{bg.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
