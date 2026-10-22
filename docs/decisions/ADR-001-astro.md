# ADR 001 — Astro com ilha React

## Contexto

O projeto é um site de conteúdo com quatro rotas, SEO local, formulário e deploy estático na Hostinger. O briefing original citava Next.js; a decisão foi reavaliada antes do início do código.

## Decisão

Usar **Astro 7** com `output: 'static'` e **React apenas no formulário** (`client:visible`). Tailwind 4 via Vite. Sem servidor Node em produção.

## Motivos

- Conteúdo pronto no HTML, sem hidratar a página inteira.
- `astro:assets` gera AVIF/WebP no build.
- Sitemap, canonical e JSON-LD sem API de servidor.
- Deploy idêntico ao da Hostinger: `dist/` + `.htaccess`.
- React fica restrito à ilha, preservando o conhecimento do time.
- Zod foi removido do cliente para evitar ~200 KB extras; a validação é TypeScript puro no domínio.

## Consequências

- Não há SSR, middleware, route handlers ou ISR; não são necessários.
- O formulário precisa de `client:visible` e um marcador `data-hydrated` para testes.
- Consentimento e analytics são TS puro, sem contexto React global.
- Atualizações do Astro exigem atenção ao compilador Rust e ao `compressHTML`.
- TypeScript fica pinado em 6.0.3 até o ecossistema suportar a versão 7.

## Alternativas descartadas

- **Next.js static export**: mais peso de runtime e complexidade sem usar os recursos de servidor.
- **Vite + React SPA**: exigiria prerender manual para SEO e manteria React em toda a página.
- **HTML puro**: simples, mas pior manutenção para formulário, conteúdo e SEO estruturado.
