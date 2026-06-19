import type {
  LifestyleAnswers,
  FootprintBreakdown,
  CarbonDNA,
  CarbonDNAType,
  Intervention,
  TimeCapsuleMetrics,
  LifePath,
  DecisionScenario
} from '../types';

// Carbon factors (kg CO2e)
const EMISSION_FACTORS = {
  commute: {
    car_gas: 0.404, // kg CO2e per mile
    car_hybrid: 0.19,
    car_ev: 0.08,
    public_transit: 0.06,
    bike_walk: 0
  },
  flights: {
    none: 0,
    few: 800, // kg CO2e per year (1-2 flights)
    moderate: 2200, // (3-5 flights)
    frequent: 6500 // (6+ flights)
  },
  diet: {
    meat_heavy: 280, // kg CO2e per month
    balanced: 160,
    vegetarian: 90,
    vegan: 55
  },
  electricityPerDollar: 0.85, // kg CO2e per dollar (utility average)
  greenEnergyMultiplier: 0.15, // 85% carbon savings if green
  ac: {
    high: 60, // kg CO2e per month
    optimized: 25,
    low: 5
  },
  shopping: {
    daily: 150, // kg CO2e per month
    weekly: 60,
    monthly: 20,
    rarely: 5
  },
  delivery: {
    daily: 90, // kg CO2e per month
    weekly: 35,
    monthly: 10,
    rarely: 2
  },
  digital: {
    heavy: 18, // kg CO2e per month
    moderate: 9,
    balanced: 3
  },
  wastePerKg: 0.5 // kg CO2e per kg of municipal waste
};

// Waste baseline (kg per month)
const WASTE_BASELINE = {
  recycle: {
    none: 45, // kg waste per month
    partial: 22,
    full: 6
  }
};

/**
 * Calculates baseline monthly footprint breakdown in kg CO2e
 */
export function calculateBaseline(answers: LifestyleAnswers): FootprintBreakdown {
  // Defensive fallbacks for all inputs to prevent NaN or divide-by-zero crashes
  const safeAnswers = {
    commuteStyle: answers?.commuteStyle || 'bike_walk',
    commuteDistance: Math.max(0, Math.min(300, Number(answers?.commuteDistance) || 0)),
    dietStyle: answers?.dietStyle || 'balanced',
    localFood: Boolean(answers?.localFood),
    electricityBill: Math.max(0, Math.min(1000, Number(answers?.electricityBill) || 0)),
    greenEnergy: Boolean(answers?.greenEnergy),
    acUsage: answers?.acUsage || 'optimized',
    onlinePurchases: answers?.onlinePurchases || 'weekly',
    deliveryFrequency: answers?.deliveryFrequency || 'weekly',
    digitalUsage: answers?.digitalUsage || 'moderate',
    wasteGeneration: answers?.wasteGeneration || 'partial',
    yearlyFlights: answers?.yearlyFlights || 'few'
  };

  // 1. Transport
  const commuteMilesPerMonth = safeAnswers.commuteDistance * 4.33; // average weeks per month
  const commuteEmissions = commuteMilesPerMonth * (EMISSION_FACTORS.commute[safeAnswers.commuteStyle] || 0);
  const flightEmissions = (EMISSION_FACTORS.flights[safeAnswers.yearlyFlights] || 0) / 12; // monthly share
  const transport = commuteEmissions + flightEmissions;

  // 2. Food
  let food = EMISSION_FACTORS.diet[safeAnswers.dietStyle] || 160;
  if (safeAnswers.localFood) {
    food = food * 0.9; // 10% reduction for local sourcing
  }

  // 3. Home Energy
  let energyEmissions = safeAnswers.electricityBill * EMISSION_FACTORS.electricityPerDollar;
  if (safeAnswers.greenEnergy) {
    energyEmissions = energyEmissions * EMISSION_FACTORS.greenEnergyMultiplier;
  }
  const acEmissions = EMISSION_FACTORS.ac[safeAnswers.acUsage] || 25;
  const energy = energyEmissions + acEmissions;

  // 4. Shopping
  const shopping = EMISSION_FACTORS.shopping[safeAnswers.onlinePurchases] || 60;

  // 5. Delivery
  const delivery = EMISSION_FACTORS.delivery[safeAnswers.deliveryFrequency] || 35;

  // 6. Digital
  const digital = EMISSION_FACTORS.digital[safeAnswers.digitalUsage] || 9;

  // Waste Calculation
  const monthlyWaste = WASTE_BASELINE.recycle[safeAnswers.wasteGeneration] || 22;
  const wasteEmissions = monthlyWaste * EMISSION_FACTORS.wastePerKg;

  // Combine waste emissions into shopping / food / general categories
  const total = transport + food + energy + shopping + delivery + digital + wasteEmissions;

  return {
    transport: Math.round(transport),
    food: Math.round(food),
    energy: Math.round(energy),
    shopping: Math.round(shopping),
    delivery: Math.round(delivery),
    digital: Math.round(digital),
    waste: Math.round(monthlyWaste),
    total: Math.round(total)
  };
}

/**
 * Classifies the user's Carbon DNA
 */
export function classifyCarbonDNA(answers: LifestyleAnswers, breakdown: FootprintBreakdown): CarbonDNA {
  const { transport, food, energy, shopping, delivery, digital, total } = breakdown;

  // Percentages
  const pTransport = Math.round((transport / total) * 100);
  const pFood = Math.round((food / total) * 100);
  const pEnergy = Math.round((energy / total) * 100);
  const pShopping = Math.round((shopping / total) * 100);
  const pDelivery = Math.round((delivery / total) * 100);
  const pDigital = Math.round((digital / total) * 100);

  const contributions = {
    transport: pTransport,
    food: pFood,
    energy: pEnergy,
    shopping: pShopping,
    delivery: pDelivery,
    digital: pDigital
  };

  // Thresholds to identify primary DNA
  if (total < 280) {
    return {
      type: 'The Balanced Eco Explorer',
      title: 'The Balanced Eco Explorer',
      description: 'You maintain a low carbon profile across all areas of life. Your footprint is well below the national average, showcasing conscious micro-decisions.',
      contributions,
      strengths: ['Low transit emissions', 'Plant-conscious diet', 'Excellent resource efficiency'],
      risks: ['Harder to find easy big-impact cuts', 'Marginal digital footprint creep'],
      avatarSymbol: '🌿'
    };
  }

  if (answers.yearlyFlights === 'frequent' || (transport > total * 0.4 && answers.yearlyFlights === 'moderate')) {
    return {
      type: 'The Frequent Flyer',
      title: 'The Frequent Flyer',
      description: 'Your carbon profile is dominated by aviation. High-altitude emissions from flights account for the largest single share of your climate output.',
      contributions,
      strengths: ['Likely optimized daily commute', 'Efficient local energy usage'],
      risks: ['High aviation radiative forcing', 'Heavy luxury transit impact'],
      avatarSymbol: '✈️'
    };
  }

  if (answers.commuteDistance > 120 && (answers.commuteStyle === 'car_gas' || answers.commuteStyle === 'car_hybrid')) {
    return {
      type: 'The Commuter',
      title: 'The Commuter',
      description: 'Daily single-passenger transit is your primary footprint driver. Commuting long distances by car compounds emissions rapidly over the year.',
      contributions,
      strengths: ['Consistent routine', 'High awareness of transit times'],
      risks: ['Gasoline/diesel combustion volume', 'Heavy congestion emissions'],
      avatarSymbol: '🚗'
    };
  }

  if (answers.dietStyle === 'meat_heavy' && food > total * 0.25) {
    return {
      type: 'The Foodie',
      title: 'The Foodie',
      description: 'Your food choices account for a major portion of your footprint. Agricultural supply chains, especially red meat, have high methane and land-use impacts.',
      contributions,
      strengths: ['Likely eat fresh meals', 'Supports agricultural supply chains'],
      risks: ['High dietary methane footprint', 'Deforestation and land-use impacts of meat production'],
      avatarSymbol: '🍳'
    };
  }

  if (answers.onlinePurchases === 'daily' || answers.onlinePurchases === 'weekly') {
    if (shopping + delivery > total * 0.25) {
      return {
        type: 'The Consumer',
        title: 'The Consumer',
        description: 'Frequent online shopping and packaging delivery drive your footprint. Last-mile courier emissions and manufacturing cycles stack up.',
        contributions,
        strengths: ['Digital lifestyle efficiency', 'High retail participation'],
        risks: ['Manufacturing emissions from imported products', 'Excess packaging waste and delivery vehicle emissions'],
        avatarSymbol: '🛍️'
      };
    }
  }

  if (answers.acUsage === 'high' || (answers.electricityBill > 150 && !answers.greenEnergy)) {
    return {
      type: 'The Comfort Seeker',
      title: 'The Comfort Seeker',
      description: 'Home climate control and utility consumption form the core of your footprint. Heating and air conditioning on a fossil-fueled grid creates continuous load.',
      contributions,
      strengths: ['Highly optimized home environment', 'Stable utility client profile'],
      risks: ['Fossil-fuel heavy grid electricity', 'AC refrigerant leak potential and high thermal leakage'],
      avatarSymbol: '🏠'
    };
  }

  if (answers.digitalUsage === 'heavy' && digital > total * 0.08) {
    return {
      type: 'The Digital Streamer',
      title: 'The Digital Streamer',
      description: 'Continuous screen time, cloud streaming, and smart-home connectivity drive your digital energy profile, powered invisibly by servers.',
      contributions,
      strengths: ['Low physical transport needs', 'Highly paperless lifestyle'],
      risks: ['Invisible data center cooling energy', 'Frequent device turnover and electronic waste'],
      avatarSymbol: '💻'
    };
  }

  // Fallback
  return {
    type: 'The Balanced Eco Explorer',
    title: 'The Balanced Eco Explorer',
    description: 'You maintain a balanced carbon profile without a single overwhelming source. Small improvements across several categories will yield the best results.',
    contributions,
    strengths: ['No single carbon hotspot', 'Adaptable behavior patterns'],
    risks: ['Accumulation of several minor footprint sources'],
    avatarSymbol: '🧭'
  };
}

/**
 * Detects the primary carbon hotspot
 */
export function detectHotspot(breakdown: FootprintBreakdown) {
  const { transport, food, energy, shopping, delivery, digital, total } = breakdown;
  const categories = [
    { key: 'transport', label: 'Transportation & Flights', value: transport },
    { key: 'food', label: 'Dietary Choices', value: food },
    { key: 'energy', label: 'Home Utilities & AC', value: energy },
    { key: 'shopping', label: 'Shopping & Goods', value: shopping },
    { key: 'delivery', label: 'Delivery & Takeout', value: delivery },
    { key: 'digital', label: 'Digital Activity', value: digital }
  ];

  // Sort descending
  categories.sort((a, b) => b.value - a.value);
  const main = categories[0];
  const percentage = Math.round((main.value / total) * 100);

  let explanation = '';
  let fastestFix = '';

  switch (main.key) {
    case 'transport':
      explanation = 'Aviation and fuel combustion represent high-potency greenhouse outputs. This category is your largest hotspot.';
      fastestFix = 'Replacing short flights with rail, carpooling, or working remotely twice a week.';
      break;
    case 'food':
      explanation = 'Animal agriculture releases significant methane and has intensive land requirements compared to plant proteins.';
      fastestFix = 'Swapping red meat for poultry or plant-based meals 3 days a week.';
      break;
    case 'energy':
      explanation = 'Heating, cooling, and appliances draw heavy grid loads unless offset by renewable contracts.';
      fastestFix = 'Enrolling in a local community solar program or dialing your thermostat 2°F closer to external temps.';
      break;
    case 'shopping':
      explanation = 'Manufacturing raw consumer goods emits massive process carbon, especially when shipped internationally.';
      fastestFix = 'Instituting a "48-hour cool-off" rule before clicking buy on non-essential online items.';
      break;
    case 'delivery':
      explanation = 'Last-mile logistics, single-use containers, and point-to-point courier transit add high localized emissions.';
      fastestFix = 'Batching online orders and combining takeout with local grocery trips.';
      break;
    case 'digital':
      explanation = 'Invisible data center processing and content delivery networks draw substantial background electricity.';
      fastestFix = 'Streaming in standard definition rather than 4K and shutting down standby home electronics.';
      break;
  }

  return {
    category: main.label,
    key: main.key as keyof Omit<FootprintBreakdown, 'total' | 'waste'>,
    percentage,
    description: explanation,
    action: fastestFix
  };
}

/**
 * Generates custom interventions based on user answers and DNA
 */
export function generateInterventions(answers: LifestyleAnswers, dna: CarbonDNAType): Intervention[] {
  const list: Intervention[] = [];

  // Transport
  if (answers.commuteStyle === 'car_gas') {
    list.push({
      id: 'transit_1',
      name: 'Shift two gas commutes to train/bus',
      category: 'transport',
      description: 'Replace two car trips per week with public transit, reducing direct combustion.',
      carbonReduction: 450, // kg CO2e / yr
      moneySavings: 380, // fuel & maintenance / yr
      difficulty: 3,
      timeCommitment: 2,
      confidence: 90,
      effortLevel: 'Medium',
      timeline: 'Immediate',
      whyItMatters: dna === 'The Commuter'
        ? `Since you commute ${answers.commuteDistance} miles/week in a gas car, single-occupancy driving is your primary hotspot. This shift targets your largest emission source directly.`
        : 'Public transit emissions per passenger mile are up to 80% lower than a standard gasoline car, helping clean up your transport footprint.',
      expectedImpact: 'Saves 450 kg CO2e and $380 annually by reducing fuel consumption and vehicle wear-and-tear.'
    });
    list.push({
      id: 'transit_2',
      name: 'Transition to hybrid or electric car',
      category: 'transport',
      description: 'Switching your primary vehicle to EV or hybrid drops emission rates per mile by over 50%.',
      carbonReduction: 1800,
      moneySavings: 950,
      difficulty: 5,
      timeCommitment: 0,
      confidence: 95,
      effortLevel: 'High',
      timeline: '6 Months',
      whyItMatters: dna === 'The Commuter'
        ? `Commuting ${answers.commuteDistance} miles/week in a gas vehicle makes you an ideal candidate for electrification. Switching completely eliminates tailpipe emissions.`
        : 'Replacing combustion fuel with grid electricity (especially with a green power plan) dramatically reduces travel emissions.',
      expectedImpact: 'Saves 1,800 kg CO2e and $950 in fuel/maintenance annually, transforming your primary transport footprint.'
    });
  } else if (answers.commuteStyle === 'car_hybrid' || answers.commuteStyle === 'car_ev') {
    list.push({
      id: 'transit_3',
      name: 'Start carpooling/rideshare once a week',
      category: 'transport',
      description: 'Share your drive with coworkers or neighbors to split the vehicle overhead.',
      carbonReduction: 180,
      moneySavings: 120,
      difficulty: 2,
      timeCommitment: 1,
      confidence: 85,
      effortLevel: 'Low',
      timeline: '1 Month',
      whyItMatters: dna === 'The Commuter'
        ? `Even with a hybrid or electric vehicle, carpooling splits energy/grid overhead and reduces congestion for your ${answers.commuteDistance} miles/week routine.`
        : 'Sharing commutes cuts vehicle occupancy emissions in half for the shared day, while saving on tolls and parking.',
      expectedImpact: 'Saves 180 kg CO2e and $120 annually in shared fuel or energy costs with minimal routine adjustment.'
    });
  }

  if (answers.yearlyFlights !== 'none') {
    list.push({
      id: 'flight_1',
      name: 'Swap one regional flight for high-speed rail',
      category: 'transport',
      description: 'Take the train instead of a short-haul flight. Trains emit up to 90% less CO2 per passenger mile.',
      carbonReduction: 350,
      moneySavings: 80,
      difficulty: 2,
      timeCommitment: 3,
      confidence: 90,
      effortLevel: 'Low',
      timeline: 'Immediate',
      whyItMatters: dna === 'The Frequent Flyer'
        ? 'As a Frequent Flyer, aviation is your primary carbon driver. Bypassing even one short-haul flight avoids high-altitude radiative forcing.'
        : 'High-speed rail produces up to 90% fewer emissions than flying for regional distances, while delivering you directly to city centers.',
      expectedImpact: 'Saves 350 kg CO2e and $80 per flight, bypassing heavy jet fuel consumption.'
    });
  }

  // Food
  if (answers.dietStyle === 'meat_heavy') {
    list.push({
      id: 'food_1',
      name: 'Incorporate 3 meat-free days per week',
      category: 'food',
      description: 'Replacing beef and pork with plant-based alternatives reduces methane and agricultural land impact.',
      carbonReduction: 580,
      moneySavings: 420,
      difficulty: 3,
      timeCommitment: 0,
      confidence: 92,
      effortLevel: 'Medium',
      timeline: '1 Month',
      whyItMatters: dna === 'The Foodie'
        ? 'As a Foodie with a meat-heavy diet, agricultural supply chains (especially red meat) are a major hotspot. Plant-based days target this directly.'
        : 'Replacing red meat with grains, legumes, or poultry cuts dietary carbon footprint, water usage, and agricultural runoff.',
      expectedImpact: 'Saves 580 kg CO2e and $420 annually, while lowering cholesterol and reducing food budget overhead.'
    });
  } else if (answers.dietStyle === 'balanced') {
    list.push({
      id: 'food_2',
      name: 'Go vegetarian (swap meat for plant protein)',
      category: 'food',
      description: 'Removing meat altogether cuts dietary emissions by roughly half, lowering agricultural run-off.',
      carbonReduction: 400,
      moneySavings: 300,
      difficulty: 3,
      timeCommitment: 0,
      confidence: 88,
      effortLevel: 'Medium',
      timeline: '1 Month',
      whyItMatters: dna === 'The Foodie'
        ? 'Since your food choices represent a key portion of your footprint, removing meat is the single most effective dietary change you can make.'
        : 'A vegetarian diet dramatically reduces land-use pressure, nitrogen fertilizer emissions, and animal agriculture methane.',
      expectedImpact: 'Saves 400 kg CO2e and $300 annually, significantly shrinking your household ecological footprint.'
    });
  }

  if (!answers.localFood) {
    list.push({
      id: 'food_3',
      name: 'Source 50% of groceries locally',
      category: 'food',
      description: 'Buy produce at local farmers markets or choose regional goods to lower shipping logistics emissions.',
      carbonReduction: 120,
      moneySavings: -50, // local can sometimes be slightly more expensive
      difficulty: 2,
      timeCommitment: 1.5,
      confidence: 80,
      effortLevel: 'Low',
      timeline: '1 Month',
      whyItMatters: 'You currently do not prioritize local food. Purchasing regional items cuts transportation emissions ("food miles") from the supply chain.',
      expectedImpact: 'Saves 120 kg CO2e annually, though local or organic items may cost slightly more (approx. $50/yr).'
    });
  }

  // Home Energy
  if (!answers.greenEnergy) {
    list.push({
      id: 'energy_1',
      name: 'Switch utilities to a green energy plan',
      category: 'energy',
      description: 'Contract with a supplier offering 100% wind/solar matching, cutting home electricity footprint.',
      carbonReduction: 980,
      moneySavings: 0, // usually price neutral or small surcharge
      difficulty: 1,
      timeCommitment: 0.5,
      confidence: 99,
      effortLevel: 'Low',
      timeline: 'Immediate',
      whyItMatters: dna === 'The Comfort Seeker'
        ? 'As a Comfort Seeker with grid-tied heating and cooling, switching to green power cleanses your heavy HVAC utility usage instantly.'
        : 'Transitioning to 100% wind/solar matching completely decouples your home appliances and electronics from grid fossil fuels.',
      expectedImpact: 'Saves 980 kg CO2e annually, offsetting nearly all grid-tied emissions from your utility bill.'
    });
  }

  if (answers.acUsage === 'high') {
    list.push({
      id: 'energy_2',
      name: 'Optimize thermostat setting by 2°F',
      category: 'energy',
      description: 'Set thermostat to 78°F in summer and 68°F in winter. Minimizes heating and cooling cycling.',
      carbonReduction: 240,
      moneySavings: 150,
      difficulty: 2,
      timeCommitment: 0,
      confidence: 90,
      effortLevel: 'Low',
      timeline: 'Immediate',
      whyItMatters: dna === 'The Comfort Seeker'
        ? 'Your comfort-first cooling pattern draws heavy grid loads. Adjusting by just 2°F reduces compressor workload significantly.'
        : 'Slight thermostat adjustments yield double-digit percentage drops in utility cooling and heating loads.',
      expectedImpact: 'Saves 240 kg CO2e and $150 in annual utility bills without requiring hardware upgrades.'
    });
  }

  list.push({
    id: 'energy_3',
    name: 'Upgrade to LED lights and smart power strips',
    category: 'energy',
    description: 'Replace remaining incandescent bulbs and cut phantom power loads on home gadgets.',
    carbonReduction: 110,
    moneySavings: 75,
    difficulty: 2,
    timeCommitment: 1,
    confidence: 95,
    effortLevel: 'Low',
    timeline: 'Immediate',
    whyItMatters: 'Unplugging phantom power draw and upgrading to LED lighting targets low-hanging energy waste in standard households.',
    expectedImpact: 'Saves 110 kg CO2e and $75 annually, with a payback period of just a few months.'
  });

  // Shopping & Delivery
  if (answers.onlinePurchases === 'daily' || answers.onlinePurchases === 'weekly') {
    list.push({
      id: 'shopping_1',
      name: 'Enforce a 48-hour cool-off shopping rule',
      category: 'shopping',
      description: 'Wait 48 hours before purchasing items in your online shopping cart, reducing impulse buying.',
      carbonReduction: 320,
      moneySavings: 650,
      difficulty: 2,
      timeCommitment: 0,
      confidence: 85,
      effortLevel: 'Low',
      timeline: 'Immediate',
      whyItMatters: dna === 'The Consumer'
        ? 'As a Consumer with high online purchasing habits, this rule disrupts impulse shopping, avoiding manufacturing and logistics overhead.'
        : 'Limiting discretionary shipping and manufacturing processes curbs upstream carbon and household packaging waste.',
      expectedImpact: 'Saves 320 kg CO2e and $650 annually by preventing unnecessary online purchases.'
    });
  }

  if (answers.deliveryFrequency === 'daily' || answers.deliveryFrequency === 'weekly') {
    list.push({
      id: 'delivery_1',
      name: 'Replace two weekly deliveries with cooking',
      category: 'delivery',
      description: 'Reduce couriers and single-use packaging by prepping fresh ingredients at home.',
      carbonReduction: 210,
      moneySavings: 450,
      difficulty: 3,
      timeCommitment: 2,
      confidence: 90,
      effortLevel: 'Medium',
      timeline: '1 Month',
      whyItMatters: 'Frequent takeout courier trips and disposable containers stack up. Home-cooked meals skip courier fuel and packaging waste.',
      expectedImpact: 'Saves 210 kg CO2e and $450 annually, while promoting healthier eating habits.'
    });
  }

  // Waste
  if (answers.wasteGeneration !== 'full') {
    list.push({
      id: 'waste_1',
      name: 'Implement comprehensive home recycling',
      category: 'waste',
      description: 'Ensure clean sorting of paper, plastics, glass, and metal, diverting waste from landfills.',
      carbonReduction: 160,
      moneySavings: 20,
      difficulty: 2,
      timeCommitment: 1,
      confidence: 90,
      effortLevel: 'Low',
      timeline: 'Immediate',
      whyItMatters: answers.wasteGeneration === 'none'
        ? 'You currently do not recycle. Diverting paper, glass, metals, and plastics from landfills prevents long-term methane generation.'
        : 'Improving your recycling habits from partial to full ensures clean sorting and prevents resource contamination.',
      expectedImpact: 'Saves 160 kg CO2e and $20 annually, diverting tons of recyclable materials from municipal landfills.'
    });
  }

  // Digital
  if (answers.digitalUsage === 'heavy') {
    list.push({
      id: 'digital_1',
      name: 'Switch video streaming from 4K to HD',
      category: 'digital',
      description: 'Streaming in 1080p instead of Ultra HD reduces network data demands and server farm processing.',
      carbonReduction: 60,
      moneySavings: 0,
      difficulty: 1,
      timeCommitment: 0,
      confidence: 95,
      effortLevel: 'Low',
      timeline: 'Immediate',
      whyItMatters: dna === 'The Digital Streamer'
        ? 'As a Digital Streamer, server farm processing and network infrastructure load are your primary contributors. HD streaming reduces this load by 75%.'
        : 'Reducing high-bandwidth cloud traffic lowers data center processing and cooling demands behind the screen.',
      expectedImpact: 'Saves 60 kg CO2e annually without any subscription cost modifications.'
    });
  }

  // General add if list is small
  if (list.length < 5) {
    list.push({
      id: 'gen_1',
      name: 'Wash clothes in cold water & air dry',
      category: 'energy',
      description: 'Heating water accounts for 90% of washing machine energy. Air drying saves dryer electricity.',
      carbonReduction: 190,
      moneySavings: 85,
      difficulty: 2,
      timeCommitment: 1.5,
      confidence: 90,
      effortLevel: 'Low',
      timeline: 'Immediate',
      whyItMatters: 'Over 90% of a washing machine\'s energy goes to heating water. Air drying eliminates the high heating element load of a dryer.',
      expectedImpact: 'Saves 190 kg CO2e and $85 annually, while extending the lifespan of your garments.'
    });
  }

  // Sort by carbon reduction descending
  return list.sort((a, b) => b.carbonReduction - a.carbonReduction);
}

/**
 * Extracts the specific top 3 lifestyle changes:
 * 1. Highest Carbon Reduction Opportunity
 * 2. Highest Money Saving Opportunity
 * 3. Easiest Sustainable Change
 */
export function selectTop3LifestyleChanges(interventions: Intervention[]) {
  // Sort copies for different criteria
  const byCarbon = [...interventions].sort((a, b) => b.carbonReduction - a.carbonReduction);
  const bySavings = [...interventions].sort((a, b) => b.moneySavings - a.moneySavings);
  const byDifficulty = [...interventions].sort((a, b) => a.difficulty - b.difficulty);

  const highestReduction = byCarbon[0];

  // Highest money saving (must be different from highest reduction if possible)
  let highestMoneySaving = bySavings[0];
  if (highestMoneySaving.id === highestReduction.id && bySavings.length > 1) {
    highestMoneySaving = bySavings[1];
  }

  // Easiest change (must be different from both if possible)
  let easiestChange = byDifficulty[0];
  if ((easiestChange.id === highestReduction.id || easiestChange.id === highestMoneySaving.id) && byDifficulty.length > 2) {
    // Find first one that is not already chosen
    const remaining = byDifficulty.filter(x => x.id !== highestReduction.id && x.id !== highestMoneySaving.id);
    if (remaining.length > 0) {
      easiestChange = remaining[0];
    }
  }

  return {
    highestReduction,
    highestMoneySaving,
    easiestChange
  };
}

/**
 * Calculates long-term cumulative metrics for Carbon Time Capsule
 */
export function calculateTimeCapsule(breakdown: FootprintBreakdown, years: number): TimeCapsuleMetrics {
  const totalCarbonKgCumulative = breakdown.total * 12 * years;
  const totalWasteKgCumulative = breakdown.waste * 12 * years;

  // 1 kg of CO2 gas has a volume of approx 509 liters at room temperature.
  // Olympic pool volume = 2.5 million liters (2,500,000 liters)
  // Total volume in liters = totalCarbonKgCumulative * 509
  const poolVolumeLiters = 2500000;
  const co2SwimmingPools = (totalCarbonKgCumulative * 509) / poolVolumeLiters;

  // Garbage truck holds roughly 8000 kg of municipal waste
  const garbageTrucks = totalWasteKgCumulative / 8000;

  // 1 acre of mature forest absorbs about 2.5 tons (2268 kg) of CO2 per year
  // So forest acres needed for cumulative absorption over 1 year
  const forestAcres = (totalCarbonKgCumulative / years) / 2268;

  // 1 ton of coal burned releases roughly 2860 kg of CO2
  const coalTons = totalCarbonKgCumulative / 2860;

  // Charging 1 smartphone = 0.008 kg CO2
  const smartphonesCharged = totalCarbonKgCumulative / 0.008;

  return {
    years,
    co2SwimmingPools: parseFloat(co2SwimmingPools.toFixed(1)),
    garbageTrucks: parseFloat(garbageTrucks.toFixed(2)),
    forestAcres: Math.round(forestAcres),
    coalTons: parseFloat(coalTons.toFixed(1)),
    smartphonesCharged: Math.round(smartphonesCharged)
  };
}

/**
 * Simulates three future path trajectories:
 * Path A: Current Habits
 * Path B: Moderate Improvements (adopts easiest + some reduction actions, ~25% cut)
 * Path C: High Sustainability (adopts maximum actions, ~55% cut)
 */
export function simulateFuturePaths(breakdown: FootprintBreakdown, interventions: Intervention[]): LifePath[] {
  const baseMonthlyCarbon = breakdown.total;
  const baseMonthlyWaste = breakdown.waste;

  // Calculate annual savings for B and C
  // Path B: Sum of savings from easiest + medium actions (let's say 40% of available savings)
  // Path C: Sum of savings from all actions (let's say 85% of available savings)
  const totalCarbonSavingsPossible = interventions.reduce((acc, x) => acc + x.carbonReduction, 0);
  const totalMoneySavingsPossible = interventions.reduce((acc, x) => acc + x.moneySavings, 0);

  const pathBCarbonReductionAnnual = totalCarbonSavingsPossible * 0.45;
  const pathCCarbonReductionAnnual = totalCarbonSavingsPossible * 0.85;

  const pathBMoneySavingsAnnual = totalMoneySavingsPossible * 0.45;
  const pathCMoneySavingsAnnual = totalMoneySavingsPossible * 0.85;

  const pathBWasteReductionAnnual = baseMonthlyWaste * 12 * 0.35; // 35% waste reduction
  const pathCWasteReductionAnnual = baseMonthlyWaste * 12 * 0.70; // 70% waste reduction

  // Helper to project metrics
  const createProjection = (carbonReduction: number, moneySavings: number, wasteReduction: number, factor: number) => {
    // factor is 1/12 for 1 month, 6/12 for 6 months, 1 for 1 year
    const carbonEmitted = Math.max(0, baseMonthlyCarbon * 12 * factor - carbonReduction * factor);
    const moneySaved = Math.max(0, moneySavings * factor);
    const wasteGenerated = Math.max(0, baseMonthlyWaste * 12 * factor - wasteReduction * factor);

    return {
      carbon: Math.round(carbonEmitted),
      moneySaved: Math.round(moneySaved),
      waste: Math.round(wasteGenerated)
    };
  };

  return [
    {
      pathway: 'A',
      name: 'Current Lifestyle',
      description: 'Your footprint remains unchanged. Fossil-fueled commutes, daily packaging, and standard grid power compound over time.',
      projections: {
        oneMonth: createProjection(0, 0, 0, 1/12),
        sixMonths: createProjection(0, 0, 0, 6/12),
        oneYear: createProjection(0, 0, 0, 1)
      }
    },
    {
      pathway: 'B',
      name: 'Moderate Improvements',
      description: 'You adopt low-effort interventions like adjusting your thermostat, washing in cold water, and meatless Mondays.',
      projections: {
        oneMonth: createProjection(pathBCarbonReductionAnnual, pathBMoneySavingsAnnual, pathBWasteReductionAnnual, 1/12),
        sixMonths: createProjection(pathBCarbonReductionAnnual, pathBMoneySavingsAnnual, pathBWasteReductionAnnual, 6/12),
        oneYear: createProjection(pathBCarbonReductionAnnual, pathBMoneySavingsAnnual, pathBWasteReductionAnnual, 1)
      }
    },
    {
      pathway: 'C',
      name: 'High Sustainability',
      description: 'You commit to high-impact interventions: transition to solar energy, ride transit, local dining, and zero-waste habits.',
      projections: {
        oneMonth: createProjection(pathCCarbonReductionAnnual, pathCMoneySavingsAnnual, pathCWasteReductionAnnual, 1/12),
        sixMonths: createProjection(pathCCarbonReductionAnnual, pathCMoneySavingsAnnual, pathCWasteReductionAnnual, 6/12),
        oneYear: createProjection(pathCCarbonReductionAnnual, pathCMoneySavingsAnnual, pathCWasteReductionAnnual, 1)
      }
    }
  ];
}

/**
 * Returns Decision Camera comparative choices adjusted by profile
 */
export function getDecisionScenarios(_answers: LifestyleAnswers): DecisionScenario[] {
  return [
    {
      id: 'dec_1',
      category: 'travel',
      title: 'Regional Business Trip (300 miles)',
      optionA: {
        name: 'Short-Haul Commercial Flight',
        carbon: 110,
        cost: 180,
        time: 140 // airport wait + fly
      },
      optionB: {
        name: 'High-Speed Electric Rail',
        carbon: 12,
        cost: 75,
        time: 180
      },
      recommendation: 'B',
      reasoning: 'Electric trains operate at a fraction of jet fuel burn rates, save money on last-minute booking, and offer workspace time.',
      carbonSaved: 98,
      moneySaved: 105
    },
    {
      id: 'dec_2',
      category: 'food',
      title: 'Catering Team Dinner (10 People)',
      optionA: {
        name: 'Prime Beef Burgers & Steaks',
        carbon: 85,
        cost: 150,
        time: 40
      },
      optionB: {
        name: 'Gourmet Vegetarian Buffet',
        carbon: 18,
        cost: 110,
        time: 45
      },
      recommendation: 'B',
      reasoning: 'Replacing cattle products with legumes and grains avoids methane emission. Save $40 and reduce land pressure.',
      carbonSaved: 67,
      moneySaved: 40
    },
    {
      id: 'dec_3',
      category: 'shopping',
      title: 'Buying Winter Outerwear',
      optionA: {
        name: 'Fast Fashion Online Outlet (Next-day Air)',
        carbon: 28,
        cost: 65,
        time: 15
      },
      optionB: {
        name: 'Local Consignment / Circular Thrift Shop',
        carbon: 2.5,
        cost: 35,
        time: 60
      },
      recommendation: 'B',
      reasoning: 'Extending apparel lifecycles through local resale avoids manufacturing carbon debt and express shipping fuel.',
      carbonSaved: 25.5,
      moneySaved: 30
    },
    {
      id: 'dec_4',
      category: 'energy',
      title: 'Summer Climate Management',
      optionA: {
        name: 'Keep AC Constant at 70°F All Day',
        carbon: 8.5,
        cost: 5.2,
        time: 0
      },
      optionB: {
        name: 'Program Thermostat to 78°F + Ceiling Fan',
        carbon: 3.1,
        cost: 1.9,
        time: 2
      },
      recommendation: 'B',
      reasoning: 'Using fans creates draft cooling with 90% lower wattage than AC compressors, reducing stress on grid peak hours.',
      carbonSaved: 5.4,
      moneySaved: 3.3
    },
    {
      id: 'dec_5',
      category: 'delivery',
      title: 'Friday Night Meal Selection',
      optionA: {
        name: 'App Delivery (Single-serving Scooter)',
        carbon: 4.8,
        cost: 28,
        time: 35
      },
      optionB: {
        name: 'Cook Fresh Ingredients at Home',
        carbon: 0.9,
        cost: 10,
        time: 30
      },
      recommendation: 'B',
      reasoning: 'Cooking eliminates delivery driver fuel, commercial kitchen overhead, and plastic food box landfill waste.',
      carbonSaved: 3.9,
      moneySaved: 18
    }
  ];
}
