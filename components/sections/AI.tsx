'use client';

import { useInView, useReducedMotion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { TerminalLine } from '@/content/types';
import { useSite } from '../providers';
import { CardGrid, CaseList } from '../ui/Cards';
import { Counter } from '../ui/Counter';
import { Reveal, Section } from '../ui/Section';

const lineColor: Record<TerminalLine['kind'], string> = {
  info: 'text-blue',
  ok: 'text-ok',
  warn: 'text-warn',
  file: 'text-accent',
  muted: 'text-muted',
};

function FakeTerminal() {
  const { t } = useSite();
  const term = t.ai.terminal;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduce = useReducedMotion();
  const [typed, setTyped] = useState(0);
  const [shown, setShown] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setTyped(term.command.length);
      setShown(term.lines.length);
      return;
    }
    setTyped(0);
    setShown(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= term.command.length; i++) timers.push(setTimeout(() => setTyped(i), 300 + i * 35));
    const start = 300 + term.command.length * 35 + 400;
    term.lines.forEach((_, i) => timers.push(setTimeout(() => setShown(i + 1), start + i * 380)));
    return () => timers.forEach(clearTimeout);
  }, [inView, reduce, run, term]);

  const running = shown < term.lines.length;

  return (
    <div ref={ref} className="overflow-hidden rounded-2xl border border-line bg-[#07090d] font-mono text-[12.5px] text-[#d6dbe3] shadow-2xl sm:text-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="text-xs text-[#8f9aab]">{term.title}</span>
        </div>
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          disabled={running}
          className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-[#8f9aab] hover:text-white disabled:opacity-40"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> <span className="sr-only sm:not-sr-only">{term.replay}</span>
        </button>
      </div>
      <div className="min-h-[320px] space-y-1.5 p-4 sm:p-5" aria-live="polite">
        <p className="break-all">
          <span className="text-[#28c840]">luiz@cpe</span>
          <span className="text-[#8f9aab]">:~$ </span>
          {term.command.slice(0, typed)}
          {typed < term.command.length && <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-[#d6dbe3] align-middle" />}
        </p>
        {term.lines.slice(0, shown).map((line, i) => (
          <p key={`${run}-${i}`} className={`${lineColor[line.kind]} ${line.kind === 'file' ? 'pl-4' : ''}`}>
            {line.text}
          </p>
        ))}
        {!running && typed === term.command.length && (
          <p>
            <span className="text-[#28c840]">luiz@cpe</span>
            <span className="text-[#8f9aab]">:~$ </span>
            <span className="inline-block h-4 w-2 animate-pulse bg-[#d6dbe3] align-middle" />
          </p>
        )}
      </div>
    </div>
  );
}

export function AI() {
  const { t } = useSite();
  const ai = t.ai;
  return (
    <Section id="ai" index="06" title={ai.title} subtitle={ai.subtitle} focus="hic">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Reveal>
            <h3 className="mb-5 font-display text-2xl font-bold">{ai.skillsTitle}</h3>
          </Reveal>
          <CaseList items={ai.skills} single />
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Reveal>
            <FakeTerminal />
          </Reveal>
        </div>
      </div>

      <Reveal className="mt-16">
        <div className="relative overflow-hidden rounded-3xl border border-accent/40 bg-surface p-6 sm:p-10">
          <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
          <h3 className="font-display text-2xl font-bold sm:text-3xl">{ai.programTitle}</h3>
          <p className="mt-3 max-w-3xl text-muted">{ai.programDesc}</p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {ai.programStats.map((m) => (
              <Counter key={m.label} metric={m} />
            ))}
          </div>
          <div className="mt-8">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">{ai.deliverablesTitle}</p>
            <div className="flex flex-wrap gap-2">
              {ai.deliverables.map((d) => (
                <span key={d} className="rounded-full border border-line bg-surface-2 px-3 py-1 text-sm">
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mt-16 grid gap-10 lg:grid-cols-2">
        <div>
          <Reveal>
            <h3 className="mb-5 font-display text-xl font-bold">{ai.agentsTitle}</h3>
          </Reveal>
          <CardGrid cards={ai.agents} cols={2} />
        </div>
        <div>
          <Reveal>
            <h3 className="mb-5 font-display text-xl font-bold">{ai.toolsTitle}</h3>
          </Reveal>
          <CardGrid cards={ai.tools} cols={2} />
        </div>
      </div>
    </Section>
  );
}
