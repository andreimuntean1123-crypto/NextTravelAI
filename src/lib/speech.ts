import type { Language } from '@/types';

// ─────────────────────────────────────────────────────────────
//  Voce: recunoaștere vocală (speech-to-text) + sinteză (text-to-speech)
//  folosind Web Speech API — nativ în browser, fără cheie API.
// ─────────────────────────────────────────────────────────────

// Tipuri minime pentru Web Speech API (nu sunt în lib.dom standard peste tot).
interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}
export interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: { length: number; [i: number]: SpeechRecognitionResultLike };
}
export interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: unknown) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

export function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

export function isSpeechRecognitionSupported(): boolean {
  return getRecognitionCtor() !== null;
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// Mapare limbă aplicație → locale pentru voce.
export function langToLocale(language: Language): string {
  switch (language) {
    case 'en':
      return 'en-US';
    case 'ru':
      return 'ru-RU';
    default:
      return 'ro-RO';
  }
}

// Curăță textul pentru citire cu voce (fără markdown / emoji / buline).
export function cleanForSpeech(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/[•▪◦]/g, '')
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function speak(text: string, language: Language): void {
  if (!isSpeechSynthesisSupported()) return;
  cancelSpeech();
  const utter = new SpeechSynthesisUtterance(cleanForSpeech(text));
  utter.lang = langToLocale(language);
  utter.rate = 1;
  utter.pitch = 1;
  // Alege o voce potrivită limbii, dacă există.
  const voices = window.speechSynthesis.getVoices();
  const match = voices.find((v) => v.lang.toLowerCase().startsWith(utter.lang.slice(0, 2)));
  if (match) utter.voice = match;
  window.speechSynthesis.speak(utter);
}

export function cancelSpeech(): void {
  if (!isSpeechSynthesisSupported()) return;
  window.speechSynthesis.cancel();
}

export function isSpeaking(): boolean {
  return isSpeechSynthesisSupported() && window.speechSynthesis.speaking;
}
