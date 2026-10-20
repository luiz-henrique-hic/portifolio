'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Sparkle } from 'lucide-react';
import type { Mode, SectionId } from '@/content/types';
import { useSite } from '../providers';

interface SectionProps {
  id: SectionId;
  title: string;
  subtitle?: string;
  index?: string;
  /** Modo em que a seção ganha destaque. */
  focus?: Mode;
  compact?: boolean;
  children: React.ReactNode;
}

export function Section({ id, title, subtitle, index, focus, compact, children }: SectionProps) {
  const { mode, t } = useSite();
  const highlighted = focus === mode;
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`relative mx-auto max-w-6xl px-4 sm:px-6 ${compact ? 'py-16' : 'py-20 sm:py-28'}`}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-4 inset-y-6 -z-10 rounded-3xl transition-opacity duration-500 sm:inset-x-0 ${
          highlighted ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ background: 'radial-gradient(ellipse at top, var(--accent-soft), transparent 70%)' }}
      />
      <Reveal>
        <div className="mb-10 flex flex-col gap-3 sm:mb-14">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            {index && <span className="text-accent">{index}</span>}
            <span className="h-px w-10 bg-line" />
            {focus && (
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 normal-case tracking-normal transition-all duration-300 ${
                  highlighted ? 'border-accent/50 bg-accent-soft text-accent' : 'border-transparent opacity-0'
                }`}
                aria-hidden={!highlighted}
              >
                <Sparkle className="h-3 w-3" aria-hidden="true" />
                {t.mode.highlighted[focus]}
              </span>
            )}
          </div>
          <h2 id={`${id}-title`} className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
            {title}
          </h2>
          {subtitle && <p className="max-w-2xl text-base text-muted sm:text-lg">{subtitle}</p>}
        </div>
      </Reveal>
      {children}
    </section>
  );
}

export function Reveal({
  children,
  delay = 0,
  className,
  as = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'li';
}) {
  const reduce = useReducedMotion();
  const Cmp = as === 'li' ? motion.li : motion.div;
  return (
    <Cmp
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Cmp>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-line bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-muted">{children}</span>
  );
}
