# Monteiro Veloso Advogados

Site institucional e landing page de **busca e apreensão de veículo** para o escritório Monteiro Veloso Advogados, em Salvador/BA.

O projeto é 100% estático: o build gera `dist/` e o deploy é feito no `public_html` da Hostinger, sem Node no servidor.

## Stack

- **Astro 7.4.1** com `output: 'static'`, `trailingSlash: 'always'` e `build.format: 'directory'`.
- **React 19** apenas na ilha do formulário de contato (`client:visible`).
- **Tailwind CSS 4.3.3** com tokens em `src/styles/global.css`.
- **TypeScript 6.0.3** (pin intencional: `@astrojs/check` e `typescript-eslint` ainda não suportam TypeScript 7).
- **Vitest** para domínio e **Playwright** para E2E, responsividade, consentimento e formulário.
- Fontes locais: Playfair Display e Manrope (SIL Open Font License em `public/fonts`).

## Requisitos

- Node.js **>= 22.22** (o projeto foi validado com Node 24.11).
- npm >= 10.

> O `eslint-plugin-astro` declara suporte a Node 24.16+ e emite um aviso no Node 24.11. O lint funciona; ao atualizar o Node, o aviso desaparece.

## Como rodar

```bash
npm install
cp .env.example .env
npm run dev
```

Abra `http://localhost:4321`.

### Variáveis de ambiente

| Variável                 | Uso                                                                                     |
| ------------------------ | --------------------------------------------------------------------------------------- |
| `PUBLIC_LEAD_DELIVERY`   | `mailto` (abre o e-mail do cliente) ou `webhook` (POST para o n8n). Vazio = automático. |
| `PUBLIC_N8N_WEBHOOK_URL` | Endpoint público do webhook n8n que recebe os leads (modo `webhook`).                   |
| `PUBLIC_GTM_ID`          | ID do contêiner GTM (`GTM-XXXXXXX`). Sem ele, analytics fica em Noop.                   |
| `PUBLIC_FORM_ENABLED`    | `true`/`false`; desliga o formulário e mantém o fallback de WhatsApp.                   |
| `PUBLIC_CONSENT_VERSION` | Versão do texto de consentimento LGPD aceito no formulário.                             |
| `PUBLIC_N8N_TIMEOUT_MS`  | Timeout do POST, padrão `12000`.                                                        |

`PUBLIC_*` é embutido no bundle em tempo de build. **Nunca coloque segredos nelas.** A URL do webhook é pública por natureza; proteja o n8n com rate limit, validação e deduplicação.

## Dados obrigatórios antes do go-live

O build de produção (`npm run build`) chama `check:launch` e **falha** enquanto os campos obrigatórios estiverem vazios:

- `src/shared/config/site.ts` → `site.lawyer.oab` — **preenchido com OAB/BA 78.424**.
- `.env` → `PUBLIC_N8N_WEBHOOK_URL` **apenas no modo `webhook`** (`PUBLIC_LEAD_DELIVERY=webhook`). No modo `mailto`, o padrão, o destinatário é `site.email`.

Também são recomendados (avisos, não bloqueiam):

- horário de atendimento;
- sala/complemento;
- latitude, longitude e Place ID;
- `PUBLIC_GTM_ID`.

Para gerar um preview local com pendências:

```bash
npm run build:preview
```

O `check:launch` lista cada pendência e o `check:dist` valida o artefato final.

## Scripts

| Comando                 | O que faz                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------- |
| `npm run dev`           | Servidor de desenvolvimento.                                                        |
| `npm run build`         | Build de produção com `check:launch` + `astro check` + `check:dist`.                |
| `npm run build:preview` | Build liberado com placeholders, para revisão local.                                |
| `npm run preview`       | Serve o `dist/`.                                                                    |
| `npm run check:launch`  | Lista campos/env pendentes e bloqueia o build estrito.                              |
| `npm run check:dist`    | Verifica 404, sitemap, canonical, JSON-LD, H1, placeholders e arquivos.             |
| `npm run generate:map`  | Regenera o SVG do mapa do Brasil (dados CC0) em `src/shared/ui/brazil-map.data.ts`. |
| `npm run lint`          | ESLint com fronteiras de features/camadas.                                          |
| `npm run format`        | Prettier + plugin Astro.                                                            |
| `npm test`              | Testes unitários (Vitest).                                                          |
| `npm run test:e2e`      | Playwright com webhook mock e dev server em 4322.                                   |

## Direção visual

O conceito, os tokens e as decisões de responsividade estão em [`docs/design.md`](docs/design.md). Em resumo: editorial jurídico com tipografia serifada, réguas, fotos em cores originais e geometria reta; a home é clara e institucional, a landing é escura e de campanha.

## Rotas e navegação

- `/` é a página principal do escritório, com as seções `#escritorio`, `#areas`, `#como-funciona`, `#duvidas`, `#atendimento`, `#localizacao` e `#contato`. O header aponta para `/#escritorio`, `/#areas`, `/#duvidas`, `/#localizacao` e `/#contato`.
- A home inclui mapa de cobertura do Brasil (`#atendimento`), mapa do escritório (`#localizacao`) e o formulário de contato (`#contato`), além de processo, diferenciais e FAQ próprios.
- `/defesa-busca-e-apreensao-veiculo/` é uma landing independente, usada em campanhas. O header dela tem navegação própria por âncoras.
- A partir da home, o único link para a landing é **“Busca e apreensão de veículo”**, no rodapé. Não há CTA, card ou link de navegação para a LP no corpo da home.
- A home e a LP têm ritmos visuais distintos: a home é clara e institucional; a LP é escura e orientada à campanha.

## Organização

```text
src/
├─ pages/          # composição das rotas; sem lógica de negócio
├─ layouts/        # BaseLayout, LandingLayout, LegalLayout
├─ features/
│  ├─ busca-apreensao/  # conteúdo e seções da LP
│  ├─ home/             # home institucional
│  ├─ privacy/          # política
│  ├─ contact-form/     # domínio → aplicação → infraestrutura → UI React
│  ├─ consent/          # consentimento LGPD em TS puro
│  ├─ analytics/        # Strategy GTM/Noop e eventos
│  ├─ attribution/      # UTMs/gclid/fbclid em sessionStorage
│  ├─ whatsapp/         # links e botão flutuante
│  └─ map/              # mapa sob clique
└─ shared/         # config, SEO, UI primitives, domínio e estilos
```

Regras principais:

- `domain` é TypeScript puro (sem Astro, React, Zod, `fetch` ou `window`).
- `application` não conhece UI nem adaptadores concretos.
- `ui` importa infraestrutura apenas via `composition.ts`.
- Features se comunicam pelo `index.ts`; páginas e layouts podem compor componentes de UI.
- `shared` não importa features, pages ou layouts.

## Codificação e caracteres especiais

- Todo o conteúdo é UTF-8 sem BOM.
- O HTML declara `<meta charset="UTF-8">`; o `.htaccess` define `AddDefaultCharset UTF-8` e `AddCharset UTF-8` para HTML, CSS, JS, JSON, XML, TXT e SVG.
- `check:dist` falha se encontrar bytes inválidos ou o caractere de substituição `U+FFFD`, e exige o meta charset em todas as páginas.
- Se acentos aparecerem quebrados em um servidor, confirme o charset do arquivo e o header `Content-Type`; não regrave os arquivos em ANSI/Windows-1252.

## Formulário

O formulário valida os dados no cliente e entrega o lead de duas formas, escolhidas por `PUBLIC_LEAD_DELIVERY`:

- **`mailto`** (padrão quando não há webhook): monta a mensagem e abre o aplicativo de e-mail do cliente, com `site.email` como destinatário fixo. Não há confirmação de entrega — a tela final orienta o envio e oferece o WhatsApp como alternativa. Decisão em [`docs/decisions/ADR-002-entrega-do-lead.md`](docs/decisions/ADR-002-entrega-do-lead.md).
- **`webhook`**: envia `POST application/json` para o n8n, com deduplicação e rate limit no servidor.

### Modo webhook (n8n)

O payload enviado é:

```json
{
  "name": "Ana",
  "phone": "+5571999999999",
  "phone_display": "(71) 99999-9999",
  "situation": "apreendido",
  "consent": {
    "accepted": true,
    "version": "2026-10",
    "accepted_at": "2026-10-20T12:00:00.000Z"
  },
  "attribution": {
    "utm_source": "google",
    "utm_campaign": "busca-apreensao",
    "gclid": "...",
    "landing_page": "/defesa-busca-e-apreensao-veiculo/"
  },
  "source": "lp-busca-apreensao",
  "page": "/defesa-busca-e-apreensao-veiculo/",
  "submitted_at": "2026-10-20T12:00:01.000Z",
  "idempotency_key": "uuid"
}
```

- Respostas **200, 201 ou 202** são sucesso.
- `400/422` → validação; `429` → muitas tentativas; `5xx`/timeout → falha temporária.
- O navegador não envia segredos. A deduplicação por telefone (HMAC) e o rate limit ficam no n8n/Cloudflare.
- Contrato completo em [`docs/n8n-contract.md`](docs/n8n-contract.md).

### Modo mailto

A mensagem é montada em `application/lead-message.ts` (TS puro, testado) e inclui nome, WhatsApp, situação, página, a versão/data do consentimento LGPD e a chave de idempotência — o próprio e-mail serve como registro do consentimento. O adaptador que dispara a navegação é `infrastructure/mailto-lead.gateway.ts`.

## Consentimento e analytics

- O GTM **não carrega** antes do opt-in.
- Consent Mode v2 começa negado (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`).
- Eventos: `click_whatsapp`, `form_submit`, `scroll_75`; nenhum PII no `dataLayer`.
- A escolha fica em `localStorage` (`mv_consent_v1`) e pode ser revista em “Preferências de cookies”, no rodapé.
- UTMs, `gclid` e `fbclid` ficam em `sessionStorage` (`mv_attribution_v1`) e seguem no payload do lead.

## Deploy na Hostinger

Passo a passo em [`docs/deploy.md`](docs/deploy.md). Resumo:

1. Preencha os dados obrigatórios.
2. `npm run build`.
3. Envie **o conteúdo de `dist/`** para `public_html/` (incluindo `.htaccess`).
4. Confirme HTTPS, redirecionamento `www → sem www`, 404 real, sitemap e formulário.

## Conformidade OAB

O conteúdo evita promessa de resultado, preços, descontos, depoimentos, listas de clientes e captação sensacionalista. O rodapé identifica a advogada responsável e traz o aviso informativo. A revisão final do texto e a inclusão do número de OAB são obrigatórias antes da publicação.

## Pendências conhecidas

- Horário de atendimento e complemento/sala.
- Coordenadas/Place ID.
- URL do webhook n8n e CORS (só é necessária se a entrega for `webhook`; o padrão é `mailto`).
- GTM/GA4 e eventual conversão do Google Ads.
- Direitos de imagem das fotos e revisão da política de privacidade (encarregado/retenção).

Enquanto isso, `npm run build` falha de forma intencional e `npm run build:preview` permite navegar.
