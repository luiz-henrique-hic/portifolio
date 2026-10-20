'use client';

import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Menu, Moon, Sun, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { locales } from '@/content';
import type { Locale, Mode, SectionId } from '@/content/types';
import { LOCALE_STORAGE_KEY, THEME_STORAGE_KEY, localePath, safeSet } from '@/lib/i18n';
import { useSite } from './providers';

export const SECTION_ORDER: SectionId[] = [
  'hero', 'about', 'timeline', 'management', 'sankhya', 'salesforce', 'ai', 'dashboards', 'thesis', 'infra', 'stack', 'github', 'contact',
];

export const SECTION_FOCUS: Partial<Record<SectionId, Mode>> = {
  management: 'gestor',
  dashboards: 'gestor',
  sankhya: 'hic',
  salesforce: 'hic',
  ai: 'hic',
  thesis: 'hic',
  infra: 'hic',
  stack: 'hic',
};

function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>('hero');
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id as SectionId);
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    );
    SECTION_ORDER.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return active;
}

export function rememberLocale(locale: Locale) {
  safeSet(LOCALE_STORAGE_KEY, locale);
}

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, t } = useSite();
  return (
    <div role="group" aria-label={t.nav.language} className={`flex items-center rounded-full border border-line bg-surface p-0.5 font-mono text-xs ${className}`}>
      {locales.map((l) => {
        const active = l === locale;
        return (
          <Link
            key={l}
            href={localePath(l)}
            scroll={false}
            hrefLang={l === 'pt' ? 'pt-BR' : l}
            aria-current={active ? 'true' : undefined}
            onClick={() => rememberLocale(l)}
            className={`relative rounded-full px-2.5 py-1 uppercase transition-colors ${active ? 'text-bg' : 'text-muted hover:text-fg'}`}
          >
            {active && <motion.span layoutId="lang-pill" className="absolute inset-0 rounded-full bg-accent" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
            <span className="relative">{l}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function ModeToggle({ className = '' }: { className?: string }) {
  const { mode, setMode, t } = useSite();
  const modes: Mode[] = ['gestor', 'hic'];
  return (
    <div role="radiogroup" aria-label={t.mode.label} className={`flex items-center rounded-full border border-line bg-surface p-0.5 text-xs font-medium ${className}`}>
      {modes.map((m, i) => {
        const active = m === mode;
        return (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setMode(m)}
            className={`relative flex items-center gap-1 rounded-full px-3 py-1 transition-colors ${active ? 'text-bg' : 'text-muted hover:text-fg'}`}
          >
            {active && <motion.span layoutId="mode-pill" className="absolute inset-0 rounded-full bg-blue" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
            <span className="relative">{t.mode[m]}</span>
            {i === 0 && <span className="sr-only">/</span>}
          </button>
        );
      })}
    </div>
  );
}

function ThemeToggle() {
  const { t } = useSite();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  useEffect(() => {
    setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
  }, []);
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    safeSet(THEME_STORAGE_KEY, next);
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? t.nav.themeLight : t.nav.themeDark}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors hover:text-accent"
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
    </button>
  );
}

export function Nav() {
  const { t, mode } = useSite();
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const links = SECTION_ORDER.filter((id) => id !== 'hero');

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/60 bg-bg/75 backdrop-blur-xl">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-md focus:bg-accent focus:px-3 focus:py-1 focus:text-bg">
        {t.nav.skip}
      </a>
      <nav className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <a href="#hero" className="flex shrink-0 items-center gap-2 font-display text-sm font-bold tracking-tight">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-accent font-mono text-xs text-bg">LH</span>
          <span className="hidden sm:inline">Luiz Henrique</span>
        </a>

        <ul className="no-scrollbar mx-auto hidden items-center gap-0.5 overflow-x-auto xl:flex">
          {links.map((id) => {
            const isActive = active === id;
            const focused = SECTION_FOCUS[id] === mode;
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative block rounded-full px-2.5 py-1.5 text-[13px] transition-colors ${isActive ? 'text-fg' : 'text-muted hover:text-fg'}`}
                >
                  {isActive && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-surface-2" transition={{ type: 'spring', stiffness: 400, damping: 35 }} />}
                  <span className="relative">{t.nav.sections[id]}</span>
                  {focused && <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex items-center gap-2 xl:ml-0">
          <ModeToggle />
          <LanguageSwitcher className="hidden sm:flex" />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t.nav.menu}
            aria-expanded={open}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-muted xl:hidden"
          >
            <Menu className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </nav>

      <motion.div
        role="progressbar"
        aria-label={t.nav.progress}
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-accent to-blue"
        style={{ scaleX: progress }}
      />

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-bg/95 backdrop-blur-xl xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex h-14 items-center justify-between px-4">
              <LanguageSwitcher />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.nav.close}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <ul className="grid grid-cols-2 gap-2 px-4 pt-4">
              {links.map((id, i) => (
                <motion.li key={id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
                  <a
                    href={`#${id}`}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm ${
                      active === id ? 'border-accent/60 text-fg' : 'border-line text-muted'
                    }`}
                  >
                    {t.nav.sections[id]}
                    {SECTION_FOCUS[id] === mode && <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
