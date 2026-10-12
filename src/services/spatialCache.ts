/**
 * Local spatial cache using localStorage with expiration for offline speed and resilience
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function getCachedSpatialData<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`surakshit_cache_${key}`);
    if (!raw) return null;

    const entry: CacheEntry<T> = JSON.parse(raw);
    const age = Date.now() - entry.timestamp;

    if (age > entry.ttlMs) {
      localStorage.removeItem(`surakshit_cache_${key}`);
      return null;
    }

    return entry.data;
  } catch {
    return null;
  }
}

export function setCachedSpatialData<T>(key: string, data: T, ttlMs: number = DEFAULT_TTL_MS): void {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttlMs
    };
    localStorage.setItem(`surakshit_cache_${key}`, JSON.stringify(entry));
  } catch {
    // Quota exceeded or private mode
  }
}

export function clearSpatialCache(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('surakshit_cache_')) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch {
    // Ignore error in restricted contexts
  }
}
