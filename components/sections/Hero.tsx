'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, Download, Mail, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { site } from '@/content/site';
import { asset } from '@/lib/i18n';
import { useSite } from '../providers';
import { Counter } from '../ui/Counter';
import { GithubIcon, LinkedinIcon } from '../ui/Icon';

// Começa com a 1ª palavra completa (igual no servidor e no cliente → sem erro de hidratação e bom para SEO).
function useTypewriter(words: string[], reduce: boolean | null) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(words[0]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setIndex(0);
    setText(words[0]);
    setDeleting(false);
  }, [words]);

  useEffect(() => {
    if (reduce) {
      const id = setInterval(() => setIndex((i) => (i + 1) % words.length), 2600);
      return () => clearInterval(id);
    }
    const word = words[index % words.length];
    let delay = deleting ? 35 : 70;
    if (!deleting && text === word) delay = 1700;
    if (deleting && text === '') delay = 250;
    const id = setTimeout(() => {
      if (!deleting && text === word) setDeleting(true);
      else if (deleting && text === '') {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      } else setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
    }, delay);
    return () => clearTimeout(id);
  }, [text, deleting, index, words, reduce]);

  return reduce ? words[index % words.length] : text;
}

export function Hero() {
  const { t, mode, locale } = useSite();
  const reduce = useReducedMotion();
  const role = useTypewriter(t.hero.roles, reduce);
  const cvReady = site.cv[locale];

  const btn = 'inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all';

  return (
    <section id="hero" className="relative flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16">
      <div aria-hidden="true" className="absolute left-1/2 top-0 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
      <div aria-hidden="true" className="absolute right-0 top-1/3 -z-10 h-[360px] w-[360px] rounded-full bg-blue/10 blur-[110px]" />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.p
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1 font-mono text-xs text-muted"
        >
          <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
          {t.hero.location}
        </motion.p>

        <motion.h1
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.6 }}
          className="font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl"
        >
          <span className="block text-lg font-medium text-muted sm:text-2xl">{t.hero.greeting}</span>
          Luiz Henrique
        </motion.h1>

        <p className="mt-4 min-h-[2.5rem] font-mono text-xl text-accent sm:text-3xl" aria-live="polite">
          <span className="text-muted">&gt; </span>
          <span className="caret">{role}</span>
        </p>

        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl"
          >
            {t.hero.positioning[mode]}
          </motion.p>
        </AnimatePresence>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#contact" className={`${btn} border-accent bg-accent text-bg hover:brightness-110`}>
            <Mail className="h-4 w-4" aria-hidden="true" /> {t.hero.cta.contact}
          </a>
          {cvReady ? (
            <a href={asset(`/cv/cv-${locale}.pdf`)} download className={`${btn} border-line bg-surface hover:border-accent`}>
              <Download className="h-4 w-4" aria-hidden="true" /> {t.hero.cta.cv}
            </a>
          ) : (
            <span className={`${btn} cursor-not-allowed border-dashed border-line text-muted`} aria-disabled="true">
              <Download className="h-4 w-4" aria-hidden="true" /> {t.hero.cta.cvSoon}
            </span>
          )}
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={`${btn} border-line bg-surface hover:border-blue`}>
            <LinkedinIcon className="h-4 w-4" /> {t.hero.cta.linkedin}
          </a>
          <a href={site.githubUrl} target="_blank" rel="noopener noreferrer" className={`${btn} border-line bg-surface hover:border-fg`}>
            <GithubIcon className="h-4 w-4" /> {t.hero.cta.github}
          </a>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-14 grid max-w-3xl grid-cols-1 gap-6 border-t border-line pt-8 sm:grid-cols-3"
          >
            {t.hero.metrics[mode].map((m) => (
              <Counter key={m.label} metric={m} />
            ))}
          </motion.div>
        </AnimatePresence>

        <a href="#about" className="mt-12 inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-accent" aria-label={t.nav.sections.about}>
          <ArrowDown className="h-4 w-4 animate-bounce motion-reduce:animate-none" aria-hidden="true" />
          {t.nav.sections.about}
        </a>
      </div>
    </section>
  );
}
