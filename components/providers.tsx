'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Content, Locale, Mode } from '@/content/types';
import { MODE_STORAGE_KEY, safeGet, safeSet } from '@/lib/i18n';

interface SiteContextValue {
  locale: Locale;
  t: Content;
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ locale, content, children }: { locale: Locale; content: Content; children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>('gestor');

  useEffect(() => {
    const stored = safeGet(MODE_STORAGE_KEY);
    if (stored === 'gestor' || stored === 'hic') setModeState(stored);
  }, []);

  const setMode = useCallback((next: Mode) => {
    setModeState(next);
    safeSet(MODE_STORAGE_KEY, next);
  }, []);

  return <SiteContext.Provider value={{ locale, t: content, mode, setMode }}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used inside SiteProvider');
  return ctx;
}
