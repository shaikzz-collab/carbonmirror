import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getDecisionScenarios } from '../utils/calculations';
import {
  Compass,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Plane,
  Beef,
  ShoppingBag,
  Home,
  Truck
} from 'lucide-react';

export const DecisionAssistant: React.FC = () => {
  const { answers, setActiveTab } = useApp();
  const [activeCategory, setActiveCategory] = useState<'travel' | 'food' | 'shopping' | 'energy' | 'delivery'>('travel');

  if (!answers) {
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

  const scenarios = getDecisionScenarios(answers);
  const activeScenario = scenarios.find(s => s.category === activeCategory) || scenarios[0];

  const categoryTabs = [
    { key: 'travel' as const, label: 'Travel & Flights', icon: Plane },
    { key: 'food' as const, label: 'Diet & Dining', icon: Beef },
    { key: 'shopping' as const, label: 'Shopping & Retail', icon: ShoppingBag },
    { key: 'energy' as const, label: 'Home Energy', icon: Home },
    { key: 'delivery' as const, label: 'Takeout Delivery', icon: Truck }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100 font-sans pb-16">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Decision Camera</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Pre-decision environmental advisor. Evaluate choices BEFORE checking out or booking.
        </p>
      </header>

      {/* Categories Bar */}
      <div className="flex flex-wrap gap-2.5">
        {categoryTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl border text-sm font-semibold transition-all ${
                activeCategory === tab.key
                  ? 'bg-gradient-to-r from-emerald-500/20 to-indigo-500/20 border-emerald-400/80 text-emerald-300'
                  : 'bg-white/70 dark:bg-slate-900/50 border-slate-200 dark:border-white/5 hover:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Comparative Evaluation Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Side-by-Side Comparison (8 cols) */}
        <div className="lg:col-span-8 p-[1.5px] rounded-3xl bg-gradient-to-br from-white/10 to-transparent glass-card bg-white/50 dark:bg-slate-900/40">
          <div className="p-6 sm:p-8 space-y-8">
            <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Scenario: {activeScenario.title}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {/* Option A (Baseline / Red Option) */}
              <div className="p-5 rounded-2xl bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Option A (Standard Choice)</h3>
                  <span className="text-[10px] text-red-600 dark:text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/10">High Carbon</span>
                </div>
                <h4 className="font-black text-lg text-slate-700 dark:text-slate-200">{activeScenario.optionA.name}</h4>

                <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Carbon Cost</span>
                    <span className="font-bold">{activeScenario.optionA.carbon} kg CO₂e</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Financial Cost</span>
                    <span className="font-bold">${activeScenario.optionA.cost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Duration</span>
                    <span className="font-bold">{activeScenario.optionA.time} mins</span>
                  </div>
                </div>
              </div>

              {/* Option B (Sustainable Option) */}
              <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Option B (Climate Alternative)</h3>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Recommended</span>
                </div>
                <h4 className="font-black text-lg text-emerald-300">{activeScenario.optionB.name}</h4>

                <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Carbon Cost</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{activeScenario.optionB.carbon} kg CO₂e</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Financial Cost</span>
                    <span className="font-bold text-teal-600 dark:text-teal-400">${activeScenario.optionB.cost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Duration</span>
                    <span className="font-bold">{activeScenario.optionB.time} mins</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Recommendation Engine (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Analysis Summary */}
          <div className="p-6 rounded-3xl bg-slate-900/55 border border-slate-200 dark:border-white/5 glass-card space-y-6">
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Advisor Recommendation</span>
              </h3>
              <div className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2 pt-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Choose Option {activeScenario.recommendation}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-100/50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200 dark:border-white/5">
              {activeScenario.reasoning}
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500 dark:text-slate-400">Carbon Savings By Switching</span>
                <span className="text-emerald-600 dark:text-emerald-400">-{activeScenario.carbonSaved} kg CO₂e</span>
              </div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500 dark:text-slate-400">Financial Savings</span>
                <span className="text-teal-600 dark:text-teal-400">+${activeScenario.moneySaved} Saved</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-[10px] text-slate-500 leading-relaxed flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500/70 flex-shrink-0 mt-0.5" />
                <span>
                  Adjusting actions BEFORE checkout delivers the highest real-world mitigation rates.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
