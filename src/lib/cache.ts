export const generateHash = (str: string): string => {
  let hash = 0;
  if (str.length === 0) return hash.toString();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
};

const CACHE_PREFIX = "garden_ai_cache_";
const EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry {
  timestamp: number;
  data: string;
}

export const SmartCache = {
  get: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    
    try {
      const item = localStorage.getItem(CACHE_PREFIX + key);
      if (!item) return null;

      const entry: CacheEntry = JSON.parse(item);
      const now = Date.now();

      if (now - entry.timestamp > EXPIRY_MS) {
        localStorage.removeItem(CACHE_PREFIX + key);
        return null;
      }
      return entry.data;
    } catch (e) {
      console.warn("Cache parsing error", e);
      return null;
    }
  },

  set: (key: string, data: string): void => {
    if (typeof window === "undefined") return;

    try {
      const entry: CacheEntry = {
        timestamp: Date.now(),
        data
      };
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
    } catch (e) {
      console.warn("Cache write error (quota exceeded?)", e);
      // Optional: Clear old entries here if needed
    }
  }
};
