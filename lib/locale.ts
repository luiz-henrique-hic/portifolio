import { notFound } from 'next/navigation';
import { isLocale } from '@/content';
import type { Locale } from '@/content/types';

/** Converte o segmento opcional [[...locale]] em idioma: [] → pt, ['en'] → en, ['es'] → es. */
export function resolveLocale(segments: string[] | undefined): Locale {
  if (!segments || segments.length === 0) return 'pt';
  if (segments.length === 1 && isLocale(segments[0]) && segments[0] !== 'pt') return segments[0];
  notFound();
}
