'use client';

import { ArrowUp, Mail } from 'lucide-react';
import { site } from '@/content/site';
import { useSite } from '../providers';
import { GithubIcon, LinkedinIcon } from '../ui/Icon';
import { Reveal, Section } from '../ui/Section';

export function Contact() {
  const { t } = useSite();
  const c = t.contact;
  const links = [
    site.email ? { label: c.email, value: site.email, href: `mailto:${site.email}`, icon: <Mail className="h-6 w-6" aria-hidden="true" /> } : null,
    { label: c.linkedin, value: 'luiz-henrique-algorithmic-trading', href: site.linkedin, icon: <LinkedinIcon className="h-6 w-6" /> },
    { label: c.github, value: `@${site.githubUser}`, href: site.githubUrl, icon: <GithubIcon className="h-6 w-6" /> },
  ].filter((l): l is NonNullable<typeof l> => l !== null);

  return (
    <Section id="contact" index="12" title={c.title} subtitle={c.subtitle}>
      <div className={`grid gap-4 ${links.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
        {links.map((l, i) => (
          <Reveal key={l.label} delay={i * 0.08}>
            <a
              href={l.href}
              target={l.href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-6 transition-all hover:-translate-y-1 hover:border-accent"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent transition-colors group-hover:bg-accent group-hover:text-bg">
                {l.icon}
              </span>
              <span className="min-w-0">
                <span className="block font-display text-lg font-semibold">{l.label}</span>
                <span className="block truncate font-mono text-xs text-muted">{l.value}</span>
              </span>
            </a>
          </Reveal>
        ))}
      </div>
      <p className="mt-6 text-sm text-muted">{c.note}</p>
    </Section>
  );
}

export function Footer() {
  const { t } = useSite();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:px-6">
        <p>
          © {new Date().getFullYear()} {site.name}. {t.footer.rights}
        </p>
        <p className="font-mono text-xs">{t.footer.built}</p>
        <a href="#hero" className="inline-flex items-center gap-1 hover:text-accent">
          <ArrowUp className="h-4 w-4" aria-hidden="true" /> {t.footer.top}
        </a>
      </div>
    </footer>
  );
}
