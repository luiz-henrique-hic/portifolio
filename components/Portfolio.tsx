'use client';

import { MotionConfig, motion } from 'framer-motion';
import { useEffect } from 'react';
import type { Content, Locale, SuggestStrings } from '@/content/types';
import { LocaleSuggest } from './LocaleSuggest';
import { Nav } from './Nav';
import { SiteProvider } from './providers';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Timeline } from './sections/Timeline';
import { Management } from './sections/Management';
import { Sankhya } from './sections/Sankhya';
import { Salesforce } from './sections/Salesforce';
import { AI } from './sections/AI';
import { Dashboards } from './sections/Dashboards';
import { Thesis } from './sections/Thesis';
import { Infra } from './sections/Infra';
import { Stack } from './sections/Stack';
import { GitHub } from './sections/GitHub';
import { Contact, Footer } from './sections/Contact';

interface Props {
  locale: Locale;
  content: Content;
  suggestions: Record<Locale, SuggestStrings>;
}

// Só anima a troca de idioma; a 1ª pintura (SSR) fica visível imediatamente (LCP).
let hasMounted = false;

export function Portfolio({ locale, content, suggestions }: Props) {
  const animateIn = hasMounted;
  useEffect(() => {
    hasMounted = true;
  }, []);
  return (
    <MotionConfig reducedMotion="user">
    <SiteProvider locale={locale} content={content}>
      <div aria-hidden="true" className="bg-grid pointer-events-none fixed inset-0 -z-20" />
      <Nav />
      {/* key={locale}: troca de idioma com fade suave, sem recarregar a página */}
      <motion.main
        id="main"
        key={locale}
        initial={animateIn ? { opacity: 0, filter: 'blur(6px)' } : false}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <Hero />
        <About />
        <Timeline />
        <Management />
        <Sankhya />
        <Salesforce />
        <AI />
        <Dashboards />
        <Thesis />
        <Infra />
        <Stack />
        <GitHub />
        <Contact />
      </motion.main>
      <Footer />
      <LocaleSuggest suggestions={suggestions} />
    </SiteProvider>
    </MotionConfig>
  );
}
