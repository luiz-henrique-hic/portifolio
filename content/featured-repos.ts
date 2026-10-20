import type { Locale } from './types';

export interface FeaturedRepo {
  /** Nome exato do repositório no GitHub. */
  name: string;
  language?: string;
  description: Record<Locale, string>;
}

// TODO: indique aqui os repositórios que devem aparecer fixados no topo da seção GitHub.
// Exemplo:
// {
//   name: 'portfolio',
//   language: 'TypeScript',
//   description: {
//     pt: 'Este portfólio: Next.js, trilíngue, exportação estática.',
//     en: 'This portfolio: Next.js, trilingual, static export.',
//     es: 'Este portafolio: Next.js, trilingüe, exportación estática.',
//   },
// },
export const featuredRepos: FeaturedRepo[] = [
  {
    name: 'portifolio',
    language: 'TypeScript',
    description: {
      pt: 'Este portfólio: Next.js, trilíngue (PT/EN/ES), exportação estática no GitHub Pages.',
      en: 'This portfolio: Next.js, trilingual (PT/EN/ES), static export on GitHub Pages.',
      es: 'Este portafolio: Next.js, trilingüe (PT/EN/ES), exportación estática en GitHub Pages.',
    },
  },
];

/** Lista exibida quando a API do GitHub falha ou atinge o limite. TODO: ajuste. */
export const fallbackRepos: { name: string; description: string | null; language: string | null; stars: number; updated: string | null }[] = [
  { name: 'portifolio', description: null, language: 'TypeScript', stars: 0, updated: null },
];
