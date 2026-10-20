'use client';

import { animate, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { Metric } from '@/content/types';
import { formatNumber } from '@/lib/i18n';
import { useSite } from '../providers';

export function Counter({ metric, className = '' }: { metric: Metric; className?: string }) {
  const { t } = useSite();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();
  // SSR/sem JS mostra o valor final; no cliente zera e anima ao entrar na tela.
  const [display, setDisplay] = useState(metric.value ?? 0);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!reduce) setDisplay(0);
    setArmed(true);
  }, []);

  useEffect(() => {
    if (!armed || !inView || metric.value === null) return;
    if (reduce) {
      setDisplay(metric.value);
      return;
    }
    const controls = animate(0, metric.value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [armed, inView, metric.value, reduce]);

  return (
    <div className={className}>
      <span ref={ref} className="font-display text-4xl font-bold tabular-nums tracking-tight sm:text-5xl">
        {metric.value === null ? (
          <span className="text-muted">—</span>
        ) : (
          <>
            {metric.prefix}
            {formatNumber(display, t.meta.intl)}
            <span className="text-accent">{metric.suffix}</span>
          </>
        )}
      </span>
      <p className="mt-1 text-sm text-muted">{metric.label}</p>
    </div>
  );
}
