import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { getContent, locales } from '@/content';
import type { Locale } from '@/content/types';
import { site } from '@/content/site';
import { asset, localePath, THEME_STORAGE_KEY } from '@/lib/i18n';
import { resolveLocale } from '@/lib/locale';
import '../globals.css';

const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-space', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });

type Params = { locale?: string[] };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return [{ locale: [] }, { locale: ['en'] }, { locale: ['es'] }];
}

const absolute = (l: Locale) => `${site.siteUrl}${localePath(l)}`;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const { meta } = getContent(locale);
  return {
    title: meta.title,
    description: meta.description,
    authors: [{ name: site.name }],
    alternates: {
      canonical: absolute(locale),
      languages: {
        'pt-BR': absolute('pt'),
        en: absolute('en'),
        es: absolute('es'),
        'x-default': absolute('pt'),
      },
    },
    openGraph: {
      type: 'profile',
      title: meta.title,
      description: meta.description,
      url: absolute(locale),
      siteName: site.name,
      locale: meta.ogLocale,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => getContent(l).meta.ogLocale),
      // TODO: adicione public/og.png (1200x630) e descomente:
      // images: [{ url: `${site.siteUrl}/og.png`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title: meta.title, description: meta.description },
    icons: { icon: asset('/favicon.svg') },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#090c11' },
    { media: '(prefers-color-scheme: light)', color: '#f6f5f1' },
  ],
};

// Aplica o tema antes da pintura para evitar "flash". Escuro é o padrão.
const themeScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {
  const locale = resolveLocale((await params).locale);
  const { meta } = getContent(locale);
  return (
    <html lang={meta.htmlLang} data-theme="dark" suppressHydrationWarning className={`${space.variable} ${jetbrains.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Sem JavaScript: mostra tudo que seria revelado por animação */}
        <noscript>
          <style>{'main [style*="opacity"]{opacity:1!important;transform:none!important}'}</style>
        </noscript>
      </head>
      <body className="min-h-screen overflow-x-hidden">{children}</body>
    </html>
  );
}
