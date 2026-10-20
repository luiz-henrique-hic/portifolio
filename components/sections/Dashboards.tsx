'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Info } from 'lucide-react';
import { useMemo, useState } from 'react';
import { formatCurrency, formatNumber, seeded } from '@/lib/i18n';
import { useSite } from '../providers';
import { Section } from '../ui/Section';
import { Tabs } from '../ui/Tabs';

// ---------- dados fictícios (determinísticos) ----------
const NAMES = ['Alfa', 'Beta', 'Gama', 'Delta', 'Épsilon', 'Zeta', 'Eta', 'Teta', 'Iota', 'Kapa', 'Lambda', 'Ômega'];

function useFake() {
  return useMemo(() => {
    const r = seeded(2024);
    const money = (min: number, max: number) => Math.round((min + r() * (max - min)) / 100) * 100;
    const orders = Array.from({ length: 22 }, (_, i) => ({
      id: 10230 + i * 7,
      client: NAMES[Math.floor(r() * NAMES.length)],
      value: money(8000, 160000),
      phase: Math.floor(r() * 5),
      days: Math.floor(r() * 9),
    }));
    const stock = Array.from({ length: 8 }, (_, i) => ({
      id: 20410 + i * 3,
      client: NAMES[(i * 5) % NAMES.length],
      item: Math.floor(r() * 6),
      value: money(12000, 140000),
      eta: 2 + Math.floor(r() * 20),
      status: Math.floor(r() * 4),
    }));
    const abc = NAMES.map((n) => ({ client: n, revenue: money(20000, 900000) * (r() < 0.25 ? 3 : 1) })).sort((a, b) => b.revenue - a.revenue);
    const budget = Array.from({ length: 12 }, () => money(180000, 240000));
    const actual = budget.map((b, i) => (i < 9 ? Math.round(b * (0.86 + r() * 0.22)) : null));
    return { orders, stock, abc, budget, actual };
  }, []);
}

// ---------- Kanban da Vida do Pedido ----------
function Kanban() {
  const { t } = useSite();
  const k = t.dashboards.kanban;
  const { orders } = useFake();
  const [filter, setFilter] = useState<'all' | 'urgent' | 'attention'>('all');
  const level = (d: number) => (d >= 6 ? 'urgent' : d >= 3 ? 'attention' : 'ok');
  const styles = {
    urgent: 'border-danger/60 bg-danger/10 text-danger',
    attention: 'border-warn/60 bg-warn/10 text-warn',
    ok: 'border-ok/40 bg-ok/10 text-ok',
  } as const;

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', 'urgent', 'attention'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`rounded-full border px-3 py-1 text-xs ${filter === f ? 'border-accent bg-accent-soft text-accent' : 'border-line text-muted'}`}
          >
            {f === 'all' ? `${orders.length} ${k.total}` : f === 'urgent' ? k.urgent : k.attention}
          </button>
        ))}
      </div>
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-5 lg:px-0">
        {k.phases.map((phase, p) => {
          const items = orders.filter((o) => o.phase === p && (filter === 'all' || level(o.days) === filter));
          return (
            <div key={phase} className="w-56 shrink-0 rounded-2xl border border-line bg-surface-2 p-3 lg:w-auto">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold">{phase}</span>
                <span className="rounded-full bg-surface px-2 font-mono text-[11px] text-muted">{items.length}</span>
              </div>
              <motion.ul layout className="space-y-2">
                {items.map((o) => {
                  const lv = level(o.days);
                  return (
                    <motion.li
                      layout
                      key={o.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-xl border border-line bg-surface p-2.5"
                    >
                      <div className="flex items-center justify-between font-mono text-[11px] text-muted">
                        <span>#{o.id}</span>
                        <span className={`rounded border px-1.5 ${styles[lv]}`}>{lv === 'urgent' ? k.urgent : lv === 'attention' ? k.attention : k.ok}</span>
                      </div>
                      <p className="mt-1 text-sm font-medium">
                        {t.dashboards.client} {o.client}
                      </p>
                      <div className="mt-1 flex flex-wrap justify-between gap-x-2 text-xs text-muted">
                        <span>{formatCurrency(o.value, t.meta.intl)}</span>
                        <span>
                          {o.days} {k.days}
                        </span>
                      </div>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Pedidos de venda — Estoque ----------
function StockOrders() {
  const { t } = useSite();
  const s = t.dashboards.stock;
  const { stock } = useFake();
  const [status, setStatus] = useState<number | null>(null);
  const colors = ['text-blue bg-blue-soft', 'text-warn bg-warn/10', 'text-accent bg-accent-soft', 'text-ok bg-ok/10'];
  const rows = stock.filter((r) => status === null || r.status === status);
  const eta = (days: number) => {
    const d = new Date(2026, 0, 1);
    d.setDate(d.getDate() + days * 3);
    return new Intl.DateTimeFormat(t.meta.intl, { day: '2-digit', month: 'short' }).format(d);
  };
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {s.statuses.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setStatus(status === i ? null : i)}
            aria-pressed={status === i}
            className={`rounded-full px-3 py-1 text-xs ${colors[i]} ${status === i ? 'ring-1 ring-current' : 'opacity-80'}`}
          >
            {label} · {stock.filter((r) => r.status === i).length}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[620px] text-left text-sm">
          <caption className="sr-only">{s.title}</caption>
          <thead className="bg-surface-2 font-mono text-[11px] uppercase tracking-wider text-muted">
            <tr>
              {s.columns.map((c) => (
                <th key={c} scope="col" className="px-4 py-3 font-medium">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-line bg-surface transition-colors hover:bg-surface-2">
                <td className="px-4 py-3 font-mono text-xs">#{r.id}</td>
                <td className="px-4 py-3">
                  {t.dashboards.client} {r.client}
                </td>
                <td className="px-4 py-3 text-muted">{s.items[r.item % s.items.length]}</td>
                <td className="px-4 py-3 tabular-nums">{formatCurrency(r.value, t.meta.intl)}</td>
                <td className="px-4 py-3 text-muted">{eta(r.eta)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${colors[r.status]}`}>{s.statuses[r.status]}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- Curva ABC ----------
function AbcCurve() {
  const { t } = useSite();
  const a = t.dashboards.abc;
  const { abc } = useFake();
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);
  const total = abc.reduce((s, c) => s + c.revenue, 0);
  let acc = 0;
  const rows = abc.map((c) => {
    acc += c.revenue;
    const cum = acc / total;
    return { ...c, cum, cls: cum <= 0.8 ? 'A' : cum <= 0.95 ? 'B' : 'C' };
  });
  const W = 640;
  const H = 260;
  const bw = W / rows.length;
  const max = rows[0].revenue;
  const clsColor = { A: 'var(--accent)', B: 'var(--blue)', C: 'var(--muted)' } as Record<string, string>;
  const line = rows.map((r, i) => `${i === 0 ? 'M' : 'L'}${i * bw + bw / 2},${H - r.cum * (H - 20)}`).join(' ');
  const h = hover !== null ? rows[hover] : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H + 24}`} className="h-auto w-full min-w-[480px]" role="img" aria-label={a.title}>
          {rows.map((r, i) => {
            const bh = (r.revenue / max) * (H - 30);
            return (
              <g key={r.client} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                <rect x={i * bw} y={0} width={bw} height={H} fill="transparent" />
                <motion.rect
                  x={i * bw + bw * 0.15}
                  width={bw * 0.7}
                  rx={4}
                  fill={clsColor[r.cls]}
                  opacity={hover === null || hover === i ? 0.9 : 0.35}
                  initial={{ y: H, height: 0 }}
                  whileInView={{ y: H - bh, height: bh }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.5 }}
                />
                <text x={i * bw + bw / 2} y={H + 16} textAnchor="middle" fontSize="10" fill="var(--muted)">
                  {r.client.slice(0, 5)}
                </text>
              </g>
            );
          })}
          <motion.path
            d={line}
            fill="none"
            stroke="var(--text)"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1 }}
          />
        </svg>
      </div>
      <div className="space-y-3">
        {(['A', 'B', 'C'] as const).map((c) => {
          const group = rows.filter((r) => r.cls === c);
          const share = group.reduce((s, r) => s + r.revenue, 0) / total;
          return (
            <div key={c} className="flex items-center justify-between rounded-xl border border-line bg-surface p-3">
              <span className="flex items-center gap-2 text-sm">
                <span className="h-3 w-3 rounded" style={{ background: clsColor[c] }} />
                {c === 'A' ? a.classA : c === 'B' ? a.classB : a.classC} · {group.length}
              </span>
              <span className="font-mono text-sm">{formatNumber(share, t.meta.intl, { style: 'percent', maximumFractionDigits: 0 })}</span>
            </div>
          );
        })}
        <div className="min-h-[76px] rounded-xl border border-dashed border-line p-3 text-sm" aria-live="polite">
          {h ? (
            <>
              <p className="font-semibold">
                {t.dashboards.client} {h.client}
              </p>
              <p className="text-muted">
                {a.revenue}: {formatCurrency(h.revenue, t.meta.intl)}
              </p>
              <p className="text-muted">
                {a.cumulative}: {formatNumber(h.cum, t.meta.intl, { style: 'percent', maximumFractionDigits: 1 })}
              </p>
            </>
          ) : (
            <p className="text-muted">— </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Orçado x Realizado ----------
function BudgetVsActual() {
  const { t } = useSite();
  const b = t.dashboards.budget;
  const { budget, actual } = useFake();
  const reduce = useReducedMotion();
  const [ytd, setYtd] = useState(false);
  const series = useMemo(() => {
    let sb = 0;
    let sa = 0;
    return budget.map((v, i) => {
      sb += v;
      if (actual[i] !== null) sa += actual[i]!;
      return ytd ? { b: sb, a: actual[i] !== null ? sa : null } : { b: v, a: actual[i] };
    });
  }, [budget, actual, ytd]);
  const max = Math.max(...series.map((s) => Math.max(s.b, s.a ?? 0)));
  const lastIdx = actual.findLastIndex((v) => v !== null);
  const variance = series[lastIdx].a! / series[lastIdx].b - 1;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-full border border-line p-0.5 text-xs">
          {[false, true].map((v) => (
            <button
              key={String(v)}
              type="button"
              onClick={() => setYtd(v)}
              aria-pressed={ytd === v}
              className={`rounded-full px-3 py-1 ${ytd === v ? 'bg-accent text-bg' : 'text-muted'}`}
            >
              {v ? b.ytd : b.monthly}
            </button>
          ))}
        </div>
        <p className="text-sm">
          {b.variance} ({b.months[lastIdx]}):{' '}
          <span className={`font-mono font-semibold ${variance > 0 ? 'text-danger' : 'text-ok'}`}>
            {formatNumber(variance, t.meta.intl, { style: 'percent', maximumFractionDigits: 1, signDisplay: 'always' })}
          </span>
        </p>
      </div>
      <div className="flex h-64 items-end gap-1.5 rounded-2xl border border-line bg-surface p-4 sm:gap-3">
        {series.map((s, i) => (
          <div key={b.months[i]} className="group relative flex h-full flex-1 flex-col justify-end">
            <div className="flex h-full items-end gap-0.5">
              <motion.div
                className="flex-1 rounded-t bg-blue/50"
                initial={{ height: 0 }}
                animate={{ height: `${(s.b / max) * 100}%` }}
                transition={{ duration: 0.5, delay: i * 0.03 }}
              />
              <motion.div
                className={`flex-1 rounded-t ${s.a !== null && s.a > s.b ? 'bg-danger/80' : 'bg-accent'}`}
                initial={{ height: 0 }}
                animate={{ height: `${((s.a ?? 0) / max) * 100}%` }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.03 }}
              />
            </div>
            <span className="mt-1 text-center font-mono text-[10px] text-muted">{b.months[i]}</span>
            <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-line bg-surface px-2 py-1 text-[11px] shadow-lg group-hover:block">
              {b.budget}: {formatCurrency(s.b, t.meta.intl, true)}
              <br />
              {b.actual}: {s.a !== null ? formatCurrency(s.a, t.meta.intl, true) : '—'}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-4 text-xs text-muted">
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-blue/50" />{b.budget}</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-accent" />{b.actual}</span>
      </div>
    </div>
  );
}

// ---------- Termômetro de metas ----------
function GoalThermometer() {
  const { t } = useSite();
  const g = t.dashboards.goal;
  const goal = 2_400_000;
  const [day, setDay] = useState(14);
  const businessDays = 22;
  const achieved = Math.round((goal * 1.04 * (day / businessDays) ** 0.95) / 1000) * 1000;
  const pct = Math.min(achieved / goal, 1.15);
  const color = pct >= 1 ? 'var(--ok)' : pct >= day / businessDays ? 'var(--accent)' : 'var(--danger)';

  return (
    <div className="grid items-center gap-8 sm:grid-cols-[120px_1fr]">
      <div className="relative mx-auto h-72 w-16">
        <div className="absolute inset-x-3 bottom-8 top-0 overflow-hidden rounded-t-full border border-line bg-surface-2">
          <motion.div
            className="absolute inset-x-0 bottom-0"
            style={{ background: color }}
            animate={{ height: `${Math.min(pct, 1) * 100}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          />
          {[0.25, 0.5, 0.75].map((m) => (
            <span key={m} className="absolute left-0 h-px w-2 bg-muted" style={{ bottom: `${m * 100}%` }} />
          ))}
        </div>
        <motion.div className="absolute bottom-0 left-0 h-16 w-16 rounded-full border border-line" animate={{ background: color }} />
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: g.goal, value: formatCurrency(goal, t.meta.intl, true) },
            { label: g.achieved, value: formatCurrency(achieved, t.meta.intl, true) },
            { label: g.remaining, value: formatCurrency(Math.max(goal - achieved, 0), t.meta.intl, true) },
          ].map((c) => (
            <div key={c.label} className="rounded-xl border border-line bg-surface p-3">
              <p className="text-xs text-muted">{c.label}</p>
              <p className="font-display text-lg font-bold tabular-nums sm:text-xl">{c.value}</p>
            </div>
          ))}
        </div>
        <p className="font-display text-5xl font-bold tabular-nums" style={{ color }}>
          {formatNumber(achieved / goal, t.meta.intl, { style: 'percent', maximumFractionDigits: 0 })}
        </p>
        <label className="block text-sm">
          <span className="text-muted">
            {g.simulate} — {businessDays - day} {g.daysLeft}
          </span>
          <input
            type="range"
            min={1}
            max={businessDays}
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--accent)]"
          />
        </label>
      </div>
    </div>
  );
}

export function Dashboards() {
  const { t } = useSite();
  const d = t.dashboards;
  return (
    <Section id="dashboards" index="07" title={d.title} subtitle={d.subtitle} focus="gestor">
      <p className="-mt-6 mb-8 inline-flex items-center gap-2 rounded-full border border-warn/40 bg-warn/10 px-3 py-1 text-xs text-warn">
        <Info className="h-3.5 w-3.5" aria-hidden="true" /> {d.disclaimer}
      </p>
      <div className="rounded-3xl border border-line bg-surface/60 p-4 sm:p-6">
        <Tabs
          label={d.title}
          items={[
            { key: 'kanban', label: d.tabs.kanban, content: <Kanban /> },
            { key: 'stock', label: d.tabs.stock, content: <StockOrders /> },
            { key: 'abc', label: d.tabs.abc, content: <AbcCurve /> },
            { key: 'budget', label: d.tabs.budget, content: <BudgetVsActual /> },
            { key: 'goal', label: d.tabs.goal, content: <GoalThermometer /> },
          ]}
        />
      </div>
    </Section>
  );
}
