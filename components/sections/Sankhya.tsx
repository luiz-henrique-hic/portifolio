'use client';

import { motion } from 'framer-motion';
import { javaActionButton, sqlCommission } from '@/content/code-samples';
import { useSite } from '../providers';
import { CardGrid, CaseList } from '../ui/Cards';
import { CodeBlock } from '../ui/CodeBlock';
import { Reveal, Section } from '../ui/Section';
import { Tabs } from '../ui/Tabs';

export function Steps({ steps }: { steps: { title: string; desc: string }[] }) {
  return (
    <div className="relative">
    <span aria-hidden="true" className="absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-accent via-blue to-transparent md:block" />
    <ol className="relative grid gap-4 md:grid-cols-4">
      {steps.map((s, i) => (
        <Reveal as="li" key={s.title} delay={i * 0.1}>
          <div className="relative h-full rounded-2xl border border-line bg-surface p-5">
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.12 }}
              className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent font-mono text-sm font-bold text-bg"
            >
              {i + 1}
            </motion.span>
            <h4 className="font-display text-lg font-semibold">{s.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
          </div>
        </Reveal>
      ))}
    </ol>
    </div>
  );
}

export function Sankhya() {
  const { t } = useSite();
  const s = t.sankhya;
  return (
    <Section id="sankhya" index="04" title={s.title} subtitle={s.subtitle} focus="hic">
      <Tabs
        label={s.title}
        items={[
          {
            key: 'reports',
            label: s.tabs.reports,
            content: (
              <div className="space-y-8">
                <CardGrid cards={s.reports} cols={3} />
                <CodeBlock code={sqlCommission} lang="sql" filename="comissao_escalonada.sql" caption={s.sqlCaption} />
              </div>
            ),
          },
          {
            key: 'impl',
            label: s.tabs.implementation,
            content: (
              <div className="space-y-6">
                <p className="max-w-3xl text-lg">
                  <span className="font-mono text-sm text-muted">Delphi (MGE) → </span>
                  <span className="font-semibold text-accent">Sankhya W / OM</span>
                  <br />
                  <span className="text-muted">{s.implementation.intro}</span>
                </p>
                <Steps steps={s.implementation.steps} />
              </div>
            ),
          },
          {
            key: 'auto',
            label: s.tabs.automations,
            content: (
              <div className="space-y-8">
                <CaseList items={s.automations} />
                <CodeBlock code={javaActionButton} lang="java" filename="LiberarPedido.java" caption={s.javaCaption} />
              </div>
            ),
          },
          { key: 'params', label: s.tabs.params, content: <CardGrid cards={s.params} cols={2} /> },
          { key: 'custom', label: s.tabs.custom, content: <CardGrid cards={s.custom} cols={3} /> },
        ]}
      />
    </Section>
  );
}
