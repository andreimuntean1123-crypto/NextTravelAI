import type { Language } from '@/types';
import { translate, type TranslationKey } from '@/i18n/translations';

// Ajutoare pentru etichete scurte, indexate după o cheie tehnică (nu text),
// care trebuie traduse peste tot unde apar — indiferent de limbă.

export function tripTypeLabel(lang: Language, key: string): string {
  return translate(lang, `trip.${key}` as TranslationKey);
}

export function climateLabel(lang: Language, key: string): string {
  return translate(lang, `climate.${key}` as TranslationKey);
}

export function transportLabel(lang: Language, key: string): string {
  return translate(lang, `transport.${key}` as TranslationKey);
}

export function boardLabel(lang: Language, key: string): string {
  return translate(lang, `board.${key}` as TranslationKey);
}

export function propertyTypeLabel(lang: Language, key: string): string {
  return translate(lang, `property.${key}` as TranslationKey);
}

export function continentLabel(lang: Language, key: string): string {
  return translate(lang, `continent.${key}` as TranslationKey);
}

export function slotLabelText(lang: Language, key: string): string {
  return translate(lang, `slot.${key}` as TranslationKey);
}
