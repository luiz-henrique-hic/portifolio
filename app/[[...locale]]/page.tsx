import { getContent, suggestions } from '@/content';
import { Portfolio } from '@/components/Portfolio';
import { resolveLocale } from '@/lib/locale';

export default async function Page({ params }: { params: Promise<{ locale?: string[] }> }) {
  const locale = resolveLocale((await params).locale);
  return <Portfolio locale={locale} content={getContent(locale)} suggestions={suggestions} />;
}
