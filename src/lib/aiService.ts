import { generateDemoReply, makeMessage } from '@/lib/aiChat';
import type { ChatMessage, TravelPreferences } from '@/types';

// ─────────────────────────────────────────────────────────────
//  Strat de servicii AI — punct unic de integrare.
//
//  • Fără cheie API  → folosește motorul DEMO (reguli locale).
//  • Cu cheie API    → pregătit să apeleze un provider real
//                      (Anthropic Claude, OpenAI etc.).
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
    model: (env.VITE_AI_MODEL as string) || 'claude-sonnet-5',
  };
}

export function isLiveAiConfigured(): boolean {
  const { provider, apiKey } = readEnv();
  return provider !== 'demo' && apiKey.trim().length > 0;
}

const SYSTEM_PROMPT =
  'Ești agentul personal de călătorii NextTravelAI. Răspunzi în limba română, ' +
  'prietenos și concis. Pui întrebări clarificatoare, recomanzi destinații, ' +
  'construiești itinerare pe zile, sugerezi hoteluri, restaurante și activități, ' +
  'estimezi bugetul și explici de ce alegi fiecare recomandare.';

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
    }
  }

  // Mod DEMO — mică întârziere pentru senzația de „gândire".
  await delay(600 + Math.random() * 500);
  const reply = generateDemoReply(userText, prefs);
  return makeMessage('assistant', reply.content, {
    suggestions: reply.suggestions,
    recommendations: reply.recommendations,
  });
}

// ─── Integrare provider real (schelet pregătit) ───────────────
//
//  Când adaugi cheia în „.env", implementează apelul HTTP aici.
//  Exemplu pentru Anthropic Claude (Messages API):
//
//  const res = await fetch('https://api.anthropic.com/v1/messages', {
//    method: 'POST',
//    headers: {
//      'content-type': 'application/json',
//      'x-api-key': apiKey,
//      'anthropic-version': '2023-06-01',
//    },
//    body: JSON.stringify({
//      model,
//      max_tokens: 1024,
//      system: SYSTEM_PROMPT,
//      messages: [...history, { role: 'user', content: userText }]
//        .map(m => ({ role: m.role, content: m.content })),
//    }),
//  });
//
//  RECOMANDARE DE SECURITATE: nu expune cheia în browser în producție.
//  Rutează apelul printr-un backend / funcție serverless proxy.

async function callLiveProvider(
  userText: string,
  history: ChatMessage[],
  prefs: TravelPreferences,
): Promise<ChatMessage> {
  const { model } = readEnv();

  // Placeholder: structura este pregătită, dar implementarea reală a
  // apelului de rețea se activează când conectezi backend-ul proxy.
  // Momentan degradăm la demo pentru a păstra aplicația 100% funcțională.
  void model;
  void history;
  void SYSTEM_PROMPT;
  const reply = generateDemoReply(userText, prefs);
  return makeMessage('assistant', reply.content, {
    suggestions: reply.suggestions,
    recommendations: reply.recommendations,
  });
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Ganduri viitoare pentru alte API-uri ─────────────────────
// Aceleași principii se aplică pentru:
//   • Zboruri  → VITE_FLIGHTS_API_KEY  (ex. Amadeus)
//   • Hoteluri → VITE_HOTELS_API_KEY   (ex. Booking)
//   • Vreme    → VITE_WEATHER_API_KEY  (ex. OpenWeather)
//   • Hărți    → VITE_MAPS_API_KEY     (Google Maps / MapLibre)
// Creează câte un modul dedicat în „src/lib/" pentru fiecare.

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
