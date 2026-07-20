import type { AuthUser } from '@/types';

// ─────────────────────────────────────────────────────────────
//  Autentificare cu Google (Google Identity Services).
//
//  • Cu VITE_GOOGLE_CLIENT_ID setat → buton Google real.
//  • Fără cheie → mod demo (formular simplu nume + email).
//
//  Cum obții Client ID (gratuit):
//    1. https://console.cloud.google.com/apis/credentials
//    2. „Create Credentials" → „OAuth client ID" → „Web application"
//    3. Adaugă domeniul tău (ex. https://...vercel.app) la
//       „Authorized JavaScript origins".
//    4. Copiază Client ID în „.env": VITE_GOOGLE_CLIENT_ID=...
// ─────────────────────────────────────────────────────────────

export function getGoogleClientId(): string {
  return (import.meta.env.VITE_GOOGLE_CLIENT_ID as string) || '';
}

export function isGoogleConfigured(): boolean {
  return getGoogleClientId().trim().length > 0;
}

// Decodează payload-ul unui JWT (fără verificare — doar pentru afișare).
export function decodeJwt(token: string): Record<string, unknown> {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(json);
  } catch {
    return {};
  }
}

// Google Identity Services — tipuri minime necesare.
interface GoogleId {
  initialize: (config: {
    client_id: string;
    callback: (resp: { credential: string }) => void;
  }) => void;
  renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
  prompt: () => void;
}
declare global {
  interface Window {
    google?: { accounts: { id: GoogleId } };
  }
}

let scriptPromise: Promise<void> | null = null;

export function loadGoogleScript(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Nu s-a putut încărca Google Identity Services'));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/**
 * Inițializează Google Sign-In și randează butonul oficial în `target`.
 * Apelează `onUser` cu profilul extras din credențial (JWT).
 */
export async function renderGoogleButton(
  target: HTMLElement,
  onUser: (user: AuthUser) => void,
): Promise<void> {
  const clientId = getGoogleClientId();
  if (!clientId) throw new Error('VITE_GOOGLE_CLIENT_ID lipsește');
  await loadGoogleScript();
  const id = window.google!.accounts.id;
  id.initialize({
    client_id: clientId,
    callback: (resp) => {
      const payload = decodeJwt(resp.credential);
      onUser({
        name: String(payload.name ?? 'Utilizator Google'),
        email: String(payload.email ?? ''),
        picture: payload.picture ? String(payload.picture) : undefined,
        provider: 'google',
        since: Date.now(),
      });
    },
  });
  id.renderButton(target, {
    theme: 'outline',
    size: 'large',
    shape: 'pill',
    text: 'continue_with',
    logo_alignment: 'left',
    width: 320,
  });
}

// Formatare zi + oră pentru istoricul de activitate.
export function formatDateTime(ts: number, locale = 'ro-RO'): string {
  return new Date(ts).toLocaleString(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
