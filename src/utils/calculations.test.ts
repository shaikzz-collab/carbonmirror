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
  });

  describe('getDecisionScenarios', () => {
    it('should return 5 valid scenario items', () => {
      const list = getDecisionScenarios(mockAnswersStandard);
      expect(list).toHaveLength(5);
      expect(list[0].carbonSaved).toBeGreaterThan(0);
      expect(list[0].moneySaved).toBeGreaterThan(0);
    });
  });

});
