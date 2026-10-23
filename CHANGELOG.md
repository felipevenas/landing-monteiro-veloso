# Changelog 📋

Todas as alterações notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/)
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [Não lançado] - 2026-10-23

### 🚀 Adicionado

- **Avaliações do Google** na home e na landing: nota, total e carrossel com comentários curados, com atualização via `npm run fetch:reviews`.
- **Faixa de diferenciais** compartilhada: análise individualizada, sigilo profissional e atendimento direto.
- **Seção de avaliações** na landing de busca e apreensão.
- **Ícone de retorno à home** no cabeçalho da landing.

### 🎨 Alterado

- **Home enxuta**, com hero, áreas de atuação, avaliações, Instagram, localização e contato.
- **Landing de busca e apreensão direta**: timeline compacta e remoção das seções redundantes (documentos, como funciona, diferenciais e localização).
- **Rodapé premium** com marca d'água, navegação, contato e bloco legal revisado.
- **Títulos de seção** sem numeração e sem travessão.
- **Bio da advogada** com novo retrato, título e texto resumido.
- **Botão flutuante do WhatsApp** 20% maior.

### 🔧 Corrigido

- **Consentimento** resiliente quando o `localStorage` está indisponível, com reabertura do banner e atualização do Consent Mode.
- **Instagram** carregado apenas após o consentimento, com restauração do fallback ao revogar.
- **Deploy**: saída do Astro (`dist`) configurada para a Vercel e validações de review no `check:dist`.

## [1.0.0] - 2026-10-21

### 🚀 Adicionado

- **Site institucional** (`/`): home com as seções escritório, áreas de atuação, como funciona, dúvidas, atendimento, localização e contato.
- **Landing page de campanha** (`/defesa-busca-e-apreensao-veiculo/`): página independente de busca e apreensão de veículo, com navegação por âncoras e SEO próprio.
- **Política de privacidade** (`/politica-de-privacidade/`) e página 404 real com `noindex`.
- **Formulário de contato** com ilha React (`client:visible`), validação de nome/WhatsApp/situação/consentimento, honeypot, time-trap e bloqueio de duplo envio.
- **Entrega de lead em dois modos**: `mailto` (padrão, sem backend) e `webhook` n8n, escolhidos por `PUBLIC_LEAD_DELIVERY`.
- **Consentimento LGPD**: banner, `localStorage` (`mv_consent_v1`), Consent Mode v2 negado por padrão e reabertura em “Preferências de cookies”.
- **Analytics**: Strategy GTM/Noop, eventos `click_whatsapp`, `form_submit` e `scroll_75`, sem PII no `dataLayer`.
- **Atribuição**: captura de UTMs, `gclid` e `fbclid` em `sessionStorage` (`mv_attribution_v1`), enviadas no payload do lead.
- **SEO**: canonical, Open Graph/Twitter, JSON-LD (`LegalService`, `Person`, `WebSite`, `WebPage`, `BreadcrumbList`, `FAQPage`), sitemap e robots.
- **Conteúdo e UX**: mapa de cobertura do Brasil gerado de dados CC0, mapa do escritório carregado sob clique, FAQ nativo e botão flutuante de WhatsApp.
- **Design system**: tokens Tailwind em `src/styles/global.css`, tipografia editorial (Playfair Display + Manrope) e dois ritmos visuais (home clara, LP escura).
- **Gates de build**: `check:launch` (campos/env obrigatórios) e `check:dist` (charset, 404, sitemap, canonical, JSON-LD, H1, placeholders e arquivos).
- **Testes**: Vitest para domínio/aplicação e Playwright para E2E, responsividade, consentimento e formulário.
- **Governança do repositório**: `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md`, `.editorconfig`, `.github/` (templates de Issue/PR e workflows de CI e labels) e o ecossistema multi-agente em `.agents/`.

### 🔒 Segurança

- Nenhum segredo no bundle: apenas variáveis `PUBLIC_*`.
- GTM condicionado ao opt-in; Consent Mode v2 inicia negado.
- Links externos com `rel="noopener noreferrer"`.
- `.htaccess` com HTTPS, redirecionamento para sem `www`, 404 real, compressão, cache e headers de segurança.
- Deduplicação por HMAC e rate limit delegados ao n8n.

### 📝 Documentação

- `docs/architecture.md`, `docs/design.md`, `docs/deploy.md`, `docs/n8n-contract.md`, `docs/qa.md` e ADRs em `docs/decisions/`.
