'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowRight, GraduationCap, RefreshCw } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { mql5Crossover } from '@/content/code-samples';
import { formatNumber, seeded } from '@/lib/i18n';
import { useSite } from '../providers';
import { CodeBlock } from '../ui/CodeBlock';
import { Reveal, Section } from '../ui/Section';

interface Candle {
  o: number;
  h: number;
  l: number;
  c: number;
}

function generate(seed: number, n = 72): Candle[] {
  const rnd = seeded(seed);
  const out: Candle[] = [];
  let price = 100;
  let drift = 0;
  for (let i = 0; i < n; i++) {
    if (i % 18 === 0) drift = (rnd() - 0.45) * 1.2;
    const o = price;
    const c = Math.max(20, o + drift + (rnd() - 0.5) * 3);
    const h = Math.max(o, c) + rnd() * 1.6;
    const l = Math.min(o, c) - rnd() * 1.6;
    out.push({ o, h, l, c });
    price = c;
  }
  return out;
}

function ema(values: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const out: number[] = [];
  values.forEach((v, i) => out.push(i === 0 ? v : v * k + out[i - 1] * (1 - k)));
  return out;
}

function CandleChart() {
  const { t } = useSite();
  const c = t.thesis.chart;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduce = useReducedMotion();
  const [seed, setSeed] = useState(7);

  const W = 720;
  const H = 300;
  const pad = 12;

  const { candles, fast, slow, signals, x, y, cw } = useMemo(() => {
    const candles = generate(seed);
    const closes = candles.map((k) => k.c);
    const fast = ema(closes, 9);
    const slow = ema(closes, 21);
    const signals: { i: number; type: 'entry' | 'exit' }[] = [];
    let inPosition = false;
    for (let i = 21; i < candles.length; i++) {
      const up = fast[i - 1] <= slow[i - 1] && fast[i] > slow[i];
      const down = fast[i - 1] >= slow[i - 1] && fast[i] < slow[i];
      if (up && !inPosition) {
        signals.push({ i, type: 'entry' });
        inPosition = true;
      } else if (down && inPosition) {
        signals.push({ i, type: 'exit' });
        inPosition = false;
      }
    }
    const max = Math.max(...candles.map((k) => k.h));
    const min = Math.min(...candles.map((k) => k.l));
    const cw = (W - pad * 2) / candles.length;
    const x = (i: number) => pad + i * cw + cw / 2;
    const y = (v: number) => pad + ((max - v) / (max - min)) * (H - pad * 2);
    return { candles, fast, slow, signals, x, y, cw };
  }, [seed]);

  const path = (arr: number[], from: number) =>
    arr
      .slice(from)
      .map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i + from).toFixed(1)},${y(v).toFixed(1)}`)
      .join(' ');

  const show = inView || reduce;
  const last = candles[candles.length - 1].c;

  return (
    <div ref={ref} className="rounded-3xl border border-line bg-surface p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="font-display text-lg font-semibold">{c.title}</h4>
          <p className="font-mono text-xs text-muted">
            {c.price}: {formatNumber(last, t.meta.intl, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs hover:border-accent"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> {c.replay}
        </button>
      </div>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[560px]" role="img" aria-label={`${c.title}. ${c.disclaimer}`}>
          {[0.25, 0.5, 0.75].map((p) => (
            <line key={p} x1={0} x2={W} y1={H * p} y2={H * p} stroke="var(--border)" strokeDasharray="3 5" />
          ))}
          <g key={`c-${seed}`}>
            {candles.map((k, i) => {
              const up = k.c >= k.o;
              const color = up ? 'var(--ok)' : 'var(--danger)';
              return (
                <motion.g
                  key={i}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={show ? { opacity: 1, scaleY: 1 } : undefined}
                  transition={{ delay: i * 0.018, duration: 0.25 }}
                  style={{ transformOrigin: `${x(i)}px ${y((k.o + k.c) / 2)}px` }}
                >
                  <line x1={x(i)} x2={x(i)} y1={y(k.h)} y2={y(k.l)} stroke={color} strokeWidth={1} />
                  <rect
                    x={x(i) - cw * 0.32}
                    width={cw * 0.64}
                    y={y(Math.max(k.o, k.c))}
                    height={Math.max(1, Math.abs(y(k.o) - y(k.c)))}
                    fill={color}
                    rx={1}
                  />
                </motion.g>
              );
            })}
          </g>
          {[
            { d: path(fast, 0), color: 'var(--accent)', delay: 0.8 },
            { d: path(slow, 0), color: 'var(--blue)', delay: 1 },
          ].map((l) => (
            <motion.path
              key={`${l.color}-${seed}`}
              d={l.d}
              fill="none"
              stroke={l.color}
              strokeWidth={2}
              initial={{ pathLength: 0 }}
              animate={show ? { pathLength: 1 } : undefined}
              transition={{ delay: l.delay, duration: 1.4, ease: 'easeInOut' }}
            />
          ))}
          {signals.map((s, n) => {
            const isEntry = s.type === 'entry';
            const k = candles[s.i];
            const py = isEntry ? y(k.l) + 14 : y(k.h) - 14;
            const tri = isEntry
              ? `${x(s.i)},${py - 8} ${x(s.i) - 6},${py + 2} ${x(s.i) + 6},${py + 2}`
              : `${x(s.i)},${py + 8} ${x(s.i) - 6},${py - 2} ${x(s.i) + 6},${py - 2}`;
            return (
              <motion.g
                key={`${seed}-${n}`}
                initial={{ opacity: 0, y: isEntry ? 8 : -8 }}
                animate={show ? { opacity: 1, y: 0 } : undefined}
                transition={{ delay: 1.6 + s.i * 0.018 }}
              >
                <polygon points={tri} fill={isEntry ? 'var(--ok)' : 'var(--danger)'} />
                <text
                  x={x(s.i)}
                  y={isEntry ? py + 16 : py - 10}
                  textAnchor="middle"
                  className="font-mono"
                  fontSize="10"
                  fill={isEntry ? 'var(--ok)' : 'var(--danger)'}
                >
                  {isEntry ? c.entry : c.exit}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
        <span className="flex items-center gap-2"><span className="h-0.5 w-5 bg-accent" />{c.fast}</span>
        <span className="flex items-center gap-2"><span className="h-0.5 w-5 bg-blue" />{c.slow}</span>
        <span className="flex items-center gap-2"><span className="text-ok">▲</span>{c.entry}</span>
        <span className="flex items-center gap-2"><span className="text-danger">▼</span>{c.exit}</span>
        <span className="ml-auto italic">{c.disclaimer}</span>
      </div>
    </div>
  );
}

export function Thesis() {
  const { t } = useSite();
  const th = t.thesis;
  return (
    <Section id="thesis" index="08" title={th.title} subtitle={th.subtitle} focus="hic">
      <Reveal>
        <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs">
          <GraduationCap className="h-4 w-4 text-accent" aria-hidden="true" /> {th.badge} · PUC Minas · MQL5
        </span>
      </Reveal>

      <CandleChart />

      <div className="mt-12">
        <Reveal>
          <h3 className="mb-5 font-display text-xl font-bold">{th.pipelineTitle}</h3>
        </Reveal>
        <ol className="flex flex-col gap-3 md:flex-row md:items-stretch">
          {th.pipeline.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.1} className="flex flex-1 items-center gap-3">
              <div className="flex-1 rounded-2xl border border-line bg-surface p-4">
                <span className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, '0')}</span>
                <p className="font-display font-semibold">{p.title}</p>
                <p className="text-sm text-muted">{p.desc}</p>
              </div>
              {i < th.pipeline.length - 1 && <ArrowRight className="hidden h-5 w-5 shrink-0 text-muted md:block" aria-hidden="true" />}
            </Reveal>
          ))}
        </ol>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="grid gap-4 sm:grid-cols-2">
          {th.blocks.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-line bg-surface p-5">
                <h4 className="font-display text-lg font-semibold">{b.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted">{b.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <CodeBlock code={mql5Crossover} lang="mql5" filename="RoboMedias.mq5" caption={th.mqlCaption} />
        </Reveal>
      </div>

      <Reveal>
        <p className="mt-10 rounded-2xl border-l-2 border-accent bg-surface p-5 text-muted">{th.continuation}</p>
      </Reveal>
    </Section>
  );
}
