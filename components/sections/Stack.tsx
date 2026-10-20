'use client';

import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';
import { useSite } from '../providers';
import { Icon } from '../ui/Icon';
import { Reveal, Section } from '../ui/Section';

export function Stack() {
  const { t } = useSite();
  const s = t.stack;
  return (
    <Section id="stack" index="10" title={s.title} subtitle={s.subtitle} focus="hic">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {s.groups.map((g, i) => (
          <Reveal key={g.title} delay={i * 0.06}>
            <div className="h-full rounded-2xl border border-line bg-surface p-5">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-accent">
                  <Icon name={g.icon} />
                </span>
                <h3 className="font-display font-semibold">{g.title}</h3>
              </div>
              <ul className="flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <motion.li
                    key={item}
                    whileHover={{ y: -2 }}
                    className="rounded-lg border border-line bg-surface-2 px-2.5 py-1 font-mono text-xs transition-colors hover:border-accent hover:text-accent"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface p-5">
          <Languages className="h-5 w-5 text-accent" aria-hidden="true" />
          <span className="font-display font-semibold">{s.languagesTitle}:</span>
          {s.languages.map((l) => (
            <span key={l.name} className="rounded-full border border-line px-3 py-1 text-sm">
              {l.name} <span className="text-muted">· {l.level}</span>
            </span>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
