import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Leaf, Shield, Zap, Sparkles, LogIn, LogOut } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveTab, onboarded, user, login, register, logout } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering && !name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError('Please fill out all fields.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');

    try {
      if (isRegistering) {
        await register(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    }
  };

  const handleStart = () => {
    if (onboarded) {
      setActiveTab('dashboard');
    } else {
      setActiveTab('onboarding');
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden px-4 py-16 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Background drifting blobs */}
      <div className="blob-container">
        <div className="blob blob-green w-[450px] h-[450px] -top-[10%] -left-[10%] animate-drift-1" />
        <div className="blob blob-indigo w-[500px] h-[500px] -bottom-[15%] -right-[15%] animate-drift-2" />
        <div className="blob blob-cyan w-[350px] h-[350px] top-[40%] left-[30%] animate-drift-3" />
      </div>

      <div className="relative z-10 max-w-5xl w-full text-center space-y-12 animate-fade-in">
        {/* Brand identity header */}
        <header className="flex items-center justify-center gap-3 select-none">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 to-indigo-500 p-[1.5px] shadow-lg shadow-emerald-500/10">
            <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
            </div>
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-emerald-400 to-indigo-500 rounded-2xl blur opacity-30"></div>
          </div>
          <span className="font-display font-bold text-3xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            Carbon Mirror
          </span>
        </header>

        {/* Hero section */}
        <main className="space-y-6">
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.15]">
            Discover Your <span className="bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">Carbon DNA</span> <br />
            and See the Future Your Lifestyle Creates
          </h1>
          <p className="font-sans text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Carbon Mirror is a premium climate intelligence platform. We simulate a digital twin of your lifestyle to project your footprint, identify hotspots, and rank custom environmental interventions.
          </p>
          <div className="text-sm font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
            Understand. Predict. Reduce.
          </div>
        </main>

        {/* Interactive Auth/CTA Section */}
        <div className="max-w-md mx-auto relative">
          {!user ? (
            <div className="glass-card glass-card-light dark:glass-card-dark rounded-3xl p-8 text-left border shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-indigo-500/10 to-emerald-500/10 blur-xl pointer-events-none rounded-full" />
              <div className="flex items-center gap-2 mb-6">
                <LogIn className="w-5 h-5 text-emerald-500" />
                <h2 className="font-display text-xl font-bold">
                  {isRegistering ? 'Create Climate Account' : 'Climate Registry'}
                </h2>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                {isRegistering
                  ? 'Register to initialize your digital twin profile and start syncing footprints.'
                  : 'Please enter your credentials to calibrate your digital twin profile and access your simulation dashboards.'}
              </p>
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {isRegistering && (
                  <div>
                    <label htmlFor="name-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Your Name
                    </label>
                    <input
                      id="name-input"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sameer"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="email-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sameer@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="password-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Password
                  </label>
                  <input
                    id="password-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                  />
                </div>
                {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 rounded-xl font-bold text-sm hover:bg-slate-850 dark:hover:bg-slate-200 active:scale-98 transition-all shadow-lg shadow-black/10 flex items-center justify-center gap-2"
                >
                  <span>{isRegistering ? 'Register Mirror Account' : 'Authenticate Mirror'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError('');
                    setPassword('');
                    setName('');
                  }}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card glass-card-light dark:glass-card-dark rounded-3xl p-8 border shadow-2xl relative overflow-hidden space-y-6">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-emerald-500/10 to-indigo-500/10 blur-xl pointer-events-none rounded-full" />
              <div className="space-y-2 text-center">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Logged in as</span>
                <h2 className="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">{user.name}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleStart}
                  className="group relative w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-slate-950 font-bold text-base shadow-xl shadow-emerald-500/20 hover:scale-103 active:scale-97 transition-all duration-200"
                >
                  <span>{onboarded ? 'Enter Climate Portal' : 'Calibrate Lifestyle Twin'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={logout}
                  className="w-full py-2.5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800/40 rounded-xl font-bold text-sm text-slate-500 dark:text-slate-400 transition-all flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mock/Preview Carbon Snapshot Card */}
        <section className="relative max-w-2xl mx-auto rounded-3xl p-[1px] bg-gradient-to-b from-white/10 to-transparent shadow-2xl glass-card bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-white/5">
          <div className="p-6 sm:p-8 space-y-6 text-slate-800 dark:text-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Platform Snapshot</span>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              <div className="space-y-3 bg-white/70 dark:bg-slate-950/40 rounded-2xl p-4 border border-slate-200 dark:border-white/5">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Digital Twin Profile</div>
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <span>The Consumer</span>
                  <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full font-medium">🌿 Active</span>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Your carbon profile is driven by weekly online purchase delivery. Courier vehicles and manufacturing comprise your primary hotspot.
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500 dark:text-slate-400">Carbon Shadow Score</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">78 / 100</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-[78%] bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500 dark:text-slate-400">Monthly Footprint</span>
                    <span className="text-teal-600 dark:text-teal-400 font-bold">410 kg CO₂e</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-[60%] bg-teal-500 rounded-full" />
                  </div>
                </div>

                <div className="text-xs text-indigo-600 dark:text-indigo-300 flex items-center gap-1.5 font-medium">
                  <Zap className="w-3.5 h-3.5 fill-indigo-400/20 text-indigo-500 dark:text-indigo-400" />
                  <span>Ranked Intervention: "Switch utilities to green plan" saves 980kg/yr</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature benefits list */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left pt-6 max-w-4xl mx-auto">
          <div className="p-5 rounded-2xl bg-white/60 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 space-y-2">
            <Leaf className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
            <h3 className="font-display font-semibold text-base text-slate-800 dark:text-slate-200">Carbon DNA Mapping</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Identify your primary carbon personality instantly after onboarding and tailor all recommendations accordingly.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/60 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 space-y-2">
            <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-display font-semibold text-base text-slate-800 dark:text-slate-200">Intervention Engine</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Discover prioritized actions ranked by carbon reduction potential, difficulty, savings, and time commitment.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/60 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 space-y-2">
            <Shield className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            <h3 className="font-display font-semibold text-base text-slate-800 dark:text-slate-200">Future Path Simulator</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Project cumulative outcomes across 1m, 6m, and 1y under Current, Moderate, or High Sustainability pathways.
            </p>
          </div>
        </section>

        {/* Tagline footer */}
        <footer className="text-xs text-slate-400 dark:text-slate-500">
          Carbon Mirror © 2026. Made with Google DeepMind agent pair-programming assistance. All calculations are mock baseline estimations.
        </footer>
      </div>
    </div>
  );
};
