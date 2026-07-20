// Wrapper simplu și sigur peste localStorage.

const PREFIX = 'nexttravelai:';

export function loadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // stocare plină sau indisponibilă — ignorăm în mod silențios
  }
}

export function removeStorage(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* noop */
  }
}

export const STORAGE_KEYS = {
  theme: 'theme',
  language: 'language',
  currency: 'currency',
  favorites: 'favorites',
  savedHotels: 'savedHotels',
  itineraries: 'itineraries',
  preferences: 'preferences',
  conversations: 'conversations',
  budgets: 'budgets',
  notifications: 'notifications',
  compare: 'compare',
  profile: 'profile',
  newsletter: 'newsletter',
  user: 'user',
  activity: 'activity',
} as const;
