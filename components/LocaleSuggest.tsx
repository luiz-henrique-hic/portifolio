'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Languages, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isLocale } from '@/content';
import type { Locale, SuggestStrings } from '@/content/types';
import { LOCALE_STORAGE_KEY, basePath, localePath, safeGet, safeSet } from '@/lib/i18n';
import { useSite } from './providers';

function browserLocale(): Locale {
  const lang = (typeof navigator !== 'undefined' ? navigator.language : 'pt').toLowerCase();
  if (lang.startsWith('es')) return 'es';
  if (lang.startsWith('pt')) return 'pt';
  return 'en';
}

/**
 * 1ª visita: sugere o idioma do navegador (sem forçar).
 * Visitas seguintes na raiz: aplica a escolha salva.
 */
export function LocaleSuggest({ suggestions }: { suggestions: Record<Locale, SuggestStrings> }) {
  const { locale } = useSite();
  const router = useRouter();
  const pathname = usePathname();
  const [target, setTarget] = useState<Locale | null>(null);

  useEffect(() => {
    const stored = safeGet(LOCALE_STORAGE_KEY);
    const atRoot = pathname === '/' || pathname === `${basePath}/` || pathname === basePath;
    if (isLocale(stored ?? undefined)) {
      if (atRoot && stored !== locale) router.replace(localePath(stored as Locale), { scroll: false });
      return;
    }
    const detected = browserLocale();
    if (detected !== locale) setTarget(detected);
  }, [locale, pathname, router]);

  const choose = (l: Locale) => {
    safeSet(LOCALE_STORAGE_KEY, l);
    setTarget(null);
    if (l !== locale) router.push(localePath(l), { scroll: false });
  };

  const s = target ? suggestions[target] : null;

  return (
    <AnimatePresence>
      {target && s && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-label={s.message}
          lang={target === 'pt' ? 'pt-BR' : target}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-line bg-surface/95 p-3 pl-4 shadow-2xl backdrop-blur sm:inset-x-auto sm:right-6"
        >
          <Languages className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
          <p className="flex-1 text-sm">{s.message}</p>
          <button type="button" onClick={() => choose(target)} className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-bg">
            {s.accept}
          </button>
          <button
            type="button"
            onClick={() => choose(locale)}
            aria-label={s.dismiss}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted hover:text-fg"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
