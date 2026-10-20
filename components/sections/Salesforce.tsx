'use client';

import { apexTrigger } from '@/content/code-samples';
import { useSite } from '../providers';
import { CardGrid, CaseList } from '../ui/Cards';
import { CodeBlock } from '../ui/CodeBlock';
import { Section } from '../ui/Section';
import { Tabs } from '../ui/Tabs';

export function Salesforce() {
  const { t } = useSite();
  const s = t.salesforce;
  return (
    <Section id="salesforce" index="05" title={s.title} subtitle={s.subtitle} focus="hic">
      <Tabs
        label={s.title}
        items={[
          {
            key: 'automation',
            label: s.tabs.automation,
            content: (
              <div className="space-y-8">
                <CaseList items={s.automation} />
                <CodeBlock code={apexTrigger} lang="apex" filename="TaxaFinanciamento.trigger" caption={s.apexCaption} />
              </div>
            ),
          },
          { key: 'modules', label: s.tabs.modules, content: <CardGrid cards={s.modules} cols={3} /> },
          { key: 'custom', label: s.tabs.custom, content: <CardGrid cards={s.custom} cols={3} /> },
        ]}
      />
    </Section>
  );
}
