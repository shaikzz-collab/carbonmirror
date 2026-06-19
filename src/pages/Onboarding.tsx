import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { LifestyleAnswers } from '../types';
import { calculateBaseline } from '../utils/calculations';
import { ChevronRight, ChevronLeft, Sparkles, Leaf, Zap } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const { setOnboardingData } = useApp();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<LifestyleAnswers>({
    commuteStyle: 'car_gas',
    commuteDistance: 60,
    dietStyle: 'balanced',
    localFood: false,
    electricityBill: 100,
    greenEnergy: false,
    acUsage: 'optimized',
    onlinePurchases: 'weekly',
    deliveryFrequency: 'weekly',
    digitalUsage: 'moderate',
    wasteGeneration: 'partial',
    yearlyFlights: 'few'
  });

  const totalSteps = 12;

  // Live footprint breakdown
  const liveBreakdown = calculateBaseline(answers);

  const updateAnswer = <K extends keyof LifestyleAnswers>(key: K, value: LifestyleAnswers[K]) => {
    setAnswers(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setOnboardingData(answers);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-8 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[20%] h-[70%] w-[60%] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[20%] h-[70%] w-[60%] rounded-full bg-indigo-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Onboarding Wizard Form (Left) */}
        <div className="lg:col-span-8 space-y-6 w-full animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 select-none">
              <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-600 to-indigo-600 dark:from-emerald-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Carbon Mirror
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Lifestyle Scan: Step {step} of {totalSteps}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-300 rounded-full"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/55 border border-slate-200 dark:border-white/5 glass-card min-h-[380px] flex flex-col justify-between">
            <div>
              {/* Question 1: Commute Style */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    How do you primarily commute?
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Select the vehicle you use for daily transport.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: 'car_gas', label: 'Gasoline/Diesel Car', desc: 'Standard internal combustion' },
                      { key: 'car_hybrid', label: 'Hybrid Vehicle', desc: 'Self-charging or plug-in hybrid' },
                      { key: 'car_ev', label: 'Electric Vehicle', desc: 'Battery-electric powered' },
                      { key: 'public_transit', label: 'Public Transport', desc: 'Bus, train, subway, or tram' },
                      { key: 'bike_walk', label: 'Biking / Walking', desc: 'Zero emissions, active travel' }
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => updateAnswer('commuteStyle', opt.key as any)}
                        className={`p-4 text-left rounded-2xl border transition-all ${
                          answers.commuteStyle === opt.key
                            ? 'bg-emerald-500/10 border-emerald-400/80 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-100/50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 hover:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <div className="font-semibold text-base">{opt.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Question 2: Commute Distance */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    What is your average weekly commute distance?
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Estimate the total miles you travel in a typical week.</p>
                  <div className="space-y-4 pt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">0 Miles</span>
                      <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{answers.commuteDistance} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">miles/wk</span></span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">300+ Miles</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="300"
                      step="5"
                      value={answers.commuteDistance}
                      onChange={(e) => updateAnswer('commuteDistance', parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
                    />
                    <div className="flex gap-2 justify-center">
                      {[15, 50, 100, 200].map(m => (
                        <button
                          key={m}
                          onClick={() => updateAnswer('commuteDistance', m)}
                          className="px-3 py-1 text-xs rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200"
                        >
                          {m} mi
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Question 3: Diet Style */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    What best describes your dietary habits?
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Agricultural food supply chains represent significant emissions.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: 'meat_heavy', label: 'Meat Heavy', desc: 'Frequent red meat, beef, and pork daily' },
                      { key: 'balanced', label: 'Balanced Diet', desc: 'Mixed meats, poultry, fish, and greens' },
                      { key: 'vegetarian', label: 'Vegetarian', desc: 'No meat, includes dairy and eggs' },
                      { key: 'vegan', label: 'Vegan', desc: 'Strictly plant-based nutrition' }
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => updateAnswer('dietStyle', opt.key as any)}
                        className={`p-4 text-left rounded-2xl border transition-all ${
                          answers.dietStyle === opt.key
                            ? 'bg-emerald-500/10 border-emerald-400/80 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-100/50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 hover:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <div className="font-semibold text-base">{opt.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Question 4: Local Sourcing */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    Do you prioritize local food sourcing?
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Buying food grown locally reduces freight mileage and shipping logistics footprint.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => updateAnswer('localFood', true)}
                      className={`p-5 text-left rounded-2xl border transition-all ${
                        answers.localFood
                          ? 'bg-emerald-500/10 border-emerald-400/80 text-emerald-300'
                          : 'bg-slate-100/50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 hover:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <div className="font-bold text-base">Yes, I choose local food</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Farmers markets, regional grocery choices</div>
                    </button>
                    <button
                      onClick={() => updateAnswer('localFood', false)}
                      className={`p-5 text-left rounded-2xl border transition-all ${
                        !answers.localFood
                          ? 'bg-emerald-500/10 border-emerald-400/80 text-emerald-300'
                          : 'bg-slate-100/50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 hover:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <div className="font-bold text-base">Rarely / No</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Standard produce without origin constraints</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Question 5: Electricity Bill */}
              {step === 5 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    What is your average monthly electricity bill?
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Estimate the monthly utilities cost for home power usage.</p>
                  <div className="space-y-4 pt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">$0</span>
                      <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">${answers.electricityBill} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">/mo</span></span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">$300+</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="300"
                      step="10"
                      value={answers.electricityBill}
                      onChange={(e) => updateAnswer('electricityBill', parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
                    />
                    <div className="flex gap-2 justify-center">
                      {[40, 80, 120, 200].map(b => (
                        <button
                          key={b}
                          onClick={() => updateAnswer('electricityBill', b)}
                          className="px-3 py-1 text-xs rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200"
                        >
                          ${b}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Question 6: Green Energy */}
              {step === 6 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    Is your home powered by green energy?
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Does your provider match energy with renewable wind/solar contracts or do you have solar panels?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => updateAnswer('greenEnergy', true)}
                      className={`p-5 text-left rounded-2xl border transition-all ${
                        answers.greenEnergy
                          ? 'bg-emerald-500/10 border-emerald-400/80 text-emerald-300'
                          : 'bg-slate-100/50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 hover:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <div className="font-bold text-base">Yes, Renewable Match</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Solar contract, solar panels, green tariff</div>
                    </button>
                    <button
                      onClick={() => updateAnswer('greenEnergy', false)}
                      className={`p-5 text-left rounded-2xl border transition-all ${
                        !answers.greenEnergy
                          ? 'bg-emerald-500/10 border-emerald-400/80 text-emerald-300'
                          : 'bg-slate-100/50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 hover:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <div className="font-bold text-base">Standard Grid Grid Power</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Standard state/provincial utility mix</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Question 7: AC Usage */}
              {step === 7 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    How do you manage heating / cooling (AC)?
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Heating and cooling are heavy grid drivers.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'high', label: 'Comfort First (High)', desc: 'AC running constantly for tight temp control' },
                      { key: 'optimized', label: 'Balanced (Optimized)', desc: 'AC turned down when away, moderate temp limits' },
                      { key: 'low', label: 'Resource Conscious (Low)', desc: 'Minimal AC, fans, set near outdoor temps' }
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => updateAnswer('acUsage', opt.key as any)}
                        className={`p-4 text-left rounded-2xl border transition-all ${
                          answers.acUsage === opt.key
                            ? 'bg-emerald-500/10 border-emerald-400/80 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-100/50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 hover:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <div className="font-bold text-base">{opt.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Question 8: Online Shopping */}
              {step === 8 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    How frequently do you make online purchases?
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Packaging and delivery transport stack up manufacturing carbon footprint.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: 'daily', label: 'Daily', desc: 'Frequent e-commerce shipments' },
                      { key: 'weekly', label: 'Weekly', desc: 'Consolidated weekend or regular shopping' },
                      { key: 'monthly', label: 'Monthly', desc: 'Occasional deliveries only' },
                      { key: 'rarely', label: 'Rarely', desc: 'Buy local or second-hand items' }
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => updateAnswer('onlinePurchases', opt.key as any)}
                        className={`p-4 text-left rounded-2xl border transition-all ${
                          answers.onlinePurchases === opt.key
                            ? 'bg-emerald-500/10 border-emerald-400/80 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-100/50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 hover:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <div className="font-bold text-base">{opt.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Question 9: Delivery / Takeout */}
              {step === 9 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    How often do you order food delivery or takeout?
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Single-use plastics and last-mile courier vehicles drive up this category.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: 'daily', label: 'Daily', desc: 'Order lunch/dinner courier deliveries most days' },
                      { key: 'weekly', label: 'Weekly', desc: 'Takeout deliveries once or twice a week' },
                      { key: 'monthly', label: 'Monthly', desc: 'Occasional delivery or eat-in restaurants' },
                      { key: 'rarely', label: 'Rarely / Never', desc: 'Home prep and fresh cooking' }
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => updateAnswer('deliveryFrequency', opt.key as any)}
                        className={`p-4 text-left rounded-2xl border transition-all ${
                          answers.deliveryFrequency === opt.key
                            ? 'bg-emerald-500/10 border-emerald-400/80 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-100/50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 hover:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <div className="font-bold text-base">{opt.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Question 10: Digital Activity */}
              {step === 10 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    What describes your digital usage and streaming?
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Streaming HD video and cloud gaming draw power from network data centers.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'heavy', label: 'Heavy Streaming', desc: '6h+ daily, 4K streaming, gaming' },
                      { key: 'moderate', label: 'Balanced (Moderate)', desc: '2-5h daily, standard video, smart home' },
                      { key: 'balanced', label: 'Minimalist (Balanced)', desc: 'Under 2h daily screen time, basic checkins' }
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => updateAnswer('digitalUsage', opt.key as any)}
                        className={`p-4 text-left rounded-2xl border transition-all ${
                          answers.digitalUsage === opt.key
                            ? 'bg-emerald-500/10 border-emerald-400/80 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-100/50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 hover:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <div className="font-bold text-base">{opt.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Question 11: Waste / Recycling */}
              {step === 11 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    What describes your home recycling habits?
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Recycling and compost divert municipal waste from landfills (saving methane emissions).</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'none', label: 'Standard Bin', desc: 'Throw all waste in trash (no recycling)' },
                      { key: 'partial', label: 'Basic Sort', desc: 'Sort cans, bottles, and cardboard sometimes' },
                      { key: 'full', label: 'Zero Waste conscious', desc: 'Strict separation, clean recycling, compost' }
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => updateAnswer('wasteGeneration', opt.key as any)}
                        className={`p-4 text-left rounded-2xl border transition-all ${
                          answers.wasteGeneration === opt.key
                            ? 'bg-emerald-500/10 border-emerald-400/80 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-100/50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 hover:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <div className="font-bold text-base">{opt.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Question 12: Yearly Flights */}
              {step === 12 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    How frequently do you fly each year?
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Aviation emissions are highly concentrated footprint contributors.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: 'none', label: 'Rarely / Zero Flights', desc: 'Mostly stay local or travel via rail' },
                      { key: 'few', label: 'Few Flights (1-2 flights)', desc: 'Occasional holiday flight or regional trip' },
                      { key: 'moderate', label: 'Moderate Flights (3-5 flights)', desc: 'Regular national and international routes' },
                      { key: 'frequent', label: 'Frequent Flyer (6+ flights)', desc: 'Continuous business or global long-haul routes' }
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => updateAnswer('yearlyFlights', opt.key as any)}
                        className={`p-4 text-left rounded-2xl border transition-all ${
                          answers.yearlyFlights === opt.key
                            ? 'bg-emerald-500/10 border-emerald-400/80 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-100/50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 hover:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <div className="font-bold text-base">{opt.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-between items-center pt-8 border-t border-slate-200 dark:border-white/5 mt-8">
              <button
                onClick={prevStep}
                disabled={step === 1}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  step === 1
                    ? 'border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                    : 'border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={nextStep}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/10 hover:scale-105 active:scale-95 transition-all"
              >
                <span>{step === totalSteps ? 'Complete Lifestyle Scan' : 'Continue'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Live Footprint Panel (Right) */}
        <div className="lg:col-span-4 w-full space-y-6">
          <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 glass-card space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Live Shadow Preview</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">Estimating baseline carbon as you answer.</p>
            </div>

            <div className="py-4 border-y border-slate-200 dark:border-white/5 text-center">
              <div className="text-5xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                {liveBreakdown.total}
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                kg CO₂e / month
              </div>
            </div>

            {/* Live breakdown bars */}
            <div className="space-y-3">
              {[
                { label: 'Transport', val: liveBreakdown.transport, color: 'bg-blue-400' },
                { label: 'Food Choices', val: liveBreakdown.food, color: 'bg-emerald-400' },
                { label: 'Home Utilities', val: liveBreakdown.energy, color: 'bg-yellow-400' },
                { label: 'Goods & Retail', val: liveBreakdown.shopping + liveBreakdown.delivery, color: 'bg-indigo-400' },
                { label: 'Digital Activity', val: liveBreakdown.digital, color: 'bg-purple-400' }
              ].map(bar => {
                const pct = Math.min(100, Math.round((bar.val / (liveBreakdown.total || 1)) * 100));
                return (
                  <div key={bar.label} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-500 dark:text-slate-400">{bar.label}</span>
                      <span className="text-slate-700 dark:text-slate-200">{bar.val} kg ({pct}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden">
                      <div className={`h-full ${bar.color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-slate-100/50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2">
              <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
              <span>
                Your selections will build your permanent <strong>Carbon DNA profile</strong>.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
