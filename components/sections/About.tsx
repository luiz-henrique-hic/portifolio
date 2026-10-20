'use client';

import { motion } from 'framer-motion';
import { Briefcase, Check, Cpu } from 'lucide-react';
import type { Mode } from '@/content/types';
import { useSite } from '../providers';
import { Reveal, Section } from '../ui/Section';

export function About() {
  const { t, mode, setMode } = useSite();
  const cards: { key: Mode; icon: typeof Briefcase; data: typeof t.about.gestor }[] = [
    { key: 'gestor', icon: Briefcase, data: t.about.gestor },
    { key: 'hic', icon: Cpu, data: t.about.hic },
  ];

  return (
    <Section id="about" index="01" title={t.about.title} subtitle={t.about.subtitle}>
      <div className="grid gap-5 md:grid-cols-2">
        {cards.map(({ key, icon: IconCmp, data }, i) => {
          const active = mode === key;
          return (
            <Reveal key={key} delay={i * 0.1}>
              <motion.button
                type="button"
                onClick={() => setMode(key)}
                aria-pressed={active}
                animate={{ scale: active ? 1 : 0.98, opacity: active ? 1 : 0.7 }}
                whileHover={{ opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                className={`relative h-full w-full overflow-hidden rounded-3xl border p-6 text-left sm:p-8 ${
                  active ? 'border-accent/60 bg-surface shadow-[0_0_60px_-20px_var(--accent)]' : 'border-line bg-surface'
                }`}
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${key === 'gestor' ? 'bg-accent-soft text-accent' : 'bg-blue-soft text-blue'}`}>
                    <IconCmp className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-muted">{data.label}</span>
                </div>
                <h3 className="font-display text-2xl font-bold sm:text-3xl">{data.title}</h3>
                <ul className="mt-6 space-y-3">
                  {data.points.map((p) => (
                    <li key={p} className="flex gap-3 text-sm leading-relaxed sm:text-base">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${key === 'gestor' ? 'text-accent' : 'text-blue'}`} aria-hidden="true" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </motion.button>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
