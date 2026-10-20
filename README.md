# Portfólio — Luiz Henrique

Portfólio profissional trilíngue (PT / EN / ES) de Luiz Henrique: Head de Operações na CPE Tecnologia e CTO da Motbot Crowdfunding.

Next.js (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion, com exportação estática (`output: 'export'`) para GitHub Pages ou Vercel.

## Rodar localmente

Requisitos: Node.js 20 ou mais recente.

```bash
npm install
npm run dev          # http://localhost:3000  (e /en, /es)
npm run build        # gera o site estático em out/
npm start            # serve a pasta out/ em http://localhost:3000
npm run typecheck    # checagem de tipos
```

## Estrutura

```
app/
  [[...locale]]/layout.tsx   # <html lang>, metadados, hreflang, Open Graph por idioma
  [[...locale]]/page.tsx     # gera /, /en e /es
  sitemap.ts · robots.ts     # sitemap.xml (3 idiomas) e robots.txt
  globals.css                # tokens de cor (tema escuro/claro) e Tailwind
content/
  types.ts                   # tipo Content compartilhado pelos 3 idiomas
  pt.ts · en.ts · es.ts      # TODO o texto do site
  site.ts                    # usuário do GitHub, LinkedIn, e-mail, currículos
  featured-repos.ts          # repositórios fixados (descrição nos 3 idiomas) + fallback
  code-samples.ts            # trechos ilustrativos de SQL / Java / Apex / MQL5
components/
  Portfolio.tsx · Nav.tsx · LocaleSuggest.tsx · providers.tsx
  sections/                  # uma seção por arquivo
  ui/                        # Section, Tabs, Cards, Counter, CodeBlock, Icon
lib/                         # helpers de i18n, formatação (Intl) e PRNG dos dados fictícios
public/                      # favicon.svg, cv/
assets/raw/                  # capturas originais — IGNORADAS pelo git, nunca publicar
```

## Editar o conteúdo

Todo o texto fica em `content/pt.ts`, `content/en.ts` e `content/es.ts`. Os três seguem o tipo `Content` de `content/types.ts`: se faltar uma chave em qualquer idioma, `npm run build` falha. Para incluir um campo novo, adicione-o primeiro em `types.ts` e depois preencha nos três arquivos.

- **Métricas**: `value: null` aparece como "—". Troque pelo número real; não há valores inventados.
- **Itens marcados com `TODO`**: busque por `TODO` no projeto para ver o que falta (lista abaixo).
- **Termos técnicos** (Sankhya, Salesforce, CPQ, Flow, trigger, procedure, CNAB, EDI, Skill) ficam iguais nos três idiomas.
- **Números, datas e moeda** são formatados com `Intl` conforme o idioma ativo.

### Pendências (`TODO`)

| Onde | O quê |
|------|-------|
| `content/site.ts` | `GITHUB_USER` (hoje `SEU_USUARIO_GITHUB`) e `email` |
| `content/site.ts` → `cv` | Marque `true` quando colocar `public/cv/cv-pt.pdf`, `cv-en.pdf` e `cv-es.pdf` |
| `content/*.ts` → `management.metrics` | Anos de liderança, pessoas lideradas, sistemas implantados, horas economizadas |
| `content/*.ts` → `management.it.responsibilities` | Tamanho atual da equipe de TI |
| `content/*.ts` → `management.style` | Revisar os textos dos princípios de gestão |
| `content/*.ts` → `stack.languages` | Nível de inglês e espanhol |
| `content/featured-repos.ts` | Repositórios fixados e lista de fallback |
| `app/[[...locale]]/layout.tsx` | Imagem Open Graph (`public/og.png`, 1200×630) |

## Idiomas

- Rotas: `/` (português, padrão), `/en`, `/es`. Todas são HTML estático, com `<html lang>`, `hreflang` e Open Graph do idioma.
- O seletor `PT | EN | ES` troca de idioma por navegação no cliente, sem recarregar a página.
- Na 1ª visita, se o idioma do navegador for diferente, aparece uma sugestão para trocar. A escolha fica salva em `localStorage`. Nas visitas seguintes, a raiz `/` redireciona para o idioma escolhido.

## Painéis com dados fictícios

A seção "Gestão à vista" recria os painéis (Kanban da Vida do Pedido, Pedidos — Estoque, Curva ABC, Orçado x Realizado e Termômetro de metas) como componentes React com **dados inventados** (gerador determinístico em `lib/i18n.ts`). As capturas reais ficam em `assets/raw/`, que está no `.gitignore`. Nunca publique essas imagens: elas têm nomes de clientes e valores reais.

## Publicar no GitHub Pages

O workflow `.github/workflows/deploy.yml` faz o build e publica a cada push na `main`. Ele descobre sozinho o caminho base (`/portfolio` ou raiz) e a URL final.

1. Crie o repositório no GitHub:
   - `SEU_USUARIO/portfolio` → site em `https://SEU_USUARIO.github.io/portfolio/`
   - ou `SEU_USUARIO/SEU_USUARIO.github.io` → site em `https://SEU_USUARIO.github.io/`
2. Troque `GITHUB_USER` em `content/site.ts`.
3. Dentro desta pasta, envie o código:

   ```bash
   git init -b main
   git add .
   git commit -m "feat: portfólio inicial"
   git remote add origin https://github.com/SEU_USUARIO/portfolio.git
   git push -u origin main
   ```

4. No GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
5. Acompanhe em **Actions** o workflow "Deploy to GitHub Pages". Quando terminar, o link aparece no job `deploy`.

### Vercel (alternativa)

Importe o repositório na Vercel. Ela detecta o Next.js; não defina `NEXT_PUBLIC_BASE_PATH`. Defina `NEXT_PUBLIC_SITE_URL` com a URL final para o sitemap e as metatags.

## Acessibilidade e desempenho

- Tema escuro por padrão, com alternador claro/escuro salvo em `localStorage`.
- `prefers-reduced-motion` é respeitado (`MotionConfig reducedMotion="user"` e CSS).
- Navegação com link "Pular para o conteúdo", abas acessíveis por teclado e indicador de seção ativa.
- Fontes via `next/font` (Space Grotesk e JetBrains Mono), sem requisições externas em tempo de execução.
