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
 * Basic HTML sanitization to prevent XSS injection.
 */
export function sanitizeString(val: string): string {
  if (typeof val !== 'string') return '';
  return val
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Validates the user profile properties (name and email).
 */
export function validateProfile(profile: any): UserProfile {
  if (!profile || typeof profile !== 'object') {
    throw new Error('Invalid profile data. Must be an object.');
  }

  const name = sanitizeString(profile.name);
  const email = sanitizeString(profile.email);

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
  let commuteDistance = Number(answers.commuteDistance);
  if (isNaN(commuteDistance) || commuteDistance < 0) {
    commuteDistance = 0;
  } else if (commuteDistance > 300) {
    commuteDistance = 300;
  }

  // Validate dietStyle
  const validDiets: DietStyle[] = ['meat_heavy', 'balanced', 'vegetarian', 'vegan'];
  const dietStyle: DietStyle = validDiets.includes(answers.dietStyle)
    ? answers.dietStyle
    : 'balanced';

  // Validate localFood
  const localFood = Boolean(answers.localFood);

  // Validate electricityBill: clamp between 0 and 1000
  let electricityBill = Number(answers.electricityBill);
  if (isNaN(electricityBill) || electricityBill < 0) {
    electricityBill = 0;
  } else if (electricityBill > 1000) {
    electricityBill = 1000;
  }

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

  const name = sanitizeString(item.name);
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

  // Validate carbon: must be non-negative, clamp realistic Max
  let carbon = Number(item.carbon);
  if (isNaN(carbon) || carbon < 0) {
    throw new Error('Carbon footprint must be a positive number.');
  } else if (carbon > 1000) {
    carbon = 1000; // clamp realistic max single receipt carbon
  }

  // Validate cost: must be non-negative, clamp realistic Max
  let cost = Number(item.cost);
  if (isNaN(cost) || cost < 0) {
    cost = 0;
  } else if (cost > 10000) {
    cost = 10000;
  }

  return {
    name,
    category,
    carbon,
    cost
  };
}
