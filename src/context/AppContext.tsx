import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { loadStorage, saveStorage, STORAGE_KEYS } from '@/lib/storage';
import { translate, type TranslationKey } from '@/i18n/translations';
import type {
  Theme,
  Language,
  Currency,
  Itinerary,
  ChatConversation,
  SavedBudget,
  Notification,
  TravelPreferences,
  UserProfile,
} from '@/types';

interface AppContextValue {
  // UI
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (l: Language) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  t: (key: TranslationKey) => string;

  // Favorite
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  // Comparație
  compareList: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;

  // Itinerare
  itineraries: Itinerary[];
  saveItinerary: (it: Itinerary) => void;
  updateItinerary: (it: Itinerary) => void;
  deleteItinerary: (id: string) => void;

  // Preferințe
  preferences: TravelPreferences;
  savePreferences: (p: TravelPreferences) => void;

  // Conversații AI
  conversations: ChatConversation[];
  saveConversation: (c: ChatConversation) => void;
  deleteConversation: (id: string) => void;

  // Bugete
  budgets: SavedBudget[];
  saveBudget: (b: SavedBudget) => void;
  deleteBudget: (id: string) => void;

  // Notificări
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;

  // Profil
  profile: UserProfile;
  updateProfile: (p: Partial<UserProfile>) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const defaultProfile: UserProfile = {
  name: 'Călător NextTravelAI',
  email: '',
  homeCity: 'București',
  memberSince: Date.now(),
};

const seedNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'Bine ai venit la NextTravelAI! 🎉',
    body: 'Începe prin a apăsa „Planifică vacanța cu AI" și lasă agentul să te cunoască.',
    date: Date.now() - 1000 * 60 * 30,
    read: false,
    type: 'sistem',
  },
  {
    id: 'n2',
    title: 'Ofertă: -30% la Lisabona',
    body: 'Escapadă de weekend cu reducere, valabilă limitat.',
    date: Date.now() - 1000 * 60 * 60 * 5,
    read: false,
    type: 'oferta',
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = loadStorage<Theme | null>(STORAGE_KEYS.theme, null);
    if (saved) return saved;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      return 'dark';
    return 'light';
  });
  const [language, setLanguageState] = useState<Language>(() =>
    loadStorage<Language>(STORAGE_KEYS.language, 'ro'),
  );
  const [currency, setCurrencyState] = useState<Currency>(() =>
    loadStorage<Currency>(STORAGE_KEYS.currency, 'EUR'),
  );
  const [favorites, setFavorites] = useState<string[]>(() =>
    loadStorage<string[]>(STORAGE_KEYS.favorites, []),
  );
  const [compareList, setCompareList] = useState<string[]>(() =>
    loadStorage<string[]>(STORAGE_KEYS.compare, []),
  );
  const [itineraries, setItineraries] = useState<Itinerary[]>(() =>
    loadStorage<Itinerary[]>(STORAGE_KEYS.itineraries, []),
  );
  const [preferences, setPreferences] = useState<TravelPreferences>(() =>
    loadStorage<TravelPreferences>(STORAGE_KEYS.preferences, {}),
  );
  const [conversations, setConversations] = useState<ChatConversation[]>(() =>
    loadStorage<ChatConversation[]>(STORAGE_KEYS.conversations, []),
  );
  const [budgets, setBudgets] = useState<SavedBudget[]>(() =>
    loadStorage<SavedBudget[]>(STORAGE_KEYS.budgets, []),
  );
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    loadStorage<Notification[]>(STORAGE_KEYS.notifications, seedNotifications),
  );
  const [profile, setProfile] = useState<UserProfile>(() =>
    loadStorage<UserProfile>(STORAGE_KEYS.profile, defaultProfile),
  );

  // Aplică tema pe <html> și persistă
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    saveStorage(STORAGE_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => saveStorage(STORAGE_KEYS.language, language), [language]);
  useEffect(() => saveStorage(STORAGE_KEYS.currency, currency), [currency]);
  useEffect(() => saveStorage(STORAGE_KEYS.favorites, favorites), [favorites]);
  useEffect(() => saveStorage(STORAGE_KEYS.compare, compareList), [compareList]);
  useEffect(() => saveStorage(STORAGE_KEYS.itineraries, itineraries), [itineraries]);
  useEffect(() => saveStorage(STORAGE_KEYS.conversations, conversations), [conversations]);
  useEffect(() => saveStorage(STORAGE_KEYS.budgets, budgets), [budgets]);
  useEffect(() => saveStorage(STORAGE_KEYS.notifications, notifications), [notifications]);
  useEffect(() => saveStorage(STORAGE_KEYS.profile, profile), [profile]);

  const toggleTheme = useCallback(() => setTheme((p) => (p === 'dark' ? 'light' : 'dark')), []);
  const setLanguage = useCallback((l: Language) => setLanguageState(l), []);
  const setCurrency = useCallback((c: Currency) => setCurrencyState(c), []);
  const t = useCallback((key: TranslationKey) => translate(language, key), [language]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  }, []);
  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const toggleCompare = useCallback((id: string) => {
    setCompareList((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id);
      if (prev.length >= 3) return [...prev.slice(1), id]; // max 3
      return [...prev, id];
    });
  }, []);
  const clearCompare = useCallback(() => setCompareList([]), []);

  const saveItinerary = useCallback((it: Itinerary) => {
    setItineraries((prev) => {
      if (prev.some((p) => p.id === it.id)) return prev.map((p) => (p.id === it.id ? it : p));
      return [it, ...prev];
    });
  }, []);
  const updateItinerary = useCallback((it: Itinerary) => {
    setItineraries((prev) => prev.map((p) => (p.id === it.id ? it : p)));
  }, []);
  const deleteItinerary = useCallback((id: string) => {
    setItineraries((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const savePreferences = useCallback((p: TravelPreferences) => setPreferences(p), []);

  const saveConversation = useCallback((c: ChatConversation) => {
    setConversations((prev) => {
      if (prev.some((x) => x.id === c.id)) return prev.map((x) => (x.id === c.id ? c : x));
      return [c, ...prev].slice(0, 30);
    });
  }, []);
  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const saveBudget = useCallback((b: SavedBudget) => {
    setBudgets((prev) => [b, ...prev].slice(0, 30));
  }, []);
  const deleteBudget = useCallback((id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);
  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const updateProfile = useCallback((p: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...p }));
  }, []);

  const value: AppContextValue = {
    theme,
    toggleTheme,
    language,
    setLanguage,
    currency,
    setCurrency,
    t,
    favorites,
    toggleFavorite,
    isFavorite,
    compareList,
    toggleCompare,
    clearCompare,
    itineraries,
    saveItinerary,
    updateItinerary,
    deleteItinerary,
    preferences,
    savePreferences,
    conversations,
    saveConversation,
    deleteConversation,
    budgets,
    saveBudget,
    deleteBudget,
    notifications,
    markNotificationRead,
    markAllRead,
    profile,
    updateProfile,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp trebuie folosit în interiorul <AppProvider>');
  return ctx;
}
