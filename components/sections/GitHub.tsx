'use client';

import { ExternalLink, Pin, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { featuredRepos, fallbackRepos } from '@/content/featured-repos';
import { isGithubConfigured, site } from '@/content/site';
import { formatDate, formatNumber } from '@/lib/i18n';
import { useSite } from '../providers';
import { GithubIcon } from '../ui/Icon';
import { Reveal, Section } from '../ui/Section';

interface Repo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  updated: string | null;
  url: string;
}

type Status = 'loading' | 'ok' | 'error' | 'rate' | 'unconfigured';

const CACHE_KEY = 'lh-gh-repos';

function fromFallback(): Repo[] {
  return fallbackRepos.map((r) => ({ ...r, url: `${site.githubUrl}/${r.name}` }));
}

export function GitHub() {
  const { t, locale } = useSite();
  const g = t.github;
  const [repos, setRepos] = useState<Repo[]>([]);
  const [status, setStatus] = useState<Status>(isGithubConfigured ? 'loading' : 'unconfigured');

  useEffect(() => {
    if (!isGithubConfigured) {
      setRepos(fromFallback());
      return;
    }
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        setRepos(JSON.parse(cached));
        setStatus('ok');
        return;
      }
    } catch {
      /* ignore */
    }
    const ctrl = new AbortController();
    fetch(`https://api.github.com/users/${site.githubUser}/repos?sort=updated&per_page=30&type=owner`, {
      signal: ctrl.signal,
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then(async (res) => {
        if (res.status === 403 || res.status === 429) throw new Error('rate');
        if (!res.ok) throw new Error('http');
        const data: Array<{
          name: string;
          description: string | null;
          language: string | null;
          stargazers_count: number;
          pushed_at: string;
          html_url: string;
          fork: boolean;
          archived: boolean;
        }> = await res.json();
        const list = data
          .filter((r) => !r.fork && !r.archived)
          .map((r) => ({
            name: r.name,
            description: r.description,
            language: r.language,
            stars: r.stargazers_count,
            updated: r.pushed_at,
            url: r.html_url,
          }));
        setRepos(list);
        setStatus('ok');
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(list));
        } catch {
          /* ignore */
        }
      })
      .catch((err: Error) => {
        if (err.name === 'AbortError') return;
        setRepos(fromFallback());
        setStatus(err.message === 'rate' ? 'rate' : 'error');
      });
    return () => ctrl.abort();
  }, []);

  const featuredNames = new Set(featuredRepos.map((f) => f.name));
  const featured = featuredRepos.map((f) => {
    const live = repos.find((r) => r.name === f.name);
    return {
      name: f.name,
      description: f.description[locale],
      language: live?.language ?? f.language ?? null,
      stars: live?.stars ?? 0,
      updated: live?.updated ?? null,
      url: live?.url ?? `${site.githubUrl}/${f.name}`,
    };
  });
  const recent = repos.filter((r) => !featuredNames.has(r.name)).slice(0, 6);

  const message =
    status === 'loading' ? g.loading : status === 'error' ? g.error : status === 'rate' ? g.rateLimit : status === 'unconfigured' ? g.notConfigured : null;

  return (
    <Section id="github" index="11" title={g.title} subtitle={g.subtitle}>
      {message && (
        <p className="-mt-6 mb-6 font-mono text-xs text-muted" role="status">
          {message}
        </p>
      )}

      {featured.length > 0 && (
        <>
          <h3 className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
            <Pin className="h-3.5 w-3.5" aria-hidden="true" /> {g.featured}
          </h3>
          <div className="mb-10 grid gap-4 md:grid-cols-2">
            {featured.map((r, i) => (
              <RepoCard key={r.name} repo={r} index={i} highlight />
            ))}
          </div>
        </>
      )}

      {recent.length > 0 && (
        <>
          <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted">{g.recent}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((r, i) => (
              <RepoCard key={r.name} repo={r} index={i} />
            ))}
          </div>
        </>
      )}
      {status === 'ok' && repos.length === 0 && <p className="text-muted">{g.empty}</p>}

      <a
        href={site.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm hover:border-accent"
      >
        <GithubIcon className="h-4 w-4" /> {g.viewProfile} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
      </a>
    </Section>
  );
}

function RepoCard({ repo, index, highlight }: { repo: Repo; index: number; highlight?: boolean }) {
  const { t } = useSite();
  return (
    <Reveal delay={Math.min(index * 0.05, 0.3)} className="h-full">
      <a
        href={repo.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex h-full flex-col rounded-2xl border bg-surface p-5 transition-all hover:-translate-y-1 ${
          highlight ? 'border-accent/40 hover:border-accent' : 'border-line hover:border-blue/60'
        }`}
      >
        <span className="flex items-center gap-2 font-mono text-sm font-semibold">
          <GithubIcon className="h-4 w-4 text-muted" /> {repo.name}
        </span>
        <span className="mt-2 flex-1 text-sm text-muted">{repo.description || t.github.noDescription}</span>
        <span className="mt-4 flex flex-wrap items-center gap-4 font-mono text-xs text-muted">
          {repo.language && (
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
              {repo.language}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5" aria-hidden="true" />
            {formatNumber(repo.stars, t.meta.intl)}
          </span>
          {repo.updated && (
            <span>
              {t.github.updated} {formatDate(repo.updated, t.meta.intl)}
            </span>
          )}
        </span>
      </a>
    </Reveal>
  );
}
