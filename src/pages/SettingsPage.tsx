import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { simulateFuturePaths, calculateTimeCapsule } from '../utils/calculations';
import {
  Settings,
  FileText,
  Copy,
  Check,
  RefreshCw,
  Sun,
  Moon,
  Download,
  AlertCircle
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    answers,
    baselineBreakdown,
    carbonDNA,
    hotspot,
    interventions,
    top3Changes,
    completedActions,
    theme,
    toggleTheme,
    resetAllData,
    setActiveTab
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [goalLevel, setGoalLevel] = useState<'neutral' | 'moderate' | 'zero'>('moderate');

  if (!answers || !baselineBreakdown || !carbonDNA || !hotspot || !top3Changes) {
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

  // Future twin values for report
  const paths = simulateFuturePaths(baselineBreakdown, interventions);
  const pathACarbon = paths[0].projections.oneYear.carbon;
  const pathBCarbon = paths[1].projections.oneYear.carbon;
  const pathCCarbon = paths[2].projections.oneYear.carbon;

  // Time capsule values for report
  const capsule10 = calculateTimeCapsule(baselineBreakdown, 10);
  const capsule50 = calculateTimeCapsule(baselineBreakdown, 50);

  // Generate Report Text (Markdown Format)
  const generateReportText = () => {
    const activeActionsText = interventions
      .filter(x => completedActions.includes(x.id))
      .map(x => `- [x] ${x.name} (Saves ${x.carbonReduction} kg/yr, $${x.moneySavings}/yr)`)
      .join('\n');

    const inactiveActionsText = interventions
      .filter(x => !completedActions.includes(x.id))
      .map(x => `- [ ] ${x.name} (Saves ${x.carbonReduction} kg/yr, $${x.moneySavings}/yr)`)
      .join('\n');

    return `=========================================
CARBON MIRROR | CLIMATE INTELLIGENCE REPORT
Generated on: ${new Date().toLocaleDateString()}
=========================================

1. CARBON DNA CLASSIFICATION
----------------------------
DNA Profile: ${carbonDNA.title}
Avatar ID: ${carbonDNA.avatarSymbol}
Description: ${carbonDNA.description}

Category Footprint Breakdown:
- Transportation: ${baselineBreakdown.transport} kg CO2e/mo (${carbonDNA.contributions.transport}%)
- Dietary Choices: ${baselineBreakdown.food} kg CO2e/mo (${carbonDNA.contributions.food}%)
- Home Utilities: ${baselineBreakdown.energy} kg CO2e/mo (${carbonDNA.contributions.energy}%)
- Goods & Shopping: ${baselineBreakdown.shopping} kg CO2e/mo (${carbonDNA.contributions.shopping}%)
- Courier & Delivery: ${baselineBreakdown.delivery} kg CO2e/mo (${carbonDNA.contributions.delivery}%)
- Digital Footprint: ${baselineBreakdown.digital} kg CO2e/mo (${carbonDNA.contributions.digital}%)
----------------------------
TOTAL BASELINE EMISSIONS: ${baselineBreakdown.total} kg CO2e/month

2. CLIMATE HOTSPOT DETECTION
----------------------------
Primary Hotspot: ${hotspot.category}
Contribution Rate: ${hotspot.percentage}% of baseline
Explanation: ${hotspot.description}
Fastest Mitigation Target: ${hotspot.action}

3. PRIMARY LIFESTYLE CHANGES
----------------------------
- Highest Carbon Cut: ${top3Changes.highestReduction.name}
  (Mitigates: -${top3Changes.highestReduction.carbonReduction} kg CO2e/yr | Saves: $${top3Changes.highestReduction.moneySavings}/yr)
- Highest Money Saver: ${top3Changes.highestMoneySaving.name}
  (Mitigates: -${top3Changes.highestMoneySaving.carbonReduction} kg CO2e/yr | Saves: $${top3Changes.highestMoneySaving.moneySavings}/yr)
- Easiest Swapping Habit: ${top3Changes.easiestChange.name}
  (Mitigates: -${top3Changes.easiestChange.carbonReduction} kg CO2e/yr | Saves: $${top3Changes.easiestChange.moneySavings}/yr)

4. REGRET & FUTURE LIFE PATHS (1-YEAR TRAJECTORY)
----------------------------
- Path A (Current lifestyle): Emits ${pathACarbon} kg CO2e/yr
- Path B (Moderate shifts): Emits ${pathBCarbon} kg CO2e/yr | Saves $${paths[1].projections.oneYear.moneySaved}/yr
- Path C (High sustainability): Emits ${pathCCarbon} kg CO2e/yr | Saves $${paths[2].projections.oneYear.moneySaved}/yr
Inaction Gap (Carbon Regret): ${pathACarbon - pathCCarbon} kg CO2e of unnecessary emissions emitted yearly if no action is taken.

5. CARBON TIME CAPSULE OUTLOOK
----------------------------
Locked into your current baseline for:
* 10 Years:
  - CO2 Gas Volume: ${capsule10.co2SwimmingPools} Olympic swimming pools
  - Landfill Waste: ${capsule10.garbageTrucks.toFixed(1)} garbage trucks of trash
  - Mature Forest offset required: ${capsule10.forestAcres} acres of forest
* 50 Years:
  - CO2 Gas Volume: ${capsule50.co2SwimmingPools} Olympic swimming pools
  - Landfill Waste: ${capsule50.garbageTrucks.toFixed(1)} garbage trucks of trash
  - Mature Forest offset required: ${capsule50.forestAcres} acres of forest

6. ACTIVE MONTHLY ACTION PLAN
----------------------------
Enrolled / Enacted Actions:
${activeActionsText || 'No actions currently enrolled.'}

Available Opportunities:
${inactiveActionsText || 'All opportunities enrolled!'}

=========================================
Report generated locally via browser local storage.
"Don't just measure your footprint. See your future."
=========================================`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100 font-sans pb-16">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Platform Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Edit goals, export data, generate sustainability reports, or reset variables.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Goal Settings & Utilities (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Theme & Profile quick links */}
          <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 glass-card space-y-6">
            <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>General Configurations</span>
            </h2>

            {/* Theme Toggle */}
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-200 block">Theme Mode</span>
                <span className="text-slate-500 text-[10px]">Adjust app styling environment.</span>
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 hover:border-slate-800 rounded-xl font-bold transition-all text-slate-600 dark:text-slate-300"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>

            {/* Edit Profile inputs */}
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Sustainability Target</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'neutral', label: 'Net Neutral', desc: 'Standard offset' },
                  { key: 'moderate', label: 'Balanced', desc: '-40% carbon' },
                  { key: 'zero', label: 'Near Zero', desc: '-75% carbon' }
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setGoalLevel(item.key as any)}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      goalLevel === item.key
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-100/50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 hover:border-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <span className="font-bold text-xs block">{item.label}</span>
                    <span className="text-[9px] text-slate-500 block leading-tight mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Danger zone reset */}
          <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 glass-card space-y-4">
            <h2 className="text-base font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>Danger Zone</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
              Resetting will wipe all local storage data, including your Carbon DNA, active weekly checklist progress, daily receipt logs, and streak metrics.
            </p>
            <button
              onClick={() => {
                if (window.confirm('Are you absolutely sure you want to delete all lifestyle profiles, receipts, and reset Carbon Mirror?')) {
                  resetAllData();
                }
              }}
              className="w-full py-2.5 bg-red-650 hover:bg-red-600 bg-red-500 text-slate-950 font-bold rounded-xl text-sm transition-all"
            >
              Reset All Platform Data
            </button>
          </div>
        </div>

        {/* Right Side: AI Sustainability Report Generator (7 cols) */}
        <div className="lg:col-span-7 p-[1.5px] rounded-3xl bg-gradient-to-br from-indigo-500/30 via-slate-800/40 to-emerald-500/20 glass-card bg-white/50 dark:bg-slate-900/40">
          <div className="p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>AI Sustainability Report</span>
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Compile your Carbon DNA, hotspot results, Future Life Path projections, regret gap, and enrolled action checkpoints into a shareable environmental dossier.
            </p>

            {!reportGenerated ? (
              <button
                onClick={() => setReportGenerated(true)}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-xl text-slate-950 font-bold text-sm hover:scale-102 transition-all flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Compile & Generate Report</span>
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={handleCopy}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-1.5 transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy to Clipboard'}</span>
                  </button>
                  <button
                    onClick={() => {
                      const element = document.createElement("a");
                      const file = new Blob([generateReportText()], {type: 'text/plain'});
                      element.href = URL.createObjectURL(file);
                      element.download = "carbon_mirror_intelligence_report.txt";
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download TXT</span>
                  </button>
                </div>

                {/* Report display text box */}
                <textarea
                  readOnly
                  value={generateReportText()}
                  className="w-full h-80 bg-slate-950/80 border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-xs font-mono text-emerald-300 leading-relaxed focus:outline-none scrollbar-thin"
                />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
