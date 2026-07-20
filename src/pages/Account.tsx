import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Settings,
  Map,
  Heart,
  MessageSquare,
  Wallet,
  Bell,
  Check,
  Trash2,
  Sparkles,
  LogIn,
  LogOut,
  BedDouble,
  Activity as ActivityIcon,
  KeyRound,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { ApiKeyForm } from '@/components/settings/ApiKeyForm';
import { formatDateTime } from '@/lib/auth';
import { destinations } from '@/data/destinations';
import { hotels } from '@/data/hotels';
import { cheapestRoomPrice } from '@/lib/hotelsService';
import { itineraryTotalCost } from '@/lib/itinerary';
import { formatMoney } from '@/lib/format';
import { tripTypeLabels } from '@/data/content';

type Tab = 'profil' | 'agent-ai' | 'activitate' | 'preferinte' | 'itinerare' | 'favorite' | 'hoteluri' | 'conversatii' | 'bugete' | 'notificari';

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
  { id: 'profil', label: 'Profil', icon: User },
  { id: 'agent-ai', label: 'Agent AI (cheie API)', icon: KeyRound },
  { id: 'activitate', label: 'Activitate recentă', icon: ActivityIcon },
  { id: 'preferinte', label: 'Preferințe', icon: Settings },
  { id: 'itinerare', label: 'Itinerarele mele', icon: Map },
  { id: 'favorite', label: 'Favorite', icon: Heart },
  { id: 'hoteluri', label: 'Hoteluri salvate', icon: BedDouble },
  { id: 'conversatii', label: 'Conversații AI', icon: MessageSquare },
  { id: 'bugete', label: 'Bugete', icon: Wallet },
  { id: 'notificari', label: 'Notificări', icon: Bell },
];

export function Account() {
  const app = useApp();
  const [tab, setTab] = useState<Tab>('profil');
  const unread = app.notifications.filter((n) => !n.read).length;

  return (
    <div className="container-page py-10">
      <div className="mb-8 flex items-center gap-4">
        <span className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-turquoise-400 to-navy-700 text-2xl font-bold text-white">
          {app.user?.picture ? (
            <img src={app.user.picture} alt={app.user.name} className="h-full w-full object-cover" />
          ) : (
            (app.user?.name ?? app.profile.name).charAt(0).toUpperCase()
          )}
        </span>
        <div>
          <h1 className="text-2xl font-bold">{app.user?.name ?? app.profile.name}</h1>
          <p className="text-sm text-navy-500 dark:text-sand-200/70">
            {app.user
              ? app.user.email || (app.user.provider === 'google' ? 'Cont Google' : 'Cont demo')
              : `Membru din ${new Date(app.profile.memberSince).toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' })}`}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Sidebar tabs */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <nav className="flex gap-2 overflow-x-auto pb-2 no-scrollbar lg:flex-col lg:overflow-visible">
            {tabs.map((tItem) => (
              <button
                key={tItem.id}
                onClick={() => setTab(tItem.id)}
                className={`flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  tab === tItem.id
                    ? 'bg-turquoise-500 text-navy-950'
                    : 'text-navy-600 hover:bg-navy-100 dark:text-sand-200 dark:hover:bg-navy-800'
                }`}
              >
                <tItem.icon size={17} /> {tItem.label}
                {tItem.id === 'notificari' && unread > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-xs text-white">
                    {unread}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div>
          {tab === 'profil' && <ProfileTab />}
          {tab === 'agent-ai' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Agentul AI</h2>
                <p className="text-sm text-navy-500 dark:text-sand-200/70">
                  Conectează cheia ta Claude ca agentul să te înțeleagă și să vorbească liber cu tine.
                </p>
              </div>
              <ApiKeyForm />
            </div>
          )}
          {tab === 'activitate' && <ActivityTab />}
          {tab === 'preferinte' && <PreferencesTab />}
          {tab === 'itinerare' && <ItinerariesTab />}
          {tab === 'favorite' && <FavoritesTab />}
          {tab === 'hoteluri' && <SavedHotelsTab />}
          {tab === 'conversatii' && <ConversationsTab />}
          {tab === 'bugete' && <BudgetsTab />}
          {tab === 'notificari' && <NotificationsTab />}
        </div>
      </div>
    </div>
  );
}

function ProfileTab() {
  const { profile, updateProfile, theme, toggleTheme, language, setLanguage, currency, setCurrency, user, signOut } = useApp();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState(profile);
  const [authOpen, setAuthOpen] = useState(false);

  const save = () => {
    updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Autentificare */}
      <div className="card-surface flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-turquoise-50 text-turquoise-600 dark:bg-navy-800">
            <LogIn size={20} />
          </span>
          <div>
            <p className="font-semibold">{user ? 'Ești conectat' : 'Nu ești conectat'}</p>
            <p className="text-sm text-navy-500 dark:text-sand-200/70">
              {user
                ? `${user.name}${user.email ? ` · ${user.email}` : ''}`
                : 'Conectează-te prin Google sau email ca să îți salvezi datele.'}
            </p>
          </div>
        </div>
        {user ? (
          <button onClick={signOut} className="btn-outline px-4 py-2.5 text-sm text-red-500">
            <LogOut size={16} /> Deconectează-te
          </button>
        ) : (
          <button onClick={() => setAuthOpen(true)} className="btn-primary px-4 py-2.5 text-sm">
            <LogIn size={16} /> Conectează-te
          </button>
        )}
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </div>

      <div className="card-surface p-6">
        <h2 className="mb-4 text-lg font-semibold">Detalii profil</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-medium">Nume</span>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Email</span>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="email@exemplu.ro" />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Oraș de plecare</span>
            <input value={form.homeCity} onChange={(e) => setForm({ ...form, homeCity: e.target.value })} className="input-field" />
          </label>
        </div>
        <button onClick={save} className="btn-primary mt-4 px-5 py-2.5 text-sm">
          {saved ? (<><Check size={16} /> Salvat!</>) : 'Salvează modificările'}
        </button>
      </div>

      <div className="card-surface p-6">
        <h2 className="mb-4 text-lg font-semibold">Setări aplicație</h2>
        <div className="space-y-4">
          <SettingRow label="Temă">
            <button onClick={toggleTheme} className="btn-outline px-4 py-2 text-sm">
              {theme === 'dark' ? '🌙 Întunecată' : '☀️ Luminoasă'}
            </button>
          </SettingRow>
          <SettingRow label="Limbă">
            <div className="flex gap-2">
              {(['ro', 'en', 'ru'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`chip text-sm ${language === l ? 'bg-turquoise-500 text-navy-950' : 'bg-navy-50 dark:bg-navy-800'}`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </SettingRow>
          <SettingRow label="Monedă">
            <select value={currency} onChange={(e) => setCurrency(e.target.value as never)} className="input-field w-auto py-2">
              <option value="EUR">EUR €</option>
              <option value="RON">RON lei</option>
              <option value="USD">USD $</option>
              <option value="GBP">GBP £</option>
            </select>
          </SettingRow>
        </div>
      </div>

      <div className="card-surface flex items-center gap-4 border-dashed p-6">
        <LogIn size={22} className="text-navy-400" />
        <div className="flex-1">
          <p className="font-medium">Cont în cloud (în curând)</p>
          <p className="text-sm text-navy-500 dark:text-sand-200/70">
            Momentan totul se salvează local, pe dispozitivul tău. Sincronizarea în cloud va veni în curând.
          </p>
        </div>
      </div>
    </div>
  );
}

const ACTIVITY_META: Record<string, { icon: typeof Heart; color: string }> = {
  auth: { icon: LogIn, color: 'text-navy-500' },
  favorite: { icon: Heart, color: 'text-red-500' },
  unfavorite: { icon: Heart, color: 'text-navy-400' },
  itinerar: { icon: Map, color: 'text-turquoise-600' },
  chat: { icon: MessageSquare, color: 'text-turquoise-600' },
  buget: { icon: Wallet, color: 'text-gold-500' },
  hotel: { icon: BedDouble, color: 'text-turquoise-600' },
  search: { icon: Sparkles, color: 'text-navy-500' },
};

function ActivityTab() {
  const { activity, clearActivity } = useApp();

  if (!activity.length)
    return (
      <EmptyState
        icon={<ActivityIcon size={44} />}
        title="Nicio activitate încă"
        text="Aici apar acțiunile tale recente (favorite, itinerare, conversații cu AI, bugete) — cu ziua și ora."
      />
    );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Activitate recentă</h2>
        <button onClick={clearActivity} className="flex items-center gap-1 text-sm text-red-500">
          <Trash2 size={14} /> Golește istoricul
        </button>
      </div>
      <ol className="relative space-y-3 border-l border-navy-100 pl-5 dark:border-navy-800">
        {activity.map((a) => {
          const meta = ACTIVITY_META[a.type] ?? ACTIVITY_META.search;
          const Icon = meta.icon;
          return (
            <li key={a.id} className="relative">
              <span className="absolute -left-[27px] grid h-6 w-6 place-items-center rounded-full bg-white shadow-soft dark:bg-navy-900">
                <Icon size={13} className={meta.color} />
              </span>
              <div className="card-surface p-3">
                <p className="text-sm">{a.text}</p>
                <p className="mt-0.5 text-xs text-navy-400">{formatDateTime(a.date)}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function PreferencesTab() {
  const { preferences } = useApp();
  const entries = Object.entries(preferences).filter(([, v]) => v !== undefined && v !== '');

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={<Settings size={44} />}
        title="Nicio preferință salvată"
        text="Completează chestionarul AI ca să îți reținem preferințele de călătorie."
        cta={{ to: '/planifica', label: 'Completează chestionarul' }}
      />
    );
  }

  const labelMap: Record<string, string> = {
    origin: 'Oraș de plecare',
    destinationWish: 'Destinație dorită',
    period: 'Perioadă',
    days: 'Zile',
    people: 'Persoane',
    budget: 'Buget (€)',
    tripTypes: 'Tipuri de vacanță',
    climate: 'Climă',
    transport: 'Transport',
    accommodation: 'Cazare',
    stars: 'Stele',
    pace: 'Ritm',
    activities: 'Activități',
  };

  const fmt = (v: unknown): string => {
    if (Array.isArray(v)) return v.map((x) => tripTypeLabels[x as string] ?? x).join(', ');
    return String(v);
  };

  return (
    <div className="card-surface p-6">
      <h2 className="mb-4 text-lg font-semibold">Preferințele tale de călătorie</h2>
      <dl className="grid gap-3 sm:grid-cols-2">
        {entries.map(([k, v]) => (
          <div key={k} className="rounded-xl border border-navy-100 p-3 dark:border-navy-800">
            <dt className="text-xs text-navy-400">{labelMap[k] ?? k}</dt>
            <dd className="mt-0.5 font-medium">{fmt(v)}</dd>
          </div>
        ))}
      </dl>
      <Link to="/planifica" className="btn-outline mt-4 inline-flex px-5 py-2.5 text-sm">
        <Sparkles size={15} /> Actualizează preferințele
      </Link>
    </div>
  );
}

function ItinerariesTab() {
  const { itineraries, currency, deleteItinerary } = useApp();
  if (!itineraries.length)
    return (
      <EmptyState
        icon={<Map size={44} />}
        title="Niciun itinerar salvat"
        text="Creează un itinerar dintr-o destinație și îl regăsești aici."
        cta={{ to: '/orase', label: 'Descoperă destinații' }}
      />
    );
  return (
    <div className="space-y-3">
      {itineraries.map((it) => (
        <div key={it.id} className="card-surface flex items-center gap-4 p-4">
          <img src={it.image} alt={it.destinationName} className="h-16 w-16 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{it.destinationName}</p>
            <p className="text-sm text-navy-500 dark:text-sand-200/70">
              {it.totalDays} zile • {it.people} pers. • {formatMoney(itineraryTotalCost(it), currency)}
            </p>
          </div>
          <Link to={`/itinerar/${it.id}`} className="btn-primary px-4 py-2 text-sm">Deschide</Link>
          <button onClick={() => deleteItinerary(it.id)} className="btn-outline px-3 py-2 text-sm text-red-500">
            <Trash2 size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}

function FavoritesTab() {
  const { favorites } = useApp();
  const list = destinations.filter((d) => favorites.includes(d.id));
  if (!list.length)
    return (
      <EmptyState
        icon={<Heart size={44} />}
        title="Nicio destinație favorită"
        text="Salvează destinațiile care îți plac apăsând pe inimă."
        cta={{ to: '/orase', label: 'Descoperă destinații' }}
      />
    );
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {list.map((d) => (
        <Link key={d.id} to={`/destinatie/${d.id}`} className="card-surface flex items-center gap-3 p-3">
          <img src={d.image} alt={d.name} className="h-14 w-14 rounded-lg object-cover" />
          <div>
            <p className="font-semibold">{d.name}</p>
            <p className="text-sm text-navy-500 dark:text-sand-200/70">{d.country}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function SavedHotelsTab() {
  const { savedHotels, currency, toggleHotel } = useApp();
  const list = hotels.filter((h) => savedHotels.includes(h.id));
  if (!list.length)
    return (
      <EmptyState
        icon={<BedDouble size={44} />}
        title="Niciun hotel salvat"
        text="Apasă pe inima de pe orice hotel ca să îl salvezi aici."
        cta={{ to: '/hoteluri', label: 'Vezi hoteluri' }}
      />
    );
  return (
    <div className="space-y-3">
      {list.map((h) => {
        const dest = destinations.find((d) => d.id === h.destinationId);
        return (
          <div key={h.id} className="card-surface flex items-center gap-4 p-4">
            <img src={h.image} alt={h.name} className="h-16 w-20 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">
                {h.name} <span className="text-gold-500">{'★'.repeat(h.stars)}</span>
              </p>
              <p className="text-sm text-navy-500 dark:text-sand-200/70">
                {h.neighborhood}{dest ? `, ${dest.name}` : ''} • {h.reviewScore.toFixed(1)} {h.reviewLabel}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-turquoise-600 dark:text-turquoise-300">
                {formatMoney(cheapestRoomPrice(h), currency)}
              </p>
              <p className="text-xs text-navy-400">/ noapte</p>
            </div>
            <Link to={`/hoteluri?dest=${h.destinationId}`} className="btn-primary px-4 py-2 text-sm">
              Vezi
            </Link>
            <button onClick={() => toggleHotel(h.id, h.name)} className="btn-outline px-3 py-2 text-sm text-red-500">
              <Trash2 size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function ConversationsTab() {
  const { conversations, deleteConversation } = useApp();
  if (!conversations.length)
    return (
      <EmptyState
        icon={<MessageSquare size={44} />}
        title="Nicio conversație salvată"
        text="Discută cu agentul AI din butonul plutitor și conversațiile apar aici."
      />
    );
  return (
    <div className="space-y-3">
      {conversations.map((c) => (
        <div key={c.id} className="card-surface p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-medium">{c.title}</p>
              <p className="text-xs text-navy-400">
                {new Date(c.createdAt).toLocaleString('ro-RO')} • {c.messages.length} mesaje
              </p>
            </div>
            <button onClick={() => deleteConversation(c.id)} className="text-red-500" aria-label="Șterge">
              <Trash2 size={16} />
            </button>
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-navy-500 dark:text-sand-200/70">
            {c.messages[c.messages.length - 1]?.content}
          </p>
        </div>
      ))}
    </div>
  );
}

function BudgetsTab() {
  const { budgets, currency, deleteBudget } = useApp();
  if (!budgets.length)
    return (
      <EmptyState
        icon={<Wallet size={44} />}
        title="Niciun buget salvat"
        text="Folosește calculatorul de buget din pagina Planifică și salvează-ți estimările."
        cta={{ to: '/planifica', label: 'Deschide calculatorul' }}
      />
    );
  return (
    <div className="space-y-3">
      {budgets.map((b) => (
        <div key={b.id} className="card-surface flex items-center justify-between gap-3 p-4">
          <div>
            <p className="font-semibold">{b.label}</p>
            <p className="text-sm text-navy-500 dark:text-sand-200/70">
              {b.days} zile • {b.people} pers. • {new Date(b.createdAt).toLocaleDateString('ro-RO')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-turquoise-600 dark:text-turquoise-300">
              {formatMoney(b.total, currency)}
            </span>
            <button onClick={() => deleteBudget(b.id)} className="text-red-500" aria-label="Șterge">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function NotificationsTab() {
  const { notifications, markNotificationRead, markAllRead } = useApp();
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Notificări</h2>
        <button onClick={markAllRead} className="text-sm text-turquoise-600">Marchează toate ca citite</button>
      </div>
      <div className="space-y-3">
        {notifications.map((n) => (
          <button
            key={n.id}
            onClick={() => markNotificationRead(n.id)}
            className={`card-surface flex w-full gap-3 p-4 text-left transition ${n.read ? 'opacity-70' : ''}`}
          >
            <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${n.read ? 'bg-navy-300' : 'bg-turquoise-500'}`} />
            <div>
              <p className="font-medium">{n.title}</p>
              <p className="text-sm text-navy-500 dark:text-sand-200/70">{n.body}</p>
              <p className="mt-1 text-xs text-navy-400">{new Date(n.date).toLocaleString('ro-RO')}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </div>
  );
}

function EmptyState({
  icon,
  title,
  text,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  cta?: { to: string; label: string };
}) {
  return (
    <div className="card-surface flex flex-col items-center justify-center py-16 text-center">
      <span className="mb-4 text-navy-300">{icon}</span>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-navy-500 dark:text-sand-200/70">{text}</p>
      {cta && (
        <Link to={cta.to} className="btn-primary mt-6 px-5 py-2.5 text-sm">
          {cta.label}
        </Link>
      )}
    </div>
  );
}
