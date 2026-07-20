import { loadStorage, saveStorage } from '@/lib/storage';

// ─────────────────────────────────────────────────────────────
//  Configurarea agentului AI — se poate seta din interfață (chat),
//  salvată în browser (localStorage), sau din variabile de mediu.
//
//  Prioritate: ce setezi în site (localStorage) > variabile .env.
// ─────────────────────────────────────────────────────────────

export interface AiConfig {
  provider: string; // 'demo' | 'anthropic'
  apiKey: string;
  model: string;
}

const KEY = 'aiConfig';

const DEFAULT_MODEL = 'claude-opus-4-8';

function envConfig(): AiConfig {
  const env = import.meta.env;
  return {
    provider: (env.VITE_AI_PROVIDER as string) || 'demo',
    apiKey: (env.VITE_AI_API_KEY as string) || '',
    model: (env.VITE_AI_MODEL as string) || DEFAULT_MODEL,
  };
}

export function getAiConfig(): AiConfig {
  const env = envConfig();
  const stored = loadStorage<Partial<AiConfig> | null>(KEY, null);
  if (!stored) return env;
  // Ce e setat în site are prioritate; restul cade pe .env / implicit.
  return {
    provider: stored.provider || env.provider,
    apiKey: stored.apiKey ?? env.apiKey,
    model: stored.model || env.model || DEFAULT_MODEL,
  };
}

export function setAiConfig(cfg: Partial<AiConfig>): void {
  const current = loadStorage<Partial<AiConfig>>(KEY, {});
  saveStorage(KEY, { ...current, ...cfg });
}

export function clearAiConfig(): void {
  saveStorage(KEY, {});
}

// Sursa cheii: din site sau din .env (util pentru UI).
export function aiKeySource(): 'site' | 'env' | 'none' {
  const stored = loadStorage<Partial<AiConfig> | null>(KEY, null);
  if (stored?.apiKey && stored.apiKey.trim()) return 'site';
  const env = envConfig();
  if (env.apiKey.trim()) return 'env';
  return 'none';
}
