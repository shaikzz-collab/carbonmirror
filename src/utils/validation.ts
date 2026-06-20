import type {
  LifestyleAnswers,
  ReceiptItem,
  UserProfile,
  CommuteStyle,
  DietStyle,
  PurchaseFrequency,
  ScreenTimeStyle,
  RecycleStyle,
  FlightFrequency
} from '../types';

/**
 * Safely sanitizes a string to prevent XSS injection.
 */
export function safeString(val: any, defaultVal = ''): string {
  if (val === null || val === undefined || typeof val !== 'string') return defaultVal;
  const str = val.trim();
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Basic HTML sanitization alias for backward compatibility.
 */
export function sanitizeString(val: string): string {
  return safeString(val);
}

/**
 * Safely parses and bounds numerical inputs.
 */
export function safeNumber(val: any, min = 0, max = Infinity, defaultVal = 0): number {
  if (val === null || val === undefined) return defaultVal;
  const num = Number(val);
  if (isNaN(num)) return defaultVal;
  return Math.max(min, Math.min(max, num));
}

/**
 * Safely normalizes user profile data, providing fallback defaults on error.
 */
export function safeProfile(profile: any): UserProfile {
  if (!profile || typeof profile !== 'object') {
    return { name: 'Eco Explorer', email: 'explorer@carbonmirror.org' };
  }
  const name = safeString(profile.name, 'Eco Explorer');
  const emailRaw = safeString(profile.email, '');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const email = emailRegex.test(emailRaw) ? emailRaw : 'explorer@carbonmirror.org';
  return { name, email };
}

/**
 * Validates the user profile properties strictly.
 */
export function validateProfile(profile: any): UserProfile {
  if (!profile || typeof profile !== 'object') {
    throw new Error('Invalid profile data. Must be an object.');
  }

  const name = safeString(profile.name);
  const email = safeString(profile.email);

  if (!name) {
    throw new Error('Name cannot be empty.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new Error('Invalid email format.');
  }

  return { name, email };
}

/**
 * Validates, cleans, and clamps lifestyle onboarding answers.
 */
export function validateLifestyleAnswers(answers: any): LifestyleAnswers {
  if (!answers || typeof answers !== 'object') {
    throw new Error('Invalid answers. Must be an object.');
  }

  // Validate commuteStyle
  const validCommutes: CommuteStyle[] = ['car_gas', 'car_hybrid', 'car_ev', 'public_transit', 'bike_walk'];
  const commuteStyle: CommuteStyle = validCommutes.includes(answers.commuteStyle)
    ? answers.commuteStyle
    : 'bike_walk';

  // Validate commuteDistance: clamp between 0 and 300, reject negative/NaN
  const commuteDistance = safeNumber(answers.commuteDistance, 0, 300, 0);

  // Validate dietStyle
  const validDiets: DietStyle[] = ['meat_heavy', 'balanced', 'vegetarian', 'vegan'];
  const dietStyle: DietStyle = validDiets.includes(answers.dietStyle)
    ? answers.dietStyle
    : 'balanced';

  // Validate localFood
  const localFood = Boolean(answers.localFood);

  // Validate electricityBill: clamp between 0 and 1000
  const electricityBill = safeNumber(answers.electricityBill, 0, 1000, 0);

  // Validate greenEnergy
  const greenEnergy = Boolean(answers.greenEnergy);

  // Validate acUsage
  const validAc: Array<'high' | 'optimized' | 'low'> = ['high', 'optimized', 'low'];
  const acUsage: 'high' | 'optimized' | 'low' = validAc.includes(answers.acUsage)
    ? answers.acUsage
    : 'optimized';

  // Validate onlinePurchases
  const validPurchases: PurchaseFrequency[] = ['daily', 'weekly', 'monthly', 'rarely'];
  const onlinePurchases: PurchaseFrequency = validPurchases.includes(answers.onlinePurchases)
    ? answers.onlinePurchases
    : 'weekly';

  // Validate deliveryFrequency
  const deliveryFrequency: PurchaseFrequency = validPurchases.includes(answers.deliveryFrequency)
    ? answers.deliveryFrequency
    : 'weekly';

  // Validate digitalUsage
  const validScreens: ScreenTimeStyle[] = ['heavy', 'moderate', 'balanced'];
  const digitalUsage: ScreenTimeStyle = validScreens.includes(answers.digitalUsage)
    ? answers.digitalUsage
    : 'moderate';

  // Validate wasteGeneration
  const validRecycle: RecycleStyle[] = ['none', 'partial', 'full'];
  const wasteGeneration: RecycleStyle = validRecycle.includes(answers.wasteGeneration)
    ? answers.wasteGeneration
    : 'partial';

  // Validate yearlyFlights
  const validFlights: FlightFrequency[] = ['none', 'few', 'moderate', 'frequent'];
  const yearlyFlights: FlightFrequency = validFlights.includes(answers.yearlyFlights)
    ? answers.yearlyFlights
    : 'few';

  return {
    commuteStyle,
    commuteDistance,
    dietStyle,
    localFood,
    electricityBill,
    greenEnergy,
    acUsage,
    onlinePurchases,
    deliveryFrequency,
    digitalUsage,
    wasteGeneration,
    yearlyFlights
  };
}

/**
 * Validates, cleans, and clamps manually logged receipt items.
 */
export function validateReceiptItem(item: any): Omit<ReceiptItem, 'id'> {
  if (!item || typeof item !== 'object') {
    throw new Error('Invalid receipt item. Must be an object.');
  }

  const name = safeString(item.name);
  if (!name) {
    throw new Error('Activity name cannot be empty.');
  }

  const validCategories: Array<ReceiptItem['category']> = [
    'transport',
    'food',
    'energy',
    'shopping',
    'delivery',
    'digital',
    'waste'
  ];
  const category = validCategories.includes(item.category) ? item.category : 'transport';

  // Validate carbon: must be non-negative, clamp realistic Max of 1000
  if (item.carbon === null || item.carbon === undefined) {
    throw new Error('Carbon footprint must be a positive number.');
  }
  const carbonNum = Number(item.carbon);
  if (isNaN(carbonNum) || carbonNum < 0) {
    throw new Error('Carbon footprint must be a positive number.');
  }
  const carbon = Math.min(1000, carbonNum);

  // Validate cost: must be non-negative, clamp realistic Max of 10000
  const cost = safeNumber(item.cost, 0, 10000, 0);

  return {
    name,
    category,
    carbon,
    cost
  };
}
