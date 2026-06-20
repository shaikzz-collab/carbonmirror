import { describe, it, expect } from 'vitest';
import {
  sanitizeString,
  validateProfile,
  validateLifestyleAnswers,
  validateReceiptItem,
  safeNumber,
  safeString,
  safeProfile
} from './validation';

describe('Validation Utilities', () => {

  describe('sanitizeString', () => {
    it('should escape HTML tags and special characters to prevent XSS injection', () => {
      const malicious = '<script>alert("xss")</script> & safe';
      const sanitized = sanitizeString(malicious);
      expect(sanitized).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt; &amp; safe');
    });

    it('should trim whitespace from both ends', () => {
      const untrimmed = '   clean text   ';
      expect(sanitizeString(untrimmed)).toBe('clean text');
    });

    it('should return an empty string for non-string inputs', () => {
      expect(sanitizeString(null as any)).toBe('');
      expect(sanitizeString(undefined as any)).toBe('');
      expect(sanitizeString(123 as any)).toBe('');
    });
  });

  describe('validateProfile', () => {
    it('should return valid user profile information when correctly formatted', () => {
      const input = { name: 'John Doe', email: 'john@example.com' };
      const output = validateProfile(input);
      expect(output).toEqual(input);
    });

    it('should throw an error if profile is missing or is not an object', () => {
      expect(() => validateProfile(null)).toThrow('Invalid profile data. Must be an object.');
      expect(() => validateProfile('string')).toThrow('Invalid profile data. Must be an object.');
    });

    it('should throw an error if name is empty or missing', () => {
      expect(() => validateProfile({ name: '   ', email: 'john@example.com' })).toThrow('Name cannot be empty.');
      expect(() => validateProfile({ name: null, email: 'john@example.com' })).toThrow('Name cannot be empty.');
    });

    it('should throw an error on malformed email formats', () => {
      expect(() => validateProfile({ name: 'John', email: 'not-an-email' })).toThrow('Invalid email format.');
      expect(() => validateProfile({ name: 'John', email: 'john@' })).toThrow('Invalid email format.');
      expect(() => validateProfile({ name: 'John', email: '' })).toThrow('Invalid email format.');
    });

    it('should sanitize name and email', () => {
      const output = validateProfile({ name: '<b>John</b>', email: 'john@example.com' });
      expect(output.name).toBe('&lt;b&gt;John&lt;&#x2F;b&gt;');
    });
  });

  describe('validateLifestyleAnswers', () => {
    it('should validate standard answers and pass them through', () => {
      const standardInput = {
        commuteStyle: 'car_gas',
        commuteDistance: 45,
        dietStyle: 'balanced',
        localFood: true,
        electricityBill: 120,
        greenEnergy: false,
        acUsage: 'optimized',
        onlinePurchases: 'weekly',
        deliveryFrequency: 'weekly',
        digitalUsage: 'moderate',
        wasteGeneration: 'partial',
        yearlyFlights: 'few'
      };
      const output = validateLifestyleAnswers(standardInput);
      expect(output).toEqual(standardInput);
    });

    it('should throw an error if answers parameter is null or invalid object', () => {
      expect(() => validateLifestyleAnswers(null)).toThrow('Invalid answers. Must be an object.');
    });

    it('should fallback to defaults if enum styles are invalid or missing', () => {
      const malformedInput = {
        commuteStyle: 'warp_drive', // invalid
        commuteDistance: 50,
        dietStyle: 'fast_food', // invalid
        localFood: 'yes', // not a boolean but truthy
        electricityBill: 150,
        greenEnergy: false,
        acUsage: 'arctic', // invalid
        onlinePurchases: 'constantly', // invalid
        deliveryFrequency: 'hourly', // invalid
        digitalUsage: 'extreme', // invalid
        wasteGeneration: 'none',
        yearlyFlights: 'sometimes' // invalid
      };
      const output = validateLifestyleAnswers(malformedInput);
      expect(output.commuteStyle).toBe('bike_walk');
      expect(output.dietStyle).toBe('balanced');
      expect(output.localFood).toBe(true);
      expect(output.acUsage).toBe('optimized');
      expect(output.onlinePurchases).toBe('weekly');
      expect(output.deliveryFrequency).toBe('weekly');
      expect(output.digitalUsage).toBe('moderate');
      expect(output.yearlyFlights).toBe('few');
    });

    it('should clamp commuteDistance between 0 and 300', () => {
      // Clamped to 0
      const negativeDist = validateLifestyleAnswers({ commuteDistance: -50 });
      expect(negativeDist.commuteDistance).toBe(0);

      // Clamped to 300
      const hugeDist = validateLifestyleAnswers({ commuteDistance: 5000 });
      expect(hugeDist.commuteDistance).toBe(300);

      // NaN fallback to 0
      const nanDist = validateLifestyleAnswers({ commuteDistance: 'unlimited' });
      expect(nanDist.commuteDistance).toBe(0);
    });

    it('should clamp electricityBill between 0 and 1000', () => {
      // Clamped to 0
      const negativeBill = validateLifestyleAnswers({ electricityBill: -150 });
      expect(negativeBill.electricityBill).toBe(0);

      // Clamped to 1000
      const hugeBill = validateLifestyleAnswers({ electricityBill: 8000 });
      expect(hugeBill.electricityBill).toBe(1000);

      // NaN fallback to 0
      const nanBill = validateLifestyleAnswers({ electricityBill: 'expensive' });
      expect(nanBill.electricityBill).toBe(0);
    });
  });

  describe('validateReceiptItem', () => {
    it('should return valid receipt item fields', () => {
      const input = { name: 'Train Ride', category: 'transport', carbon: 15, cost: 25 };
      const output = validateReceiptItem(input);
      expect(output).toEqual(input);
    });

    it('should throw an error on invalid receipt object', () => {
      expect(() => validateReceiptItem(null)).toThrow('Invalid receipt item. Must be an object.');
    });

    it('should throw an error if activity name is empty', () => {
      expect(() => validateReceiptItem({ name: '   ', carbon: 10, cost: 10 })).toThrow('Activity name cannot be empty.');
    });

    it('should fallback to transport category for invalid category name', () => {
      const output = validateReceiptItem({ name: 'Apples', category: 'food-and-beverage', carbon: 5, cost: 10 });
      expect(output.category).toBe('transport');
    });

    it('should throw an error for negative or NaN carbon outputs', () => {
      expect(() => validateReceiptItem({ name: 'Ride', carbon: -5 })).toThrow('Carbon footprint must be a positive number.');
      expect(() => validateReceiptItem({ name: 'Ride', carbon: 'five' })).toThrow('Carbon footprint must be a positive number.');
    });

    it('should clamp excessive carbon values to 1000', () => {
      const output = validateReceiptItem({ name: 'Rocket Flight', carbon: 99999, cost: 50 });
      expect(output.carbon).toBe(1000);
    });

    it('should clamp excessive cost values to 10000 and handle negative costs by clamping to 0', () => {
      const hugeCost = validateReceiptItem({ name: 'Luxury Stay', carbon: 50, cost: 800000 });
      expect(hugeCost.cost).toBe(10000);

      const negativeCost = validateReceiptItem({ name: 'Refund', carbon: 0, cost: -100 });
      expect(negativeCost.cost).toBe(0);
    });
  });

  describe('safeNumber', () => {
    it('should fall back to default value when input is null, undefined, or NaN', () => {
      expect(safeNumber(null, 0, 100, 10)).toBe(10);
      expect(safeNumber(undefined, 0, 100, 15)).toBe(15);
      expect(safeNumber('invalid-number', 0, 100, 20)).toBe(20);
    });

    it('should clamp inputs between min and max parameters', () => {
      expect(safeNumber(-50, 0, 100, 10)).toBe(0);
      expect(safeNumber(150, 0, 100, 10)).toBe(100);
      expect(safeNumber(50, 0, 100, 10)).toBe(50);
    });
  });

  describe('safeString', () => {
    it('should return defaultVal for non-string inputs', () => {
      expect(safeString(123, 'default')).toBe('default');
      expect(safeString(null, 'default')).toBe('default');
      expect(safeString(undefined, 'default')).toBe('default');
    });

    it('should escape HTML special characters to prevent XSS', () => {
      expect(safeString('<div>&"\'/</div>')).toBe('&lt;div&gt;&amp;&quot;&#x27;&#x2F;&lt;&#x2F;div&gt;');
    });
  });

  describe('safeProfile', () => {
    it('should return default profile if input is null or not an object', () => {
      const fallback = safeProfile(null);
      expect(fallback.name).toBe('Eco Explorer');
      expect(fallback.email).toBe('explorer@carbonmirror.org');
    });

    it('should use default values for missing or malformed fields', () => {
      const partial = safeProfile({ name: 'User', email: 'bad-email' });
      expect(partial.name).toBe('User');
      expect(partial.email).toBe('explorer@carbonmirror.org');
    });

    it('should sanitize name and return safe values', () => {
      const xss = safeProfile({ name: '<script>alert(1)</script>', email: 'john@doe.com' });
      expect(xss.name).toBe('&lt;script&gt;alert(1)&lt;&#x2F;script&gt;');
      expect(xss.email).toBe('john@doe.com');
    });
  });
});
