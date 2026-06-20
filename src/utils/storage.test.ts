import { describe, it, expect, vi, beforeEach } from 'vitest';

const store: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => store[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    store[key] = String(value);
  }),
  removeItem: vi.fn((key: string) => {
    delete store[key];
  }),
  clear: vi.fn(() => {
    for (const key in store) {
      delete store[key];
    }
  })
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Import after mocking localStorage
import {
  initializeStorage,
  safeStorageRead,
  safeStorageWrite,
  safeRemoveItem,
  safeClear
} from './storage';

describe('Local Storage Utilities', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
    // Reset our mock store
    for (const key in store) {
      delete store[key];
    }
  });

  describe('safeStorageWrite and safeStorageRead', () => {
    it('should write and read valid JSON items correctly', () => {
      const data = { name: 'Eco Test', score: 95 };
      safeStorageWrite('test_key', data);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test_key', JSON.stringify(data));

      const retrieved = safeStorageRead('test_key', null);
      expect(retrieved).toEqual(data);
    });

    it('should return default value when key does not exist', () => {
      const retrieved = safeStorageRead('non_existent', { fallback: true });
      expect(retrieved).toEqual({ fallback: true });
    });

    it('should return default value and handle errors if JSON.parse fails on corrupted storage', () => {
      store['corrupted_key'] = '{invalid-json';
      const retrieved = safeStorageRead('corrupted_key', 'fallback_string');
      expect(retrieved).toBe('fallback_string');
    });
  });

  describe('initializeStorage', () => {
    it('should clean and reset storage if version is mismatching (corrupted state recovery)', () => {
      store['cm_storage_version'] = 'old_version';
      store['some_data'] = 'important';

      initializeStorage();

      // Should clear storage
      expect(localStorageMock.clear).toHaveBeenCalled();
      expect(store['some_data']).toBeUndefined();
      // Should set version to current version ('1')
      expect(store['cm_storage_version']).toBe('1');
    });

    it('should keep storage intact if version matches', () => {
      store['cm_storage_version'] = '1';
      store['some_data'] = 'important';

      initializeStorage();

      expect(localStorageMock.clear).not.toHaveBeenCalled();
      expect(store['some_data']).toBe('important');
    });
  });

  describe('safeRemoveItem and safeClear', () => {
    it('should delete a key', () => {
      store['delete_me'] = 'val';
      safeRemoveItem('delete_me');
      expect(store['delete_me']).toBeUndefined();
    });

    it('should clear all keys and keep version', () => {
      store['key1'] = 'val1';
      store['key2'] = 'val2';
      safeClear();
      expect(store['key1']).toBeUndefined();
      expect(store['key2']).toBeUndefined();
      expect(store['cm_storage_version']).toBe('1');
    });
  });
});
