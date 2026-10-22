# Arquitetura

## Visão geral

O site é uma aplicação Astro estática. Cada rota é composta por layouts e features; não há lógica de negócio em `pages/`. A única ilha React é o formulário de contato.

```text
pages/  →  layouts/  →  features/<feature>/ui  →  features/<feature>/application
                                                   ↘ domain
                                                   ↘ infrastructure (via composition)
shared/  ←  usado por todas as camadas, sem importar features/pages
```

## Camadas de uma feature

| Camada           | Responsabilidade                           | Pode importar                    |
| ---------------- | ------------------------------------------ | -------------------------------- |
| `domain`         | Tipos, regras puras, Result                | shared/domain                    |
| `application`    | Casos de uso, portas, validação de entrada | domain, shared, ports            |
| `infrastructure` | Adaptadores (n8n, localStorage)            | application, domain              |
| `ui`             | Astro/React, acessibilidade, estados       | domain, application, composition |
| `composition.ts` | Composition root do adaptador              | infrastructure + application     |
| `index.ts`       | API pública da feature                     | exports seletivos                |

## Features

- `busca-apreensao`: conteúdo, seções e SEO da LP.
- `home`: conteúdo e seções da home (hero, áreas, escritório, processo, diferenciais, FAQ, localização e contato).
- `privacy`: texto da política.
- `contact-form`: formulário, validação, entrega do lead (`mailto` ou n8n), estados. A seção `ui/ContactFormSection.astro` é compartilhada por home e LP e recebe a copy e a `source` por props.
- `consent`: decisão LGPD, storage, banner, evento `mv:consent`.
- `analytics`: Strategy GTM/Noop, Consent Mode, eventos.
- `attribution`: captura e leitura de UTMs em sessionStorage.
- `whatsapp`: URL e botão flutuante.
- `map`: placeholder e carregamento sob clique.

## Entrega do lead

`contact-form` expõe uma porta `LeadGateway` com dois adaptadores, escolhidos em `composition.ts` conforme `leadDeliveryMode` (`PUBLIC_LEAD_DELIVERY`):

- `infrastructure/mailto-lead.gateway.ts` — padrão quando não há webhook; monta a mensagem e abre o e-mail do cliente.
- `infrastructure/n8n-lead.gateway.ts` — `POST` para o webhook.

A montagem da mensagem fica em `application/lead-message.ts` (TS puro, sem `window`), testada em `tests/unit/mailto.test.ts`.

## Fronteiras

- `domain` não conhece Astro, React, Zod, `fetch` ou `window`.
- `application` não importa infraestrutura nem UI.
- `ui` importa infraestrutura apenas via `composition.ts`.
- Features se comunicam pelo `index.ts`; páginas/layouts compõem UI.
- `shared` não importa features, pages ou layouts.
- ESLint aplica `no-restricted-imports` por glob.

## Dados e build

- `src/shared/config/site.ts` centraliza dados do escritório, advogada, endereço, links e campos pendentes.
- O mapa do Brasil (`src/shared/ui/BrazilMap.astro`) usa `src/shared/ui/brazil-map.data.ts`, um SVG gerado de dados CC0 (Natural Earth via BenPortner/geojson-atlas) por `npm run generate:map`. Sem dependência em runtime.
- `ConfigField` + `publishable()` evitam renderizar `[PREENCHER]`.
- `scripts/check-launch.ts` bloqueia o build de produção com campos obrigatórios vazios.
- `scripts/check-dist.ts` valida o artefato final.

## Decisões de performance

- `client:visible` com `rootMargin: 300px` no formulário.
- Nenhum React fora da ilha.
- Sem Zod no cliente; validação pura.
- Imagens AVIF/WebP geradas no build; fonte local com preload.
- GTM após consentimento; mapa após clique.
- CSS Tailwind sem runtime.
