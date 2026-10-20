import type { Content, Locale, SuggestStrings } from './types';
import { pt } from './pt';
import { en } from './en';
import { es } from './es';

export const locales: Locale[] = ['pt', 'en', 'es'];
export const defaultLocale: Locale = 'pt';

const dictionaries: Record<Locale, Content> = { pt, en, es };

export function getContent(locale: Locale): Content {
  return dictionaries[locale];
}

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as string[]).includes(value);
}

export const suggestions: Record<Locale, SuggestStrings> = {
  pt: pt.suggest,
  en: en.suggest,
  es: es.suggest,
};

export type { Content, Locale };
