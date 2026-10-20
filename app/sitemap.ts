import type { MetadataRoute } from 'next';
import { locales } from '@/content';
import { site } from '@/content/site';
import { localePath } from '@/lib/i18n';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (l: (typeof locales)[number]) => `${site.siteUrl}${localePath(l)}`;
  const languages = { 'pt-BR': url('pt'), en: url('en'), es: url('es') };
  return locales.map((l) => ({
    url: url(l),
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: l === 'pt' ? 1 : 0.8,
    alternates: { languages },
  }));
}
