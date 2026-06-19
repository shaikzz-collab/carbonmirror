import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';

// Keep Landing, Onboarding, OnboardingResult, and Dashboard synchronous as they form the critical rendering path
import { LandingPage } from './pages/LandingPage';
import { Onboarding } from './pages/Onboarding';
import { OnboardingResult } from './pages/OnboardingResult';
import { Dashboard } from './pages/Dashboard';

// Lazy load secondary sub-pages to optimize bundle sizes
const CarbonDNAPage = React.lazy(() => import('./pages/CarbonDNAPage').then(m => ({ default: m.CarbonDNAPage })));
const CarbonReceiptPage = React.lazy(() => import('./pages/CarbonReceiptPage').then(m => ({ default: m.CarbonReceiptPage })));
const FutureTwin = React.lazy(() => import('./pages/FutureTwin').then(m => ({ default: m.FutureTwin })));
const DecisionAssistant = React.lazy(() => import('./pages/DecisionAssistant').then(m => ({ default: m.DecisionAssistant })));
const ClimateCoach = React.lazy(() => import('./pages/ClimateCoach').then(m => ({ default: m.ClimateCoach })));
const ActionPlanPage = React.lazy(() => import('./pages/ActionPlanPage').then(m => ({ default: m.ActionPlanPage })));
const ChallengeSystem = React.lazy(() => import('./pages/ChallengeSystem').then(m => ({ default: m.ChallengeSystem })));
const TrendsPage = React.lazy(() => import('./pages/TrendsPage').then(m => ({ default: m.TrendsPage })));
const CommunityHub = React.lazy(() => import('./pages/CommunityHub').then(m => ({ default: m.CommunityHub })));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

const PageSkeleton: React.FC = () => (
  <div className="space-y-8 animate-pulse font-sans w-full" aria-hidden="true">
    <div className="space-y-3">
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
    </div>
    <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
  </div>
);

import {
  LayoutDashboard,
  Compass,
  FileText,
  Clock,
  Camera,
  MessageSquare,
  ListTodo,
  Trophy,
  BarChart3,
  Users,
  Settings,
  Leaf,
  Flame,
  Sun,
  Moon,
  Menu,
  X,
  LogOut
} from 'lucide-react';

function AppContent() {
  const {
    user,
    logout,
    onboarded,
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    streak,
    carbonDNA
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // If the user lands on the app and onboarding is not complete, enforce Landing or Onboarding
  React.useEffect(() => {
    if (!user) {
      setActiveTab('landing');
      return;
    }
    if (!onboarded) {
      if (activeTab !== 'landing' && activeTab !== 'onboarding' && activeTab !== 'reveal') {
        setActiveTab('onboarding');
      }
    } else {
      if (activeTab === 'landing' || activeTab === 'onboarding') {
        setActiveTab('dashboard');
      }
    }
  }, [user, onboarded, activeTab, setActiveTab]);

  if (activeTab === 'landing') {
    return <LandingPage />;
  }

  if (activeTab === 'onboarding') {
    return <Onboarding />;
  }

  if (activeTab === 'reveal') {
    return <OnboardingResult />;
  }

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'dna', label: 'Carbon DNA', icon: Compass },
    { key: 'receipt', label: 'Carbon Receipt', icon: FileText },
    { key: 'future', label: 'Future Twin', icon: Clock },
    { key: 'decision', label: 'Decision Camera', icon: Camera },
    { key: 'coach', label: 'AI Coach', icon: MessageSquare },
    { key: 'actions', label: 'Action Plan', icon: ListTodo },
    { key: 'challenges', label: 'Challenges', icon: Trophy },
    { key: 'trends', label: 'Trends', icon: BarChart3 },
    { key: 'community', label: 'Community', icon: Users },
    { key: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className={`min-h-screen font-sans flex flex-col md:flex-row relative ${
      theme === 'dark' ? 'bg-slate-950 text-slate-800 dark:text-slate-100' : 'bg-slate-50 text-slate-800'
    } transition-colors duration-300`}>
      {/* Background drifting blobs */}
      <div className="blob-container">
        <div className="blob blob-green w-[400px] h-[400px] -top-[10%] -left-[10%] animate-drift-1" />
        <div className="blob blob-indigo w-[450px] h-[450px] -bottom-[15%] -right-[15%] animate-drift-2" />
        <div className="blob blob-cyan w-[300px] h-[300px] top-[40%] left-[30%] animate-drift-3" />
      </div>

      {/* MOBILE HEADER */}
      <header className={`md:hidden relative z-50 flex items-center justify-between px-6 py-4 border-b ${
        theme === 'dark' ? 'bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-white/5' : 'bg-white/90 border-slate-200'
      } backdrop-blur-md`}>
        <div className="flex items-center gap-2 select-none">
          <Leaf className="w-5 h-5 text-emerald-500" />
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-400 to-indigo-500 bg-clip-text text-transparent">
            Carbon Mirror
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
            <Flame className="w-4 h-4 fill-orange-400/10" />
            <span className="text-xs font-bold">{streak}d</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-1 rounded-lg ${theme === 'dark' ? 'text-slate-600 dark:text-slate-300' : 'text-slate-600'}`}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* DESKTOP SIDEBAR NAVIGATION */}
      <aside className={`hidden md:flex flex-col justify-between w-64 h-screen sticky top-0 z-40 border-r ${
        theme === 'dark' ? 'bg-white/70 dark:bg-slate-900/50 border-slate-200 dark:border-white/5' : 'bg-white/80 border-slate-200'
      } backdrop-blur-md p-6`}>
        <div className="space-y-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 select-none">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-400 to-indigo-500 p-[1.2px]">
              <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${
                theme === 'dark' ? 'bg-slate-900' : 'bg-white'
              }`}>
                <Leaf className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-emerald-400 to-indigo-500 bg-clip-text text-transparent">
              Carbon Mirror
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-l-2 border-emerald-500'
                      : theme === 'dark'
                        ? 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-800/30'
                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile segment & theme switcher */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-200 dark:border-white/5 space-y-4">
          {user && (
            <div className="bg-white/40 dark:bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-200 dark:border-white/5 rounded-2xl p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-600 dark:text-slate-300">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-bold truncate text-slate-800 dark:text-slate-700 dark:text-slate-200">{user.name}</span>
                  <span className="block text-[10px] text-slate-500 truncate">{user.email}</span>
                </div>
              </div>
              {carbonDNA && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-200 dark:border-white/5 flex items-center gap-2">
                  <span className="text-lg">{carbonDNA.avatarSymbol}</span>
                  <div className="min-w-0">
                    <span className="block text-[10px] font-bold text-slate-600 dark:text-slate-500 dark:text-slate-400 truncate">{carbonDNA.title}</span>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-1 text-orange-500 dark:text-orange-600 dark:text-orange-400 font-bold">
              <Flame className="w-4 h-4 fill-orange-400/10" />
              <span>{streak} Day Streak</span>
            </div>
            <button
              onClick={toggleTheme}
              className={`p-1.5 rounded-lg border ${
                theme === 'dark' ? 'border-slate-200 dark:border-white/5 text-yellow-400 hover:bg-slate-800' : 'border-slate-200 text-indigo-500 hover:bg-slate-100'
              }`}
              aria-label="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
          <button
            onClick={logout}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 border rounded-xl text-xs font-bold transition-all ${
              theme === 'dark'
                ? 'border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-800/40'
                : 'border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className={`md:hidden fixed inset-0 z-40 flex flex-col justify-between ${
          theme === 'dark' ? 'bg-slate-950/95 text-slate-800 dark:text-slate-100' : 'bg-slate-50/95 text-slate-800'
        } backdrop-blur-lg p-6 pt-24`}>
          <nav className="space-y-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveTab(item.key);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-base font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-l-4 border-emerald-500'
                      : theme === 'dark'
                        ? 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-800/30'
                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="pt-6 border-t border-slate-200 dark:border-slate-200 dark:border-white/5 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              {carbonDNA && (
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{carbonDNA.avatarSymbol}</span>
                  <div>
                    <span className="block text-sm font-bold">{carbonDNA.title}</span>
                    <span className="block text-[10px] text-slate-500 uppercase">My Twin ID</span>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    toggleTheme();
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2 rounded-xl border ${
                    theme === 'dark' ? 'border-slate-200 dark:border-white/5 text-yellow-400' : 'border-slate-200 text-indigo-500'
                  }`}
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2 rounded-xl border ${
                    theme === 'dark' ? 'border-slate-200 dark:border-white/5 text-red-600 dark:text-red-400' : 'border-slate-200 text-red-500'
                  }`}
                  aria-label="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT WORKSPACE */}
      <main className="flex-grow relative z-10 px-6 py-8 md:px-10 md:py-12 overflow-y-auto max-w-full">
        <ErrorBoundary fallbackMessage="Failed to load page content. Please try reloading the page.">
          <React.Suspense fallback={<PageSkeleton />}>
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'dna' && <CarbonDNAPage />}
            {activeTab === 'receipt' && <CarbonReceiptPage />}
            {activeTab === 'future' && <FutureTwin />}
            {activeTab === 'decision' && <DecisionAssistant />}
            {activeTab === 'coach' && <ClimateCoach />}
            {activeTab === 'actions' && <ActionPlanPage />}
            {activeTab === 'challenges' && <ChallengeSystem />}
            {activeTab === 'trends' && <TrendsPage />}
            {activeTab === 'community' && <CommunityHub />}
            {activeTab === 'settings' && <SettingsPage />}
          </React.Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
