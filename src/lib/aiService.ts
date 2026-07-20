import { generateDemoReply, makeMessage } from '@/lib/aiChat';
import { destinations } from '@/data/destinations';
import { tripTypeLabels } from '@/data/content';
import type { ChatMessage, TravelPreferences } from '@/types';

// ─────────────────────────────────────────────────────────────
//  Strat de servicii AI — punct unic de integrare.
//
//  • Fără cheie API  → folosește motorul DEMO (reguli locale).
//  • Cu cheie API    → apel real către Claude (Anthropic Messages API).
//
//  Cheile se citesc din variabilele de mediu Vite (import.meta.env),
//  NICIODATĂ din cod. Vezi „.env.example".
// ─────────────────────────────────────────────────────────────

interface AiEnv {
  provider: string;
  apiKey: string;
  model: string;
}

function readEnv(): AiEnv {
  const env = import.meta.env;
  return {
    provider: (env.VITE_AI_PROVIDER as string) || 'demo',
    apiKey: (env.VITE_AI_API_KEY as string) || '',
    model: (env.VITE_AI_MODEL as string) || 'claude-opus-4-8',
  };
}

export function isLiveAiConfigured(): boolean {
  const { provider, apiKey } = readEnv();
  return provider !== 'demo' && apiKey.trim().length > 0;
}

function buildSystemPrompt(prefs: TravelPreferences): string {
  const destList = destinations
    .map((d) => `${d.name} (${d.country}) — de la ${d.pricePerDay}€/zi, ${d.tags.map((t) => tripTypeLabels[t]).join('/')}`)
    .join('; ');

  const prefsSummary = Object.entries(prefs)
    .filter(([, v]) => v !== undefined && v !== '' && (!Array.isArray(v) || v.length))
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
    .join('; ');

  return (
    'Ești agentul personal de călătorii NextTravelAI. Răspunzi în limba română, ' +
    'prietenos, cald și concis (2-5 propoziții de obicei). Pui întrebări clarificatoare când e util, ' +
    'recomanzi destinații, construiești itinerare pe zile, sugerezi hoteluri, restaurante, activități, ' +
    'estimezi bugetul și explici pe scurt de ce alegi fiecare recomandare. ' +
    'IMPORTANT: dacă utilizatorul spune că NU vrea o destinație, nu o mai recomanda. ' +
    'Poți face referire la aceste destinații demonstrative din platformă: ' +
    destList +
    '. ' +
    (prefsSummary ? `Preferințele curente ale utilizatorului: ${prefsSummary}.` : 'Utilizatorul încă nu a completat preferințe.')
  );
}

/**
 * Trimite conversația către agentul AI și întoarce răspunsul.
 * Selectează automat providerul potrivit în funcție de configurare.
 */
export async function sendToAgent(
  userText: string,
  history: ChatMessage[],
  prefs: TravelPreferences,
): Promise<ChatMessage> {
  if (isLiveAiConfigured()) {
    try {
      return await callLiveProvider(userText, history, prefs);
    } catch (err) {
      // Dacă apelul real eșuează, degradăm elegant la modul demo.
      console.warn('[NextTravelAI] Apel AI live eșuat, se folosește modul demo:', err);
      const reply = generateDemoReply(userText, prefs);
      return makeMessage('assistant', reply.content, {
        suggestions: reply.suggestions,
        recommendations: reply.recommendations,
      });
    }
  }

  // Mod DEMO — mică întârziere pentru senzația de „gândire".
  await delay(500 + Math.random() * 400);
  const reply = generateDemoReply(userText, prefs);
  return makeMessage('assistant', reply.content, {
    suggestions: reply.suggestions,
    recommendations: reply.recommendations,
  });
}

// ─── Apel real către Claude (Anthropic Messages API) ──────────
//
//  Notă de securitate: apelul direct din browser expune cheia
//  utilizatorilor. Pentru producție reală, rutează printr-un backend
//  proxy. Header-ul „anthropic-dangerous-direct-browser-access" permite
//  apelul din browser pentru prototipare.

async function callLiveProvider(
  userText: string,
  history: ChatMessage[],
  prefs: TravelPreferences,
): Promise<ChatMessage> {
  const { apiKey, model } = readEnv();

  // Construiește mesajele: elimină mesajele „assistant" de la început,
  // ca primul mesaj să fie „user" (cerință Anthropic).
  const mapped = history
    .map((m) => ({ role: m.role, content: m.content }))
    .filter((m) => m.content.trim().length > 0);
  while (mapped.length && mapped[0].role === 'assistant') mapped.shift();
  if (!mapped.length || mapped[mapped.length - 1].role !== 'user') {
    mapped.push({ role: 'user', content: userText });
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      system: buildSystemPrompt(prefs),
      messages: mapped,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Anthropic ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as { content?: Array<{ type: string; text?: string }> };
  const textOut = (data.content ?? [])
    .filter((b) => b.type === 'text' && b.text)
    .map((b) => b.text)
    .join('\n')
    .trim();

  return makeMessage('assistant', textOut || 'Îmi pare rău, nu am putut genera un răspuns.');
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Alte API-uri viitoare ────────────────────────────────────
// Aceleași principii se aplică pentru:
//   • Zboruri  → VITE_FLIGHTS_API_KEY  (ex. Amadeus)
//   • Hoteluri → VITE_HOTELS_API_KEY   (ex. Booking)
//   • Vreme    → VITE_WEATHER_API_KEY  (ex. OpenWeather)
//   • Hărți    → VITE_MAPS_API_KEY     (Google Maps / MapLibre)

export const externalApisStatus = () => {
  const env = import.meta.env;
  return {
    ai: isLiveAiConfigured(),
    flights: Boolean(env.VITE_FLIGHTS_API_KEY),
    hotels: Boolean(env.VITE_HOTELS_API_KEY),
    weather: Boolean(env.VITE_WEATHER_API_KEY),
    maps: Boolean(env.VITE_MAPS_API_KEY),
  };
};
