export type CommuteStyle = 'car_gas' | 'car_hybrid' | 'car_ev' | 'public_transit' | 'bike_walk';
export type DietStyle = 'meat_heavy' | 'balanced' | 'vegetarian' | 'vegan';
export type PurchaseFrequency = 'daily' | 'weekly' | 'monthly' | 'rarely';
export type ScreenTimeStyle = 'heavy' | 'moderate' | 'balanced';
export type RecycleStyle = 'none' | 'partial' | 'full';
export type FlightFrequency = 'none' | 'few' | 'moderate' | 'frequent';

export interface LifestyleAnswers {
  commuteStyle: CommuteStyle;
  commuteDistance: number; // miles per week
  dietStyle: DietStyle;
  localFood: boolean;
  electricityBill: number; // average monthly USD
  greenEnergy: boolean;
  acUsage: 'high' | 'optimized' | 'low';
  onlinePurchases: PurchaseFrequency;
  deliveryFrequency: PurchaseFrequency;
  digitalUsage: ScreenTimeStyle;
  wasteGeneration: RecycleStyle;
  yearlyFlights: FlightFrequency;
}

export type CarbonDNAType =
  | 'The Commuter'
  | 'The Consumer'
  | 'The Foodie'
  | 'The Comfort Seeker'
  | 'The Frequent Flyer'
  | 'The Digital Streamer'
  | 'The Balanced Eco Explorer';

export interface CarbonDNA {
  type: CarbonDNAType;
  title: string;
  description: string;
  contributions: {
    transport: number; // percentage
    food: number;
    energy: number;
    shopping: number;
    delivery: number;
    digital: number;
  };
  strengths: string[];
  risks: string[];
  avatarSymbol: string; // emoji or SVG key
}

export interface FootprintBreakdown {
  transport: number; // kg CO2e / month
  food: number;
  energy: number;
  shopping: number;
  delivery: number;
  digital: number;
  total: number;
  waste: number; // kg / month
}

export interface Intervention {
  id: string;
  name: string;
  category: keyof Omit<FootprintBreakdown, 'total' | 'waste'> | 'general' | 'waste';
  description: string;
  carbonReduction: number; // kg CO2e per year
  moneySavings: number; // USD per year
  difficulty: 1 | 2 | 3 | 4 | 5; // 1 = easiest, 5 = hardest
  timeCommitment: number; // hours per week saved or spent
  confidence: number; // percentage (e.g. 90)
  effortLevel: 'Low' | 'Medium' | 'High';
  timeline: string; // e.g. "Immediate", "1 Month", "6 Months"
  whyItMatters?: string;
  expectedImpact?: string;
}

export interface TimeCapsuleMetrics {
  years: number;
  co2SwimmingPools: number; // volume of CO2 gas equivalent in Olympic swimming pools
  garbageTrucks: number; // number of garbage trucks of waste
  forestAcres: number; // acres of mature forest needed for 1 year absorption
  coalTons: number; // tons of coal burned equivalent
  smartphonesCharged: number; // number of smartphones charged equivalent
}

export interface LifePath {
  pathway: 'A' | 'B' | 'C'; // A = Current, B = Moderate, C = High Sustainability
  name: string;
  description: string;
  projections: {
    oneMonth: { carbon: number; moneySaved: number; waste: number };
    sixMonths: { carbon: number; moneySaved: number; waste: number };
    oneYear: { carbon: number; moneySaved: number; waste: number };
  };
}

export interface DecisionScenario {
  id: string;
  category: 'travel' | 'food' | 'shopping' | 'energy' | 'delivery';
  title: string;
  optionA: {
    name: string;
    carbon: number; // kg CO2e
    cost: number; // USD
    time: number; // minutes
  };
  optionB: {
    name: string;
    carbon: number; // kg CO2e
    cost: number; // USD
    time: number; // minutes
  };
  recommendation: 'A' | 'B';
  reasoning: string;
  carbonSaved: number;
  moneySaved: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  carbonReward: number; // kg CO2e saved
  points: number;
  category: string;
  type: 'daily' | 'weekly';
  isCompleted: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress: number; // 0 to 100
  iconName: string;
  milestone: string;
}

export interface ReceiptItem {
  id: string;
  name: string;
  category: keyof Omit<FootprintBreakdown, 'total' | 'waste'> | 'waste';
  carbon: number; // kg CO2e
  cost: number; // USD
}

export interface CarbonReceipt {
  date: string;
  items: ReceiptItem[];
  totalCarbon: number;
  totalCost: number;
  biggestContributor: string;
  explanation: string;
}

export interface CoachMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
}

export interface UserProfile {
  name: string;
  email: string;
}
