'use client';

import { useSite } from '../providers';
import { Icon } from '../ui/Icon';
import { Reveal, Section } from '../ui/Section';

export function Infra() {
  const { t } = useSite();
  return (
    <Section id="infra" index="09" title={t.infra.title} subtitle={t.infra.subtitle} focus="hic" compact>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {t.infra.items.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.04}>
            <div className="group flex h-full items-start gap-3 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-blue/60">
              <span className="text-blue">
                <Icon name={item.icon} className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-muted">{item.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
