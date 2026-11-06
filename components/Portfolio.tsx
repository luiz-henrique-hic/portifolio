'use client';

import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { useEffect } from 'react';
import type { Content, Locale, SuggestStrings } from '@/content/types';
import { LocaleSuggest } from './LocaleSuggest';
import { Nav, isSectionVisible } from './Nav';
import { useSite } from './providers';
import type { SectionId } from '@/content/types';
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
        <Sections />
      </motion.main>
      <Footer />
      <LocaleSuggest suggestions={suggestions} />
    </SiteProvider>
    </MotionConfig>
  );
}

const SECTIONS: { id: SectionId; Cmp: () => React.ReactElement }[] = [
  { id: 'hero', Cmp: Hero },
  { id: 'about', Cmp: About },
  { id: 'timeline', Cmp: Timeline },
  { id: 'management', Cmp: Management },
  { id: 'sankhya', Cmp: Sankhya },
  { id: 'salesforce', Cmp: Salesforce },
  { id: 'ai', Cmp: AI },
  { id: 'dashboards', Cmp: Dashboards },
  { id: 'thesis', Cmp: Thesis },
  { id: 'infra', Cmp: Infra },
  { id: 'stack', Cmp: Stack },
  { id: 'github', Cmp: GitHub },
  { id: 'contact', Cmp: Contact },
];

/** Ao escolher Gestor ou HIC, as seções do perfil oposto saem da página (com animação). */
function Sections() {
  const { mode } = useSite();
  return (
    <AnimatePresence initial={false}>
      {SECTIONS.filter(({ id }) => isSectionVisible(id, mode)).map(({ id, Cmp }) => (
        <motion.div
          key={id}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{ overflow: 'hidden' }}
        >
          <Cmp />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
