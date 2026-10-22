# Guia de Contribuição 🤝

Agradecemos o seu interesse em contribuir para o **Monteiro Veloso Advogados**! Este documento orienta o processo de desenvolvimento e os padrões adotados para manter o código limpo, modular e — acima de tudo — **conforme a LGPD e as normas da OAB**.

> ⚠️ **Regra de ouro do projeto:** o site é a vitrine pública de um escritório de advocacia. Nenhuma contribuição pode enfraquecer o **consentimento LGPD**, a **entrega segura de leads** ou a **conformidade OAB** (sem promessa de resultado, preço, desconto ou depoimento). O build de produção é intencionalmente **estrito** e deve permanecer assim.

---

## 🛠️ Ambiente de Desenvolvimento

### 1. Clonar o Repositório

```bash
git clone https://github.com/felipevenas/landing-monteiro-veloso.git
cd landing-monteiro-veloso
```

### 2. Pré-requisitos

- **Node.js >= 22.22** (validado com Node 24.11).
- **npm >= 10**.
- Nenhum serviço de backend: o site é **100% estático** e o deploy é feito no `public_html` da Hostinger.

### 3. Instalar Dependências e Configurar o Ambiente

```bash
npm install
cp .env.example .env
npm run dev
```

Abra `http://localhost:4321`.

> As variáveis `PUBLIC_*` são embutidas no bundle em tempo de build. **Nunca** coloque segredos nelas. A URL do webhook é pública por natureza; a proteção real (rate limit, deduplicação por HMAC) fica no n8n.

---

## 🌿 Fluxo de Branches e Commits

Adotamos a convenção de **Git Flow** e **Conventional Commits**:

### Nomes de Branches

- `feature/<nome-da-funcionalidade>` (ex: `feature/secao-honorarios`)
- `fix/<nome-do-bug>` (ex: `fix/foco-formulario-mobile`)
- `docs/<nome-do-documento>` (ex: `docs/atualiza-guia-contribuicao`)
- `refactor/<nome-do-modulo>` (ex: `refactor/lead-gateway`)
- `chore/<tarefa>` (ex: `chore/atualiza-dependencias`)

### Padrão de Mensagens de Commit

- `feat: adiciona FAQ de revisional de contrato na home`
- `fix: impede duplo envio no formulário de contato`
- `docs: adiciona guia de contribuição e governança`
- `test: cobre fallback de WhatsApp em falha 5xx`
- `chore: atualiza labels do repositório`

---

## 🏛️ Diretrizes Arquiteturais

A arquitetura completa está em [`docs/architecture.md`](docs/architecture.md) e as decisões em [`docs/decisions/`](docs/decisions). Em resumo:

1. **Camadas com fronteiras reais.**
   - `domain` é **TypeScript puro**: sem Astro, React, Zod, `fetch` ou `window`.
   - `application` não conhece UI nem adaptadores concretos.
   - `ui` importa infraestrutura **apenas** via `composition.ts`.
   - `shared` não importa `features`, `pages` ou `layouts`.
   - Features se comunicam pelo `index.ts`. O ESLint aplica `no-restricted-imports` por glob.
2. **Páginas não têm regra de negócio.** `src/pages/` compõe layouts e features; conteúdo e lógica vivem em `src/features/`.
3. **Sem React fora da ilha.** A única ilha é o formulário de contato (`client:visible`). Não adicione framework client-side sem ADR.
4. **Design tokens centralizados.** Cores, tipografia e espaçamento ficam em `src/styles/global.css`. Não use valores mágicos no markup.
5. **Conteúdo é dado, não markup solto.** Dados do escritório, advogada, endereço e links ficam em `src/shared/config/site.ts`. Campos pendentes usam `ConfigField` + `publishable()` e **nunca** renderizam `[PREENCHER]`.
6. **Privacidade por padrão.**
   - O GTM **não carrega** antes do opt-in (`mv_consent_v1`).
   - Consent Mode v2 começa negado.
   - **Nenhum PII** no `dataLayer`; eventos permitidos: `click_whatsapp`, `form_submit`, `scroll_75`.
   - UTMs/gclid/fbclid ficam em `sessionStorage` (`mv_attribution_v1`).
7. **UTF-8 sem BOM.** O `check:dist` falha com bytes inválidos, `U+FFFD` ou ausência de `<meta charset="UTF-8">`. Nunca regrave arquivos em ANSI/Windows-1252.
8. **Testes obrigatórios.** Toda nova regra de domínio/aplicação exige teste em `tests/unit`. Mudanças de fluxo exigem cobertura E2E em `tests/e2e`.

---

## 🧪 Como Rodar os Gates de Qualidade

Execute a matriz completa antes de abrir um Pull Request (detalhes em [`docs/qa.md`](docs/qa.md)):

```bash
npm run check:launch   # campos/env obrigatórios
npm run lint           # ESLint com fronteiras de camadas
npm run typecheck      # astro check
npm test               # Vitest (domínio e aplicação)
npm run test:e2e       # Playwright (webhook mock + dev server em 4322)
npm run build          # build estrito de produção
```

Enquanto houver placeholders de go-live, use `npm run build:preview` no lugar de `npm run build`.

---

## 📬 Submetendo um Pull Request

1. Crie uma branch a partir de `main`.
2. Realize suas modificações mantendo lint, tipos e testes **100% verdes**.
3. Atualize o `CHANGELOG.md` com suas adições.
4. Abra o Pull Request preenchendo o template oficial com evidências e passos de teste.

Alterações que envolvam **formulário, consentimento, analytics, variáveis de ambiente ou headers de segurança** exigem revisão de segurança (ver [`SECURITY.md`](SECURITY.md)).
