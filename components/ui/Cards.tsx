'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { Card, Case } from '@/content/types';
import { useSite } from '../providers';
import { Icon } from './Icon';
import { Reveal, Tag } from './Section';

export function InfoCard({ card, index = 0 }: { card: Card; index?: number }) {
  return (
    <Reveal delay={Math.min(index * 0.05, 0.3)} className="h-full">
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-accent/50"
      >
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent transition-colors group-hover:bg-accent group-hover:text-bg">
          <Icon name={card.icon} />
        </div>
        <h3 className="font-display text-lg font-semibold">{card.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{card.desc}</p>
        {card.tags && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {card.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
      </motion.article>
    </Reveal>
  );
}

export function CardGrid({ cards, cols = 3 }: { cards: Card[]; cols?: 2 | 3 | 4 }) {
  const colClass = cols === 4 ? 'lg:grid-cols-4' : cols === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3';
  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${colClass}`}>
      {cards.map((card, i) => (
        <InfoCard key={card.title} card={card} index={i} />
      ))}
    </div>
  );
}

/** Card de projeto que expande mostrando Problema → Solução → Impacto. */
export function CaseCard({ item, index = 0 }: { item: Case; index?: number }) {
  const { t } = useSite();
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const steps = [
    { label: t.common.problem, text: item.problem, color: 'text-danger' },
    { label: t.common.solution, text: item.solution, color: 'text-blue' },
    { label: t.common.impact, text: item.impact, color: 'text-ok' },
  ];
  return (
    <Reveal delay={Math.min(index * 0.05, 0.3)}>
      <article
        className={`rounded-2xl border bg-surface transition-colors ${open ? 'border-accent/60' : 'border-line hover:border-accent/40'}`}
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-start gap-4 p-5 text-left focus-visible:outline-2 focus-visible:outline-accent"
        >
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <Icon name={item.icon} />
          </span>
          <span className="flex-1">
            <span className="block font-display text-lg font-semibold">{item.title}</span>
            <span className="mt-1 block text-sm text-muted">{item.problem}</span>
            <span className="mt-2 inline-flex items-center gap-1 font-mono text-xs text-accent">
              {open ? t.common.collapse : t.common.expand}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
            </span>
          </span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <ol className="grid gap-3 border-t border-line px-5 pb-5 pt-4 sm:grid-cols-3">
                {steps.map((s, i) => (
                  <li key={s.label} className="relative rounded-xl bg-surface-2 p-4">
                    <span className={`font-mono text-[11px] uppercase tracking-widest ${s.color}`}>
                      {String(i + 1).padStart(2, '0')} · {s.label}
                    </span>
                    <p className="mt-2 text-sm leading-relaxed">{s.text}</p>
                  </li>
                ))}
              </ol>
              {item.tags && (
                <div className="flex flex-wrap gap-1.5 px-5 pb-5">
                  {item.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </article>
    </Reveal>
  );
}

export function CaseList({ items, single }: { items: Case[]; single?: boolean }) {
  return (
    <div className={`grid gap-4 ${single ? '' : 'lg:grid-cols-2'}`}>
      {items.map((item, i) => (
        <CaseCard key={item.title} item={item} index={i} />
      ))}
    </div>
  );
}
