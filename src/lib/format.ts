import type { Currency, Language } from '@/types';
import { translate } from '@/i18n/translations';

// Rate demonstrative față de EUR (bază). Ușor de înlocuit cu un API de curs.
export const currencyRates: Record<Currency, number> = {
  EUR: 1,
  RON: 4.97,
  USD: 1.08,
  GBP: 0.85,
};

export const currencySymbols: Record<Currency, string> = {
  EUR: '€',
  RON: 'lei',
  USD: '$',
  GBP: '£',
};

export function convert(amountEur: number, currency: Currency): number {
  return amountEur * currencyRates[currency];
}

export function formatMoney(amountEur: number, currency: Currency): string {
  const value = convert(amountEur, currency);
  const rounded = Math.round(value);
  const formatted = rounded.toLocaleString('ro-RO');
  return currency === 'RON'
    ? `${formatted} ${currencySymbols[currency]}`
    : `${currencySymbols[currency]}${formatted}`;
}

export function formatTemp(celsius: number): string {
  return `${Math.round(celsius)}°C`;
}

export function formatDuration(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function pluralDays(days: number, lang: Language = 'ro'): string {
  return `${days} ${translate(lang, days === 1 ? 'common.day' : 'common.days')}`;
}

export function pluralPeople(n: number, lang: Language = 'ro'): string {
  return `${n} ${translate(lang, 'common.people')}`;
}
