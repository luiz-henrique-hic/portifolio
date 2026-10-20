import type { Locale } from '@/content/types';

export const LOCALE_STORAGE_KEY = 'lh-locale';
export const MODE_STORAGE_KEY = 'lh-mode';
export const THEME_STORAGE_KEY = 'lh-theme';

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** Rota de cada idioma (sem basePath — next/link e router adicionam sozinhos). */
export function localePath(locale: Locale): string {
  return locale === 'pt' ? '/' : `/${locale}/`;
}

/** Para <a href> de arquivos estáticos em public/ (precisa do basePath manualmente). */
export function asset(path: string): string {
  return `${basePath}${path}`;
}

export function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* storage indisponível (modo privado etc.) */
  }
}

export function formatNumber(value: number, intl: string, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(intl, options).format(value);
}

export function formatCurrency(value: number, intl: string, compact = false): string {
  return new Intl.NumberFormat(intl, {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: compact ? 1 : 0,
    notation: compact ? 'compact' : 'standard',
  }).format(value);
}

export function formatDate(value: string | Date, intl: string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(intl, options ?? { day: '2-digit', month: 'short', year: 'numeric' }).format(
    typeof value === 'string' ? new Date(value) : value,
  );
}

/** PRNG determinístico (mulberry32) para dados fictícios estáveis entre servidor e cliente. */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
