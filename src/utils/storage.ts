const STORAGE_VERSION = '1';
const VERSION_KEY = 'cm_storage_version';

/**
 * Checks if localStorage is available and accessible in the current browser session.
 */
function isStorageAvailable(): boolean {
  try {
    const testKey = '__cm_storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

export function initializeStorage(): void {
  if (!isStorageAvailable()) return;
  try {
    const currentVersion = localStorage.getItem(VERSION_KEY);
    if (currentVersion !== STORAGE_VERSION) {
      // Clear older corrupted/incompatible schemas to avoid app runtime crashes
      localStorage.clear();
      localStorage.setItem(VERSION_KEY, STORAGE_VERSION);
    }
  } catch (err) {
    console.error('Storage version initialization failed:', err);
  }
}

/**
 * Safely fetches a value from local storage.
 */
export function safeGetItem<T>(key: string, defaultValue: T): T {
  if (!isStorageAvailable()) return defaultValue;
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (err) {
    console.warn(`Failed to retrieve/parse local storage key "${key}":`, err);
    return defaultValue;
  }
}

/**
 * Safely writes a value to local storage.
 */
export function safeSetItem<T>(key: string, value: T): void {
  if (!isStorageAvailable()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save key "${key}" to local storage:`, err);
  }
}

/**
 * Safely deletes a key from local storage.
 */
export function safeRemoveItem(key: string): void {
  if (!isStorageAvailable()) return;
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(`Failed to remove key "${key}" from local storage:`, err);
  }
}

/**
 * Safely clears all local storage items.
 */
export function safeClear(): void {
  if (!isStorageAvailable()) return;
  try {
    localStorage.clear();
    localStorage.setItem(VERSION_KEY, STORAGE_VERSION);
  } catch (err) {
    console.error('Failed to clear local storage:', err);
  }
}

/**
 * Safe local storage reader wrapper.
 */
export function safeStorageRead<T>(key: string, defaultValue: T): T {
  return safeGetItem<T>(key, defaultValue);
}

/**
 * Safe local storage writer wrapper.
 */
export function safeStorageWrite<T>(key: string, value: T): void {
  safeSetItem<T>(key, value);
}
