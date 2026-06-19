import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  LifestyleAnswers,
  FootprintBreakdown,
  CarbonDNA,
  Intervention,
  CarbonReceipt,
  Challenge,
  Badge,
  CoachMessage,
  ReceiptItem,
  UserProfile
} from '../types';
import {
  calculateBaseline,
  classifyCarbonDNA,
  detectHotspot,
  generateInterventions,
  selectTop3LifestyleChanges
} from '../utils/calculations';
import { initializeStorage, safeGetItem, safeSetItem, safeRemoveItem, safeClear } from '../utils/storage';
import { validateProfile, validateLifestyleAnswers, validateReceiptItem } from '../utils/validation';

interface AppContextType {
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  onboarded: boolean;
  answers: LifestyleAnswers | null;
  baselineBreakdown: FootprintBreakdown | null;
  carbonDNA: CarbonDNA | null;
  hotspot: ReturnType<typeof detectHotspot> | null;
  interventions: Intervention[];
  top3Changes: ReturnType<typeof selectTop3LifestyleChanges> | null;
  completedActions: string[];
  activeTab: string;
  dailyReceipts: CarbonReceipt[];
  challenges: Challenge[];
  badges: Badge[];
  streak: number;
  theme: 'dark' | 'light';
  chatHistory: CoachMessage[];
  setOnboardingData: (answers: LifestyleAnswers) => void;
  toggleAction: (actionId: string) => void;
  setActiveTab: (tab: string) => void;
  addReceiptItem: (item: Omit<ReceiptItem, 'id'>) => void;
  deleteReceiptItem: (id: string) => void;
  resetReceiptToday: () => void;
  toggleChallenge: (challengeId: string) => void;
  sendMessageToCoach: (text: string) => void;
  toggleTheme: () => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_LIFESTYLE: LifestyleAnswers = {
  commuteStyle: 'car_gas',
  commuteDistance: 150,
  dietStyle: 'meat_heavy',
  localFood: false,
  electricityBill: 120,
  greenEnergy: false,
  acUsage: 'high',
  onlinePurchases: 'weekly',
  deliveryFrequency: 'weekly',
  digitalUsage: 'heavy',
  wasteGeneration: 'none',
  yearlyFlights: 'few'
};

const DEFAULT_CHALLENGES: Challenge[] = [
  { id: 'ch_1', title: 'Take a shower under 5 minutes', description: 'Saves water-heating electrical load.', carbonReward: 2.5, points: 15, category: 'energy', type: 'daily', isCompleted: false },
  { id: 'ch_2', title: 'Opt for zero takeaway packaging', description: 'Use reusable coffee cups or dine-in options.', carbonReward: 1.2, points: 10, category: 'waste', type: 'daily', isCompleted: false },
  { id: 'ch_3', title: 'Walk or bike for trips under 2 miles', description: 'Replaces active car combustion cycles.', carbonReward: 3.0, points: 20, category: 'transport', type: 'daily', isCompleted: false },
  { id: 'ch_4', title: 'Maintain vegetarian days', description: 'Eat plant proteins for 3 consecutive days.', carbonReward: 15.0, points: 50, category: 'food', type: 'weekly', isCompleted: false },
  { id: 'ch_5', title: 'Unplug idle standby electronics', description: 'Cut phantom power draw in living areas.', carbonReward: 8.0, points: 40, category: 'energy', type: 'weekly', isCompleted: false },
  { id: 'ch_6', title: 'Skip online purchases for 7 days', description: 'Enforce conscious circular consumption.', carbonReward: 12.0, points: 45, category: 'shopping', type: 'weekly', isCompleted: false }
];

const DEFAULT_BADGES: Badge[] = [
  { id: 'bg_1', title: 'First Carbon Reduction', description: 'Marked your first active sustainable action plan checklist item.', unlocked: false, progress: 0, iconName: 'leaf', milestone: '1 action completed' },
  { id: 'bg_2', title: 'Conscious Consumer', description: 'Enforced the 48-hour cool-off shopping rule 3 times.', unlocked: false, progress: 33, iconName: 'shopping-bag', milestone: '3 cool-offs completed' },
  { id: 'bg_3', title: 'Transport Optimizer', description: 'Saved 100kg CO2e cumulatively through transport adjustments.', unlocked: false, progress: 0, iconName: 'car', milestone: '100kg CO2e saved' },
  { id: 'bg_4', title: 'Low Waste Champion', description: 'Sort domestic recycling perfectly and reduce landfill output.', unlocked: false, progress: 50, iconName: 'trash', milestone: '2 weeks zero waste' },
  { id: 'bg_5', title: 'Climate Defender', description: 'Completed a 7-day streak of logging daily receipts.', unlocked: false, progress: 14, iconName: 'award', milestone: '7 day streak' }
];

const INITIAL_COACH_MESSAGES: CoachMessage[] = [
  {
    id: 'msg_init',
    sender: 'coach',
    text: "Hello! I am your AI Climate Coach. I analyze your Carbon DNA and your lifestyle choices to provide supportive, practical recommendations to lower your footprint. Ask me about your hotspot, get ideas to cut costs, or brainstorm eco-goals!",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

const groupItemsIntoReceipts = (items: any[]): CarbonReceipt[] => {
  const groups: { [date: string]: ReceiptItem[] } = {};
  items.forEach(item => {
    if (!groups[item.date]) {
      groups[item.date] = [];
    }
    groups[item.date].push({
      id: item.id,
      name: item.name,
      category: item.category,
      carbon: item.carbon,
      cost: item.cost
    });
  });

  const receipts = Object.keys(groups).map(dateStr => {
    const groupItems = groups[dateStr];
    const totalCarbon = groupItems.reduce((sum, x) => sum + x.carbon, 0);
    const totalCost = groupItems.reduce((sum, x) => sum + x.cost, 0);

    let biggestItem = 'None';
    if (groupItems.length > 0) {
      const sorted = [...groupItems].sort((a, b) => b.carbon - a.carbon);
      biggestItem = sorted[0].name;
    }

    const explanation = groupItems.length > 0
      ? `Your footprint today totals ${totalCarbon.toFixed(1)} kg CO2e. The leading driver was "${biggestItem}" representing ${((groupItems.find(x => x.name === biggestItem)?.carbon || 0) / totalCarbon * 100).toFixed(0)}% of the daily total.`
      : 'All logged receipt items cleared.';

    return {
      date: dateStr,
      items: groupItems,
      totalCarbon: parseFloat(totalCarbon.toFixed(2)),
      totalCost: parseFloat(totalCost.toFixed(2)),
      biggestContributor: biggestItem,
      explanation
    };
  });

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  if (!receipts.some(r => r.date === todayStr)) {
    receipts.unshift({
      date: todayStr,
      items: [],
      totalCarbon: 0,
      totalCost: 0,
      biggestContributor: 'None',
      explanation: 'All daily items cleared. Use the log panel above to record today\'s carbon activities.'
    });
  }

  return receipts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    initializeStorage();
    const data = safeGetItem<UserProfile | null>('cm_user', null);
    if (data) {
      try {
        return validateProfile(data);
      } catch (err) {
        safeRemoveItem('cm_user');
        return null;
      }
    }
    return null;
  });

  const [onboarded, setOnboarded] = useState<boolean>(false);
  const [answers, setAnswers] = useState<LifestyleAnswers | null>(null);
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [dailyReceipts, setDailyReceipts] = useState<CarbonReceipt[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>(DEFAULT_CHALLENGES);
  const [badges, setBadges] = useState<Badge[]>(DEFAULT_BADGES);
  const [streak, setStreak] = useState<number>(1);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const data = safeGetItem<string>('cm_theme', 'dark');
    return data === 'light' ? 'light' : 'dark';
  });

  const [chatHistory, setChatHistory] = useState<CoachMessage[]>(INITIAL_COACH_MESSAGES);

  // Derived calculations
  const [baselineBreakdown, setBaselineBreakdown] = useState<FootprintBreakdown | null>(null);
  const [carbonDNA, setCarbonDNA] = useState<CarbonDNA | null>(null);
  const [hotspot, setHotspot] = useState<ReturnType<typeof detectHotspot> | null>(null);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [top3Changes, setTop3Changes] = useState<ReturnType<typeof selectTop3LifestyleChanges> | null>(null);

  // Recalculate whenever answers change
  useEffect(() => {
    if (answers) {
      const breakdown = calculateBaseline(answers);
      const dna = classifyCarbonDNA(answers, breakdown);
      const hot = detectHotspot(breakdown);
      const list = generateInterventions(answers, dna.type);
      const top3 = selectTop3LifestyleChanges(list);

      setBaselineBreakdown(breakdown);
      setCarbonDNA(dna);
      setHotspot(hot);
      setInterventions(list);
      setTop3Changes(top3);
    }
  }, [answers]);

  // Sync theme to document body
  useEffect(() => {
    safeSetItem('cm_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const fetchUserData = async () => {
    const token = safeGetItem<string | null>('cm_token', null);
    if (!token) return;

    try {
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      // 1. Validate profile
      const profRes = await fetch('/api/auth/profile', { headers });
      if (!profRes.ok) {
        logout();
        return;
      }
      const profData = await profRes.json();
      try {
        const validatedProfile = validateProfile(profData.user);
        setUser(validatedProfile);
        safeSetItem('cm_user', validatedProfile);
      } catch (err) {
        console.error('Invalid profile from API:', err);
        logout();
        return;
      }

      // 2. Fetch answers
      const answersRes = await fetch('/api/lifestyle', { headers });
      const answersData = await answersRes.json();
      if (answersData) {
        try {
          const validatedAnswers = validateLifestyleAnswers(answersData);
          setAnswers(validatedAnswers);
          setOnboarded(true);
        } catch (err) {
          console.warn('Malformed lifestyle answers loaded:', err);
          setAnswers(null);
          setOnboarded(false);
        }
      } else {
        setAnswers(null);
        setOnboarded(false);
      }

      // 3. Fetch receipts
      const receiptsRes = await fetch('/api/receipts', { headers });
      const receiptsData = await receiptsRes.json();
      if (receiptsData) {
        setDailyReceipts(groupItemsIntoReceipts(receiptsData));
      }

      // 4. Fetch actions
      const actionsRes = await fetch('/api/actions', { headers });
      const actionsData = await actionsRes.json();
      if (actionsData) {
        setCompletedActions(actionsData);
      }

      // 5. Fetch challenges
      const challengesRes = await fetch('/api/challenges', { headers });
      const challengesData = await challengesRes.json();
      if (challengesData && Array.isArray(challengesData)) {
        setChallenges(prev =>
          prev.map(ch => {
            const match = challengesData.find((d: any) => d.id === ch.id);
            return match ? { ...ch, isCompleted: match.isCompleted } : ch;
          })
        );
      }

      // 6. Fetch metadata sync
      const syncRes = await fetch('/api/user/sync', { headers });
      const syncData = await syncRes.json();
      if (syncData) {
        if (syncData.streak !== undefined) setStreak(syncData.streak);
        if (syncData.badges) setBadges(syncData.badges);
        if (syncData.chatHistory) setChatHistory(syncData.chatHistory);
      }
    } catch (err) {
      console.error('Failed to sync state from database:', err);
      logout();
    }
  };

  // Sync metadata triggers (streak, badges, chatHistory)
  useEffect(() => {
    const token = safeGetItem<string | null>('cm_token', null);
    if (user && token) {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      fetch('/api/user/sync', {
        method: 'POST',
        headers,
        body: JSON.stringify({ streak, badges, chatHistory })
      }).catch(err => console.error('Failed to sync user metadata:', err));
    }
  }, [user, streak, badges, chatHistory]);

  // Load initial data on mount
  useEffect(() => {
    const token = safeGetItem<string | null>('cm_token', null);
    if (token) {
      fetchUserData();
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to login.');
    }
    const data = await res.json();
    try {
      const validatedProfile = validateProfile(data.user);
      safeSetItem('cm_token', data.token);
      safeSetItem('cm_user', validatedProfile);
      setUser(validatedProfile);
    } catch (err) {
      throw new Error('Corrupted profile received during login.');
    }
    await fetchUserData();
    setActiveTab('dashboard');
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to register.');
    }
    const data = await res.json();
    try {
      const validatedProfile = validateProfile(data.user);
      safeSetItem('cm_token', data.token);
      safeSetItem('cm_user', validatedProfile);
      setUser(validatedProfile);
    } catch (err) {
      throw new Error('Corrupted profile received during registration.');
    }
    setAnswers(null);
    setOnboarded(false);
    setDailyReceipts(groupItemsIntoReceipts([]));
    setCompletedActions([]);
    setChallenges(DEFAULT_CHALLENGES);
    setBadges(DEFAULT_BADGES);
    setStreak(1);
    setChatHistory(INITIAL_COACH_MESSAGES);
    setActiveTab('onboarding');
  };

  const logout = () => {
    safeRemoveItem('cm_token');
    safeRemoveItem('cm_user');
    setUser(null);
    setAnswers(null);
    setOnboarded(false);
    setDailyReceipts([]);
    setCompletedActions([]);
    setChallenges(DEFAULT_CHALLENGES);
    setBadges(DEFAULT_BADGES);
    setStreak(1);
    setChatHistory(INITIAL_COACH_MESSAGES);
    setActiveTab('landing');
  };

  const setOnboardingData = async (newAnswers: LifestyleAnswers) => {
    try {
      const validatedAnswers = validateLifestyleAnswers(newAnswers);
      setAnswers(validatedAnswers);
      setOnboarded(true);
      setActiveTab('reveal');

      const token = safeGetItem<string | null>('cm_token', null);
      if (user && token) {
        await fetch('/api/lifestyle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(validatedAnswers)
        });
      }
    } catch (err: any) {
      console.error('Failed to save onboarding data:', err);
    }
  };

  const toggleAction = async (actionId: string) => {
    let nextActions = [...completedActions];
    if (completedActions.includes(actionId)) {
      nextActions = nextActions.filter(id => id !== actionId);
    } else {
      nextActions.push(actionId);
    }
    setCompletedActions(nextActions);

    if (nextActions.length > 0) {
      setBadges(prev =>
        prev.map(badge => {
          if (badge.id === 'bg_1') {
            return { ...badge, unlocked: true, progress: 100 };
          }
          return badge;
        })
      );
    }

    const token = safeGetItem<string | null>('cm_token', null);
    if (user && token) {
      await fetch('/api/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ actionIds: nextActions })
      });
    }
  };

  const addReceiptItem = async (newItem: Omit<ReceiptItem, 'id'>) => {
    try {
      const validatedItem = validateReceiptItem(newItem);
      const item: ReceiptItem = {
        ...validatedItem,
        id: `item_${Date.now()}`
      };

      const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

      const token = safeGetItem<string | null>('cm_token', null);
      if (user && token) {
        await fetch('/api/receipts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...item,
            date: todayStr
          })
        });

        const res = await fetch('/api/receipts', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setDailyReceipts(groupItemsIntoReceipts(data));
      }
    } catch (err: any) {
      console.error('Failed to add receipt item:', err);
      alert(err.message || 'Invalid receipt data.');
    }
  };

  const deleteReceiptItem = async (id: string) => {
    const token = safeGetItem<string | null>('cm_token', null);
    if (user && token) {
      await fetch(`/api/receipts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const res = await fetch('/api/receipts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setDailyReceipts(groupItemsIntoReceipts(data));
    }
  };

  const resetReceiptToday = async () => {
    const token = safeGetItem<string | null>('cm_token', null);
    if (user && token) {
      await fetch('/api/receipts', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const res = await fetch('/api/receipts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setDailyReceipts(groupItemsIntoReceipts(data));
    }
  };

  const toggleChallenge = async (challengeId: string) => {
    const target = challenges.find(ch => ch.id === challengeId);
    if (!target) return;
    const nextCompleted = !target.isCompleted;

    setChallenges(prev =>
      prev.map(x => (x.id === challengeId ? { ...x, isCompleted: nextCompleted } : x))
    );

    const token = safeGetItem<string | null>('cm_token', null);
    if (user && token) {
      await fetch('/api/challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: challengeId, isCompleted: nextCompleted })
      });
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const sendMessageToCoach = (text: string) => {
    const userMsg: CoachMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);

    setTimeout(() => {
      let reply = "";
      const lower = text.toLowerCase();
      const dnaType = carbonDNA?.type || "The Balanced Eco Explorer";
      const hotCat = hotspot?.category || "general";

      if (lower.includes('hotspot') || lower.includes('biggest') || lower.includes('emissions')) {
        reply = `Your primary carbon hotspot is ${hotCat}, driving roughly ${hotspot?.percentage}% of your carbon mirror index. For ${dnaType} profiles, this is typical. I suggest starting with our highest-impact intervention: "${interventions[0]?.name}".`;
      } else if (lower.includes('money') || lower.includes('save') || lower.includes('cost')) {
        const highestSavings = top3Changes?.highestMoneySaving;
        reply = `Being climate conscious is financially rewarding! Your highest money-saving opportunity is "${highestSavings?.name}" which can save you roughly $${highestSavings?.moneySavings} annually while slashing ${highestSavings?.carbonReduction} kg of carbon.`;
      } else if (lower.includes('easy') || lower.includes('simple') || lower.includes('difficulty')) {
        const easiest = top3Changes?.easiestChange;
        reply = `Looking for a quick win? The easiest sustainable action for you is "${easiest?.name}". It has a very low difficulty index and can be started immediately with ${easiest?.carbonReduction} kg CO2e savings annually.`;
      } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        reply = `Hello! Glad to chat. As a ${dnaType}, what carbon decisions are you facing today? Try asking about your hotspot or money-saving tips!`;
      } else {
        switch (carbonDNA?.type) {
          case 'The Commuter':
            reply = `As a Commuter, your primary leverage is transit. Replacing two drives per week with public transport or EV options cuts your overall footprint by roughly 12% and saves fuel costs.`;
            break;
          case 'The Consumer':
            reply = `As a Consumer, shipping packaging and manufactured goods manufacturing are your key footprints. Instating a 48-hour cart cooldown helps cut impulse purchases by 30%.`;
            break;
          case 'The Foodie':
            reply = `As a Foodie, agricultural emissions represent your main opportunity. Swapping beef for poultry or plant-based options 3 days a week has a massive impact.`;
            break;
          case 'The Comfort Seeker':
            reply = `As a Comfort Seeker, optimizing heating/cooling is key. Adjusting your thermostat by just 2°F yields rapid grid demand reductions and saves on electricity bills.`;
            break;
          case 'The Frequent Flyer':
            reply = `As a Frequent Flyer, long-distance aviation is your dominant hotspot. Swapping even one regional flight for rail or virtual conferences dramatically cuts your emissions.`;
            break;
          default:
            reply = `Great question! Focus on small daily habits: complete your active daily challenges like taking a shorter shower or opting for zero packaging. Small gains compound.`;
            break;
        }
      }

      const coachMsg: CoachMessage = {
        id: `msg_c_${Date.now()}`,
        sender: 'coach',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistory(prev => [...prev, coachMsg]);
    }, 800);
  };

  const resetAllData = async () => {
    const token = safeGetItem<string | null>('cm_token', null);
    if (user && token) {
      const headers = { 'Authorization': `Bearer ${token}` };
      await fetch('/api/receipts', { method: 'DELETE', headers });
      await fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ actionIds: [] })
      });
    }

    safeClear();
    setUser(null);
    setOnboarded(false);
    setAnswers(null);
    setCompletedActions([]);
    setActiveTab('landing');
    setStreak(1);
    setChallenges(DEFAULT_CHALLENGES);
    setBadges(DEFAULT_BADGES);
    setChatHistory(INITIAL_COACH_MESSAGES);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        onboarded,
        answers,
        baselineBreakdown,
        carbonDNA,
        hotspot,
        interventions,
        top3Changes,
        completedActions,
        activeTab,
        dailyReceipts,
        challenges,
        badges,
        streak,
        theme,
        chatHistory,
        setOnboardingData,
        toggleAction,
        setActiveTab,
        addReceiptItem,
        deleteReceiptItem,
        resetReceiptToday,
        toggleChallenge,
        sendMessageToCoach,
        toggleTheme,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
export { DEFAULT_LIFESTYLE };
