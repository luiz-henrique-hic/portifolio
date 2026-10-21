// Dados globais (não traduzidos). Edite aqui.

// TODO: troque pelo seu usuário real do GitHub.
export const GITHUB_USER = 'luizh-cpe';

export const site = {
  name: 'Luiz Henrique',
  githubUser: GITHUB_USER,
  githubUrl: `https://github.com/${GITHUB_USER}`,
  linkedin: 'https://www.linkedin.com/in/luiz-henrique-algorithmic-trading',
  // TODO: e-mail profissional de contato (deixe '' para esconder o botão de e-mail).
  email: '',
  // URL pública final, sem barra no fim. O workflow do GitHub Pages define NEXT_PUBLIC_SITE_URL.
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || `https://${GITHUB_USER.toLowerCase()}.github.io/portifolio`).replace(/\/$/, ''),
  // TODO: coloque os PDFs em public/cv/ e marque true quando existirem.
  cv: { pt: false, en: false, es: false },
  // Ano em que entrou na CPE Tecnologia (usado para calcular "anos de casa").
  cpeSince: 2011,
  // Ano da promoção a Gerente de TI (usado para calcular "anos de liderança").
  leadershipSince: 2019,
} as const;

export const isGithubConfigured = !GITHUB_USER.startsWith('SEU_');
