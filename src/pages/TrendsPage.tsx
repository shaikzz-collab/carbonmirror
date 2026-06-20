import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateTimeCapsule, simulateFuturePaths } from '../utils/calculations';
import { 
  TrendingDown, 
  Calendar, 
  BarChart2, 
  FileText, 
  Share2, 
  Printer, 
  ChevronDown, 
  ChevronUp, 
  Check,
  Award
} from 'lucide-react';

export const TrendsPage: React.FC = () => {
  const { 
    baselineBreakdown, 
    carbonDNA, 
    hotspot, 
    interventions, 
    top3Changes, 
    completedActions, 
    user, 
    streak, 
    setActiveTab 
  } = useApp();

  const [showReport, setShowReport] = useState(false);
  const [copied, setCopied] = useState(false);

  // Week-over-week mock data
  const weeklyHistory = baselineBreakdown ? [
    { week: 'Wk 21', carbon: baselineBreakdown.total + 30, adherence: 65 },
    { week: 'Wk 22', carbon: baselineBreakdown.total + 18, adherence: 70 },
    { week: 'Wk 23', carbon: baselineBreakdown.total + 10, adherence: 78 },
    { week: 'Wk 24', carbon: baselineBreakdown.total + 5, adherence: 80 },
    { week: 'Wk 25', carbon: baselineBreakdown.total - 12, adherence: 85 },
    { week: 'Today', carbon: baselineBreakdown.total - 25, adherence: 92 }
  ] : [];

  // AI Report calculations memoized to prevent redundant calculations
  const {
    oneYearRegretCarbon,
    oneYearRegretMoney,
    oneYearRegretWaste,
    capsule20YrCurrent,
    capsule20YrSustainable,
    activeInterventionsList
  } = React.useMemo(() => {
    if (!baselineBreakdown || !interventions) {
      return {
        oneYearRegretCarbon: 0,
        oneYearRegretMoney: 0,
        oneYearRegretWaste: 0,
        capsule20YrCurrent: null,
        capsule20YrSustainable: null,
        activeInterventionsList: []
      };
    }
    const paths = simulateFuturePaths(baselineBreakdown, interventions);
    const pathAOneYear = paths[0].projections.oneYear; // Inaction
    const pathCOneYear = paths[2].projections.oneYear; // Sustainable
    
    const oneYearRegretCarbon = pathAOneYear.carbon - pathCOneYear.carbon;
    const oneYearRegretMoney = pathCOneYear.moneySaved;
    const oneYearRegretWaste = pathAOneYear.waste - pathCOneYear.waste;

    const capsule20YrCurrent = calculateTimeCapsule(baselineBreakdown, 20);
    
    const sustainableBreakdown = {
      ...baselineBreakdown,
      total: Math.round(baselineBreakdown.total * 0.35),
      waste: Math.round(baselineBreakdown.waste * 0.30)
    };
    const capsule20YrSustainable = calculateTimeCapsule(sustainableBreakdown, 20);

    const activeInterventionsList = interventions.filter(x => completedActions.includes(x.id));

    return {
      paths,
      oneYearRegretCarbon,
      oneYearRegretMoney,
      oneYearRegretWaste,
      capsule20YrCurrent,
      capsule20YrSustainable,
      activeInterventionsList
    };
  }, [baselineBreakdown, interventions, completedActions]);

  if (!baselineBreakdown || !carbonDNA || !hotspot || !top3Changes || !capsule20YrCurrent || !capsule20YrSustainable) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-slate-500 space-y-4">
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 font-sans pb-16">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Trends & History</h1>
          <p className="text-sm text-slate-500">
            Monitor your weekly footprint history and habit compliance scores.
          </p>
        </div>
      </header>

      {/* Stats row */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white/70 border border-slate-100 glass-card space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">Monthly Improvement</span>
          <div className="text-3xl font-black text-emerald-600 flex items-center gap-1.5">
            <TrendingDown className="w-6 h-6 animate-bounce" />
            <span>-12.4%</span>
          </div>
          <p className="text-[10px] text-slate-500">Relative to your baseline onboarding scan.</p>
        </div>

        <div className="p-6 rounded-3xl bg-white/70 border border-slate-100 glass-card space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">Habit Adherence Rate</span>
          <div className="text-3xl font-black text-indigo-600">
            92% <span className="text-sm font-normal text-slate-500">Score</span>
          </div>
          <p className="text-[10px] text-slate-500">Based on completed weekly checklist items.</p>
        </div>

        <div className="p-6 rounded-3xl bg-white/70 border border-slate-100 glass-card space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">Compounding Offset</span>
          <div className="text-3xl font-black text-teal-600">
            -340 kg <span className="text-sm font-normal text-slate-500">Saved</span>
          </div>
          <p className="text-[10px] text-slate-500">Total emissions avoided since start of log.</p>
        </div>
      </section>

      {/* Historical Bars Chart (SVG) */}
      <section className="p-6 rounded-3xl bg-white/70 border border-slate-100 glass-card space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-emerald-600" />
            <span>Weekly Footprint Trajectory (kg CO₂e)</span>
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>Past 6 Weeks</span>
          </div>
        </div>

        {/* Screen Reader Table Alternative */}
        <div className="sr-only">
          <p>Weekly carbon footprint and habit adherence history table details:</p>
          <ul>
            {weeklyHistory.map(item => (
              <li key={item.week}>
                {item.week === 'Today' ? 'Today (estimated)' : item.week}: carbon footprint is {item.carbon} kg CO2e, habit adherence rate is {item.adherence}%.
              </li>
            ))}
          </ul>
        </div>

        {/* Dynamic bar charts */}
        <div className="space-y-4 pt-2">
          {weeklyHistory.map(item => {
            const maxVal = Math.max(...weeklyHistory.map(w => w.carbon));
            const pct = Math.round((item.carbon / maxVal) * 100);
            const isToday = item.week === 'Today';

            return (
              <div key={item.week} className="flex items-center gap-4">
                <span className="w-12 text-xs font-bold text-slate-500 flex-shrink-0 text-left">{item.week}</span>
                <div className="flex-grow h-6 bg-slate-100 border border-slate-200/50 rounded-lg overflow-hidden flex relative items-center">
                  <div
                    className={`h-full rounded-r-md transition-all duration-500 flex items-center px-3 text-[10px] font-black ${
                      isToday
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/10'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                    style={{ width: `${pct}%` }}
                  >
                    {item.carbon} kg
                  </div>
                </div>
                <span className="w-12 text-xs font-bold text-slate-500 flex-shrink-0 text-right">
                  {item.adherence}% compliance
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footprint Comparison */}
      <section className="p-6 rounded-3xl bg-white/70 border border-slate-100 glass-card space-y-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Week-over-Week Adherence comparison</h3>
        <p className="text-xs text-slate-500 leading-normal">
          In Week 25, you logged 5 vehicle trips replaced by public transit and maintained a vegetarian diet on Wednesday. That reduced your transportation category by 18% compared to Week 24. Keep up the high compliance to unlock the Level 3 Eco explorer status!
        </p>
      </section>

      {/* AI SUSTAINABILITY REPORT WIDGET */}
      <section className="p-[1.5px] rounded-3xl bg-gradient-to-r from-indigo-500/25 via-emerald-500/25 to-indigo-500/25 shadow-xl overflow-hidden">
        <div className="bg-white rounded-[22px] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>AI Sustainability Report</span>
              </h3>
              <p className="text-sm font-semibold text-slate-700">
                Generate your printable, shareable climate double assessment.
              </p>
            </div>
            <button
              onClick={() => setShowReport(!showReport)}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-xs font-bold text-white rounded-xl shadow-lg shadow-indigo-500/10 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none"
            >
              <span>{showReport ? 'Close Report' : 'Generate Full Report'}</span>
              {showReport ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showReport && (
            <div className="pt-6 border-t border-slate-100 space-y-8 animate-slide-up">
              {/* Main Report Container */}
              <div className="p-8 border border-slate-200/60 rounded-3xl bg-[#fafbfe]/80 space-y-8 relative overflow-hidden">
                {/* Certificate layout style */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-indigo-500/10 to-transparent pointer-events-none rounded-bl-full" />
                
                {/* Header info */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Climate Assessment Audit</div>
                    <h4 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                      <Award className="w-5 h-5 text-indigo-500" />
                      <span>Carbon Mirror Profile Verification</span>
                    </h4>
                  </div>
                  <div className="text-left sm:text-right text-xs text-slate-500 space-y-0.5">
                    <div>User Profile: <strong>{user?.name || 'Anonymous User'}</strong></div>
                    <div>Email: <strong>{user?.email || 'unregistered@profile.com'}</strong></div>
                    <div>Streak: <strong>{streak} Days Active</strong></div>
                  </div>
                </header>

                {/* 1. Carbon DNA archetype details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="flex flex-col items-center justify-center p-6 bg-white border border-slate-100 rounded-2xl shadow-sm text-center">
                    <span className="text-6xl mb-3 select-none">{carbonDNA.avatarSymbol}</span>
                    <h5 className="font-extrabold text-indigo-600 text-base">{carbonDNA.title}</h5>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">ECOLOGICAL DNA</span>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Archetype Narrative</span>
                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        "{carbonDNA.description}"
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 block">Baseline Footprint</span>
                        <span className="font-extrabold text-slate-800">{baselineBreakdown.total} kg/mo</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Hotspot Driver</span>
                        <span className="font-extrabold text-red-600">{hotspot.category}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Hotspot Ratio</span>
                        <span className="font-extrabold text-red-600">{hotspot.percentage}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Regret Analysis & Inaction Gap (1-Year Outlook) */}
                <div className="space-y-4 pt-4 border-t border-slate-200/50">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">1-Year Regret Analysis (Cost of Inaction)</h5>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    By choosing inaction (Path A) over sustainable practices (Path C), you accumulate the following negative carbon and financial debt over 1 year:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Carbon Debt</span>
                      <div className="text-xl font-black text-red-600">+{oneYearRegretCarbon} kg CO₂</div>
                      <span className="text-[9px] text-slate-500 block">Released to atmosphere</span>
                    </div>
                    <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Financial Waste</span>
                      <div className="text-xl font-black text-red-600">${oneYearRegretMoney} lost</div>
                      <span className="text-[9px] text-slate-500 block">Forfeited savings opportunities</span>
                    </div>
                    <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Landfill Accumulation</span>
                      <div className="text-xl font-black text-red-600">+{oneYearRegretWaste} kg Trash</div>
                      <span className="text-[9px] text-slate-500 block">Extra solid waste generated</span>
                    </div>
                  </div>
                </div>

                {/* 3. Time Capsule 20-Year Metaphors */}
                <div className="space-y-4 pt-4 border-t border-slate-200/50">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">20-Year Long-Term Cumulative Outlook</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm space-y-3">
                      <div className="text-xs font-bold text-red-600">Under Current Habits (Path A)</div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[9px]">CO₂ Pools</span>
                          <span className="font-extrabold text-slate-700">{capsule20YrCurrent.co2SwimmingPools} Pools</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px]">Forest Acres</span>
                          <span className="font-extrabold text-slate-700">{capsule20YrCurrent.forestAcres} Acres</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px]">Coal Burned</span>
                          <span className="font-extrabold text-slate-700">{capsule20YrCurrent.coalTons} Tons</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-3">
                      <div className="text-xs font-bold text-emerald-600">Under Sustainable Habits (Path C)</div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[9px]">CO₂ Pools</span>
                          <span className="font-extrabold text-emerald-600">{capsule20YrSustainable.co2SwimmingPools} Pools</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px]">Forest Acres</span>
                          <span className="font-emerald-600">{capsule20YrSustainable.forestAcres} Acres</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px]">Coal Burned</span>
                          <span className="font-extrabold text-emerald-600">{capsule20YrSustainable.coalTons} Tons</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Active Monthly Action Plan */}
                <div className="space-y-4 pt-4 border-t border-slate-200/50">
                  <div className="flex justify-between items-center">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Action Plan Enrolments</h5>
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-600 font-bold px-2 py-0.5 rounded">
                      {activeInterventionsList.length} Active Intervention(s)
                    </span>
                  </div>
                  {activeInterventionsList.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No checklist interventions currently enrolled. Go to the Action Plan tab to select your goals.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {activeInterventionsList.map(item => (
                        <div key={item.id} className="flex items-center gap-2 p-2.5 bg-white border border-slate-100 rounded-xl shadow-xs">
                          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <div className="min-w-0">
                            <span className="font-bold text-slate-700 block truncate">{item.name}</span>
                            <span className="text-[9px] text-emerald-600 font-semibold">-{item.carbonReduction} kg CO₂/yr</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-end gap-3 pt-2">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none"
                >
                  <Share2 className="w-4 h-4 text-slate-500" />
                  <span>{copied ? 'Link Copied!' : 'Share Assessment Link'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-xs font-bold text-indigo-600 rounded-xl transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none"
                >
                  <Printer className="w-4 h-4 text-indigo-500" />
                  <span>Print PDF Report</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
