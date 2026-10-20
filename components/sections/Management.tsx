'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import type { Card } from '@/content/types';
import { useSite } from '../providers';
import { CardGrid } from '../ui/Cards';
import { Counter } from '../ui/Counter';
import { Icon } from '../ui/Icon';
import { Reveal, Section } from '../ui/Section';
import { Tabs } from '../ui/Tabs';

function AreasRadial() {
  const { t } = useSite();
  const reduce = useReducedMotion();
  const areas = t.management.ops.areas;
  const [active, setActive] = useState(0);
  const current = areas[active];
  const radius = 40; // % do container

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="relative mx-auto aspect-square w-full max-w-[420px]">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--border)" strokeDasharray="1 1.5" strokeWidth="0.3" />
          {areas.map((_, i) => {
            const a = (i / areas.length) * Math.PI * 2 - Math.PI / 2;
            const x = 50 + radius * Math.cos(a);
            const y = 50 + radius * Math.sin(a);
            return (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={x}
                y2={y}
                stroke={i === active ? 'var(--accent)' : 'var(--border)'}
                strokeWidth={i === active ? 0.6 : 0.3}
                style={{ transition: 'stroke 0.3s' }}
              />
            );
          })}
        </svg>
        <div className="absolute left-1/2 top-1/2 flex h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-accent/50 bg-surface text-center">
          <span className="font-display text-3xl font-bold text-accent sm:text-4xl">7</span>
          <span className="px-2 text-[10px] leading-tight text-muted sm:text-xs">{t.management.ops.role}</span>
        </div>
        {areas.map((area, i) => {
          const a = (i / areas.length) * Math.PI * 2 - Math.PI / 2;
          const left = 50 + radius * Math.cos(a);
          const top = 50 + radius * Math.sin(a);
          const isActive = i === active;
          return (
            <button
              key={area.name}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-pressed={isActive}
              className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-2xl border px-2 py-2 text-[11px] font-medium transition-all sm:px-3 sm:text-xs ${
                isActive ? 'scale-110 border-accent bg-accent text-bg shadow-lg' : 'border-line bg-surface text-fg hover:border-accent/60'
              }`}
              style={{ left: `${left}%`, top: `${top}%` }}
            >
              <Icon name={area.icon} className="h-4 w-4" />
              {area.name}
            </button>
          );
        })}
      </div>

      <div>
        <p className="mb-3 font-mono text-xs text-muted">{t.management.ops.areasHint}</p>
        <AnimatePresence mode="wait">
          <motion.div
            key={current.name}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-line bg-surface p-6"
            aria-live="polite"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Icon name={current.icon} />
              </span>
              <h4 className="font-display text-2xl font-bold">{current.name}</h4>
            </div>
            <ul className="mt-5 space-y-3">
              {current.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Phase({
  level,
  role,
  period,
  scope,
  responsibilities,
  deliveries,
  impact,
  extra,
}: {
  level: number;
  role: string;
  period: string;
  scope: string;
  responsibilities: string[];
  deliveries: Card[];
  impact: string;
  extra?: React.ReactNode;
}) {
  const { t } = useSite();
  const L = t.management.labels;
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 rounded-3xl border border-line bg-surface p-6 sm:flex-row sm:items-center sm:p-8">
        <div className="flex items-end gap-1" aria-hidden="true">
          {[0, 1].map((s) => (
            <span
              key={s}
              className={`w-6 rounded-t-md ${s <= level ? 'bg-accent' : 'bg-surface-2'}`}
              style={{ height: 20 + s * 22 }}
            />
          ))}
        </div>
        <div className="flex-1">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">{period}</p>
          <h3 className="font-display text-2xl font-bold sm:text-3xl">{role}</h3>
          <p className="mt-2 max-w-3xl text-muted">
            <span className="font-semibold text-fg">{L.scope}: </span>
            {scope}
          </p>
        </div>
      </div>

      {extra}

      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <h4 className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">{L.responsibilities}</h4>
          <ul className="space-y-3">
            {responsibilities.map((r) => (
              <li key={r} className="flex gap-3 text-sm leading-relaxed sm:text-base">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">{L.deliveries}</h4>
          <CardGrid cards={deliveries} cols={2} />
        </div>
      </div>

      <div className="flex gap-4 rounded-2xl border border-ok/30 bg-ok/5 p-5">
        <TrendingUp className="h-5 w-5 shrink-0 text-ok" aria-hidden="true" />
        <p>
          <span className="font-semibold">{L.impact}: </span>
          {impact}
        </p>
      </div>
    </div>
  );
}

export function Management() {
  const { t } = useSite();
  const m = t.management;
  return (
    <Section id="management" index="03" title={m.title} subtitle={m.subtitle} focus="gestor">
      <Tabs
        label={m.title}
        items={[
          {
            key: 'ops',
            label: m.tabs.ops,
            content: (
              <Phase
                level={1}
                {...m.ops}
                extra={
                  <div>
                    <h4 className="mb-6 font-display text-xl font-semibold">{m.ops.areasTitle}</h4>
                    <AreasRadial />
                  </div>
                }
              />
            ),
          },
          { key: 'it', label: m.tabs.it, content: <Phase level={0} {...m.it} /> },
        ]}
      />

      <div className="mt-20">
        <Reveal>
          <h3 className="mb-6 font-display text-2xl font-bold">{m.styleTitle}</h3>
        </Reveal>
        <CardGrid cards={m.style} cols={4} />
      </div>

      <div className="mt-20">
        <Reveal>
          <h3 className="font-display text-2xl font-bold">{m.metricsTitle}</h3>
          <p className="mt-1 text-sm text-muted">{m.metricsNote}</p>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-6 rounded-3xl border border-line bg-surface p-6 sm:p-8 md:grid-cols-5">
          {m.metrics.map((metric) => (
            <Counter key={metric.label} metric={metric} />
          ))}
        </div>
      </div>
    </Section>
  );
}
