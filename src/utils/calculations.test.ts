import { describe, it, expect } from 'vitest';
import {
  calculateBaseline,
  classifyCarbonDNA,
  detectHotspot,
  generateInterventions,
  selectTop3LifestyleChanges,
  calculateTimeCapsule,
  simulateFuturePaths,
  getDecisionScenarios
} from './calculations';
import type { LifestyleAnswers } from '../types';
import { groupItemsIntoReceipts } from '../context/AppContext';

// Standard baseline user details for mock tests
const mockAnswersStandard: LifestyleAnswers = {
  commuteStyle: 'car_gas',
  commuteDistance: 100, // 100 miles/week
  dietStyle: 'meat_heavy',
  localFood: false,
  electricityBill: 100,
  greenEnergy: false,
  acUsage: 'high',
  onlinePurchases: 'weekly',
  deliveryFrequency: 'weekly',
  digitalUsage: 'heavy',
  wasteGeneration: 'none',
  yearlyFlights: 'few'
};

const mockAnswersEco: LifestyleAnswers = {
  commuteStyle: 'bike_walk',
  commuteDistance: 0,
  dietStyle: 'vegan',
  localFood: true,
  electricityBill: 30,
  greenEnergy: true,
  acUsage: 'low',
  onlinePurchases: 'rarely',
  deliveryFrequency: 'rarely',
  digitalUsage: 'balanced',
  wasteGeneration: 'full',
  yearlyFlights: 'none'
};

describe('Carbon Mirror Platform calculations', () => {
  
  describe('calculateBaseline', () => {
    it('should calculate standard user emissions accurately', () => {
      const breakdown = calculateBaseline(mockAnswersStandard);
      expect(breakdown.total).toBeGreaterThan(300);
      expect(breakdown.transport).toBeGreaterThan(0);
      expect(breakdown.food).toBe(280); // meat_heavy = 280
      expect(breakdown.energy).toBe(145); // electricity = 100 * 0.85 + ac = 60
    });

    it('should reflect local food discount', () => {
      const standardBreakdown = calculateBaseline(mockAnswersStandard);
      const localizedAnswers = { ...mockAnswersStandard, localFood: true };
      const localizedBreakdown = calculateBaseline(localizedAnswers);
      expect(localizedBreakdown.food).toBeLessThan(standardBreakdown.food);
    });

    it('should reduce energy emissions with green energy matching contract', () => {
      const standardBreakdown = calculateBaseline(mockAnswersStandard);
      const greenAnswers = { ...mockAnswersStandard, greenEnergy: true };
      const greenBreakdown = calculateBaseline(greenAnswers);
      expect(greenBreakdown.energy).toBeLessThan(standardBreakdown.energy);
    });

    it('should calculate minimal footprint for Eco Explorer', () => {
      const breakdown = calculateBaseline(mockAnswersEco);
      expect(breakdown.total).toBeLessThan(150);
      expect(breakdown.transport).toBe(0);
    });
  });

  describe('classifyCarbonDNA', () => {
    it('should classify high-aviation user as Frequent Flyer', () => {
      const flyerAnswers = { ...mockAnswersEco, yearlyFlights: 'frequent' as const };
      const breakdown = calculateBaseline(flyerAnswers);
      const dna = classifyCarbonDNA(flyerAnswers, breakdown);
      expect(dna.type).toBe('The Frequent Flyer');
    });

    it('should classify long-distance driver as The Commuter', () => {
      const commuterAnswers = { ...mockAnswersEco, commuteDistance: 250, commuteStyle: 'car_gas' as const };
      const breakdown = calculateBaseline(commuterAnswers);
      const dna = classifyCarbonDNA(commuterAnswers, breakdown);
      expect(dna.type).toBe('The Commuter');
    });

    it('should classify low-emissions profile as The Balanced Eco Explorer', () => {
      const breakdown = calculateBaseline(mockAnswersEco);
      const dna = classifyCarbonDNA(mockAnswersEco, breakdown);
      expect(dna.type).toBe('The Balanced Eco Explorer');
    });
  });

  describe('detectHotspot', () => {
    it('should identify food as primary hotspot for low transit / high meat profile', () => {
      const foodHotspotAnswers = { ...mockAnswersEco, dietStyle: 'meat_heavy' as const };
      const breakdown = calculateBaseline(foodHotspotAnswers);
      const hotspot = detectHotspot(breakdown);
      expect(hotspot.category).toBe('Dietary Choices');
    });
  });

  describe('selectTop3LifestyleChanges', () => {
    it('should return three distinct action cards', () => {
      const list = generateInterventions(mockAnswersStandard, 'The Commuter');
      const top3 = selectTop3LifestyleChanges(list);
      expect(top3.highestReduction).toBeDefined();
      expect(top3.highestMoneySaving).toBeDefined();
      expect(top3.easiestChange).toBeDefined();
      expect(top3.highestReduction.id).not.toBe(top3.easiestChange.id);
    });
  });

  describe('calculateTimeCapsule', () => {
    it('should calculate scale metaphors over 20 years', () => {
      const breakdown = calculateBaseline(mockAnswersStandard);
      const capsule = calculateTimeCapsule(breakdown, 20);
      expect(capsule.years).toBe(20);
      expect(capsule.co2SwimmingPools).toBeGreaterThan(0);
      expect(capsule.garbageTrucks).toBeGreaterThan(0);
      expect(capsule.forestAcres).toBeGreaterThan(0);
    });

    it('should handle zero carbon breakdown inputs without crashing or dividing by zero', () => {
      const zeroBreakdown = {
        transport: 0,
        food: 0,
        energy: 0,
        shopping: 0,
        delivery: 0,
        digital: 0,
        total: 0,
        waste: 0
      };
      const capsule = calculateTimeCapsule(zeroBreakdown, 5);
      expect(capsule.years).toBe(5);
      expect(capsule.co2SwimmingPools).toBe(0);
      expect(capsule.garbageTrucks).toBe(0);
      expect(capsule.forestAcres).toBe(0);
      expect(capsule.coalTons).toBe(0);
      expect(capsule.smartphonesCharged).toBe(0);
    });

    it('should scale compounding metrics safely for extremely large footprints', () => {
      const hugeBreakdown = {
        transport: 99999,
        food: 99999,
        energy: 99999,
        shopping: 99999,
        delivery: 99999,
        digital: 99999,
        total: 600000,
        waste: 99999
      };
      const capsule = calculateTimeCapsule(hugeBreakdown, 10);
      expect(capsule.co2SwimmingPools).toBeGreaterThan(1000);
      expect(capsule.garbageTrucks).toBeGreaterThan(100);
    });
  });

  describe('simulateFuturePaths', () => {
    it('should project three distinct trajectories over 1 year', () => {
      const breakdown = calculateBaseline(mockAnswersStandard);
      const list = generateInterventions(mockAnswersStandard, 'The Commuter');
      const paths = simulateFuturePaths(breakdown, list);
      expect(paths).toHaveLength(3);
      expect(paths[2].projections.oneYear.carbon).toBeLessThan(paths[0].projections.oneYear.carbon);
      expect(paths[2].projections.oneYear.moneySaved).toBeGreaterThan(0);
    });

    it('should handle empty interventions list by projecting zero savings while not crashing', () => {
      const breakdown = calculateBaseline(mockAnswersEco);
      const paths = simulateFuturePaths(breakdown, []);
      expect(paths).toHaveLength(3);
      // Path C should have 0 savings, matching Path A emissions
      expect(paths[2].projections.oneYear.carbon).toBe(breakdown.total * 12);
      expect(paths[2].projections.oneYear.moneySaved).toBe(0);
    });
  });

  describe('generateInterventions metadata', () => {
    it('should populate whyItMatters and expectedImpact for all generated interventions', () => {
      const list = generateInterventions(mockAnswersStandard, 'The Commuter');
      expect(list.length).toBeGreaterThan(0);
      list.forEach(intervention => {
        expect(intervention.whyItMatters).toBeDefined();
        expect(typeof intervention.whyItMatters).toBe('string');
        expect(intervention.whyItMatters!.length).toBeGreaterThan(10);

        expect(intervention.expectedImpact).toBeDefined();
        expect(typeof intervention.expectedImpact).toBe('string');
        expect(intervention.expectedImpact!.length).toBeGreaterThan(10);
      });
    });
  });

  describe('getDecisionScenarios', () => {
    it('should return 5 valid scenario items', () => {
      const list = getDecisionScenarios(mockAnswersStandard);
      expect(list).toHaveLength(5);
      expect(list[0].carbonSaved).toBeGreaterThan(0);
      expect(list[0].moneySaved).toBeGreaterThan(0);
    });
  });

  describe('groupItemsIntoReceipts', () => {
    it('should handle an empty list of receipt items by generating a single empty receipt for today', () => {
      const receipts = groupItemsIntoReceipts([]);
      expect(receipts).toHaveLength(1);
      const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      expect(receipts[0].date).toBe(todayStr);
      expect(receipts[0].items).toEqual([]);
      expect(receipts[0].totalCarbon).toBe(0);
      expect(receipts[0].totalCost).toBe(0);
      expect(receipts[0].biggestContributor).toBe('None');
      expect(receipts[0].explanation).toContain('All daily items cleared');
    });

    it('should aggregate receipt items by date and calculate totals and biggest contributor', () => {
      const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const items = [
        { id: '1', date: todayStr, name: 'Beef Burger', category: 'food', carbon: 8.5, cost: 12.0 },
        { id: '2', date: todayStr, name: 'Drive Gas Car', category: 'transport', carbon: 15.0, cost: 5.0 },
        { id: '3', date: todayStr, name: 'Salad', category: 'food', carbon: 0.5, cost: 8.0 }
      ];

      const receipts = groupItemsIntoReceipts(items);
      expect(receipts).toHaveLength(1);
      expect(receipts[0].date).toBe(todayStr);
      expect(receipts[0].items).toHaveLength(3);
      expect(receipts[0].totalCarbon).toBe(24.0); // 8.5 + 15.0 + 0.5
      expect(receipts[0].totalCost).toBe(25.0); // 12.0 + 5.0 + 8.0
      expect(receipts[0].biggestContributor).toBe('Drive Gas Car');
      expect(receipts[0].explanation).toContain('totals 24.0 kg CO2e');
      expect(receipts[0].explanation).toContain('leading driver was "Drive Gas Car" representing 63%');
    });
  });

  describe('carbon regret and inaction gap calculations', () => {
    it('should calculate regret metrics correctly from path projections', () => {
      const breakdown = {
        transport: 300,
        food: 200,
        energy: 150,
        shopping: 80,
        delivery: 40,
        digital: 20,
        waste: 30,
        total: 820
      };
      
      const interventions = [
        { id: 'int_1', name: 'EV commute', carbonReduction: 100, moneySavings: 50 },
        { id: 'int_2', name: 'Vegan diet', carbonReduction: 80, moneySavings: 30 }
      ] as any[];

      const paths = simulateFuturePaths(breakdown, interventions);
      const pathAOneYear = paths[0].projections.oneYear;
      const pathCOneYear = paths[2].projections.oneYear;

      const carbonRegret = pathAOneYear.carbon - pathCOneYear.carbon;
      const moneyRegret = pathCOneYear.moneySaved;

      // totalCarbonSavingsPossible = 180. Path C annual carbon savings = 180 * 0.85 = 153.
      expect(carbonRegret).toBe(153);
      // totalMoneySavingsPossible = 80. Path C annual money savings = 80 * 0.85 = 68.
      expect(moneyRegret).toBe(68);
    });
  });

});
