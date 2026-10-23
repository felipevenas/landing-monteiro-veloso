# QA e aceite

## Gates automáticos

```bash
npm run check:launch
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

`build:preview` substitui `build` enquanto houver placeholders.

## Matriz mínima

### Rotas e conteúdo

- `/`, `/defesa-busca-e-apreensao-veiculo/`, `/politica-de-privacidade/` e 404.
- Um H1 por página.
- Home com as seções `#areas`, `#avaliacoes`, `#instagram`, `#localizacao` e `#contato` (uma de cada), avaliações do Google e mapa do escritório sob clique.
- Faixa de confiança com “Escritório em Salvador”, “Sigilo profissional” e “Análise individualizada” visível na landing.
- Botão flutuante de WhatsApp verde, visível no mobile após o consentimento (>= 44 px, dentro da viewport). O botão do header permanece na paleta navy.
- Header, footer, links de WhatsApp, e-mail, telefone, mapa e horário “Segunda a sexta, das 8h às 16h30”.
- Home sem FAQ e sem âncoras órfãs (`#escritorio`, `#como-funciona`, `#duvidas`, `#atendimento`).
- Nenhum `[PREENCHER]` no `dist` de produção.
- Nenhuma promessa de resultado, preço ou desconto.

### SEO

- Title <= 60 e description <= 160.
- Canonical absoluto com barra final.
- OG/Twitter com imagem 1200x630 existente.
- JSON-LD válido: `LegalService`, `Person`, `WebSite`, `WebPage` na home; `BreadcrumbList` e `FAQPage` na landing e na privacidade.
- FAQPage da landing idêntico ao FAQ visível (7 perguntas).
- Sem `aggregateRating`, `review` ou `priceRange`.
- Sitemap sem 404; robots aponta para o sitemap.
- 404 com `noindex`.
- `lang="pt-BR"`.

### Responsividade

Testado em 320, 360, 390, 768, 1024, 1280, 1366, 1440, 1920 e 2560 px:

- sem overflow horizontal;
- header sem sobreposição;
- mapa com texto e botão dentro do card;
- formulário e checkbox legíveis;
- botões com área de toque >= 44 px;
- botões secundários (`outline`/`outline-light`) com borda >= 3:1 (token `--color-border-interactive`);
- anel de foco dos campos em `--color-blue-600` (6,06:1), nunca removido sem substituto;
- imagens sem distorção/CLS.

### Formulário

- Validação de nome (aceita “Ana”), WhatsApp com DDD, situação e consentimento.
- Honeypot e time-trap.
- Duplo clique bloqueado.
- Sucesso em 200/201/202 (modo `webhook`).
- Erro de rede/timeout/429/5xx com fallback de WhatsApp (modo `webhook`).
- Modo `mailto`: abre o aplicativo de e-mail com destinatário `site.email`, assunto e corpo preenchidos (nome, WhatsApp, situação, página, consentimento e referência); tela final orienta o envio e mantém o WhatsApp como alternativa.
- UTMs preservadas no payload.
- `source` por página: `home` na home, `lp-busca-apreensao` na landing.
- Nenhum PII no `dataLayer`.
- Foco no primeiro erro e na confirmação.

### Consentimento

- GTM não carrega antes do opt-in.
- Aceite persiste após reload.
- Recusa persiste e pode ser revista.
- “Preferências de cookies” reabre o banner.
- Sem flash do banner (atributo definido no `<head>`).
- Sem JS: conteúdo e WhatsApp continuam acessíveis; analytics não carrega.

### Acessibilidade

- Teclado: skip link, header, formulário, mapa e carrossel do Instagram.
- Foco visível.
- Contraste AA.
- Labels, `aria-invalid`, `aria-describedby`, `role=alert`.
- `prefers-reduced-motion`.
- Reflow em 320 px e zoom 200%.
- Iframe do mapa com `title`.
- O carrossel do Instagram só carrega o `embed.js` depois do consentimento e quando a seção entra na viewport.

### Performance

- LCP < 2,5 s em mobile 4G.
- INP < 200 ms.
- CLS < 0,1.
- JS da ilha só hidrata perto do formulário (`client:visible`).
- GTM só depois do consentimento.
- Mapa só ao clicar.
- Imagens AVIF/WebP com dimensões.

### Segurança

- Nenhum segredo no bundle.
- `.htaccess` com HTTPS, non-www, 404, compressão, cache e headers.
- CSP em Report-Only validada.
- Links externos com `rel="noopener noreferrer"`.
- CORS restrito ao domínio.
- Rate limit + dedupe no n8n.

## Pós-deploy

- Lighthouse mobile e desktop.
- Rich Results Test e Schema Validator.
- Search Console: sitemap enviado, inspeção de URL.
- GA4 DebugView com aceite e recusa.
- Lead real no n8n e no CRM/Sheets.
- Backup do `dist` anterior.

## Bloqueios de go-live

- Webhook n8n ausente/sem CORS (apenas no modo `webhook`).
- Placeholders no `dist`.
- Revisão jurídica da política de privacidade.
- Direitos de imagem não confirmados.
