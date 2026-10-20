'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Briefcase, ChevronRight, GraduationCap, Rocket } from 'lucide-react';
import { useState } from 'react';
import type { TimelineItem } from '@/content/types';
import { useSite } from '../providers';
import { Reveal, Section } from '../ui/Section';

const kindStyle: Record<TimelineItem['kind'], { icon: typeof Briefcase; color: string; bg: string }> = {
  work: { icon: Briefcase, color: 'text-accent', bg: 'bg-accent-soft' },
  venture: { icon: Rocket, color: 'text-blue', bg: 'bg-blue-soft' },
  edu: { icon: GraduationCap, color: 'text-ok', bg: 'bg-ok/10' },
};

export function Timeline() {
  const { t } = useSite();
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState(2);

  return (
    <Section id="timeline" index="02" title={t.timeline.title} subtitle={t.timeline.subtitle}>
      <p className="-mt-6 mb-8 font-mono text-xs text-muted">{t.timeline.hint}</p>
      <ol className="relative ml-4 border-l border-line sm:ml-6">
        {t.timeline.items.map((item, i) => {
          const style = kindStyle[item.kind];
          const IconCmp = style.icon;
          const open = selected === i;
          return (
            <Reveal as="li" key={`${item.org}-${item.period}`} delay={Math.min(i * 0.05, 0.3)} className="relative pb-6 pl-8 sm:pl-10">
                <span
                  className={`absolute -left-[17px] top-1 inline-flex h-8 w-8 items-center justify-center rounded-full border ${
                    open ? 'border-accent bg-bg' : 'border-line bg-surface'
                  } ${style.color}`}
                >
                  <IconCmp className="h-4 w-4" aria-hidden="true" />
                </span>
                <button
                  type="button"
                  onClick={() => setSelected(open ? -1 : i)}
                  aria-expanded={open}
                  className={`w-full rounded-2xl border p-4 text-left transition-colors sm:p-5 ${
                    open ? 'border-accent/50 bg-surface' : 'border-transparent hover:border-line hover:bg-surface/60'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-mono text-xs text-accent">{item.period}</span>
                    <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${style.bg} ${style.color}`}>
                      {t.timeline.kinds[item.kind]}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg font-semibold sm:text-xl">{item.org}</h3>
                      <p className="text-sm text-muted">{item.role}</p>
                    </div>
                    <ChevronRight className={`h-4 w-4 shrink-0 text-muted transition-transform ${open ? 'rotate-90' : ''}`} aria-hidden="true" />
                  </div>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="pt-3 text-sm leading-relaxed sm:text-base">{item.desc}</p>
                        {item.steps && (
                          <div className="mt-4 flex flex-wrap items-end gap-2">
                            {item.steps.map((step, s) => (
                              <motion.span
                                key={step}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + s * 0.12 }}
                                className="flex items-center gap-2"
                              >
                                <span
                                  className="rounded-lg border border-line bg-surface-2 px-3 py-1.5 text-xs font-medium"
                                  style={{ marginBottom: s * 6, borderColor: s === item.steps!.length - 1 ? 'var(--accent)' : undefined }}
                                >
                                  {step}
                                </span>
                                {s < item.steps!.length - 1 && <ChevronRight className="h-3 w-3 text-muted" aria-hidden="true" />}
                              </motion.span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}
