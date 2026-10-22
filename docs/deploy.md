# Deploy na Hostinger

O site é 100% estático. O build gera `dist/` com HTML, CSS, JS, imagens otimizadas, fontes, sitemap, `robots.txt` e `.htaccess`.

## 1. Antes do build

Preencha:

- `src/shared/config/site.ts`: horário, sala, coordenadas/Place ID (quando houver). OAB/BA já preenchida (78.424).
- `.env`: `PUBLIC_LEAD_DELIVERY` (`mailto` ou `webhook`), `PUBLIC_N8N_WEBHOOK_URL` (só no modo `webhook`), `PUBLIC_GTM_ID` e, se necessário, `PUBLIC_FORM_ENABLED`.

Confirme:

```bash
npm ci
npm run check:launch
npm run lint
npm test
npm run test:e2e
```

## 2. Build

```bash
npm run build
```

O comando:

1. executa `check:launch` (falha se OAB ou webhook obrigatório estiverem vazios);
2. roda `astro check`;
3. gera `dist/`;
4. executa `check:dist` (H1, canonical, JSON-LD, 404, sitemap, placeholders, arquivos).

Para revisar antes de ter todos os dados:

```bash
npm run build:preview
```

> `build:preview` é apenas para revisão. Ele permite placeholders e não deve ser publicado como produção.

## 3. Upload

1. Acesse o Gerenciador de Arquivos da Hostinger.
2. Abra `public_html/`.
3. Envie **o conteúdo de `dist/`**, não a pasta `dist`:
   - `index.html`
   - `404.html`
   - `defesa-busca-e-apreensao-veiculo/`
   - `politica-de-privacidade/`
   - `_astro/`
   - `fonts/`
   - `og/`
   - `scripts/`
   - `favicon.png`, `apple-touch-icon.png`
   - `robots.txt`, `sitemap-index.xml`, `sitemap-0.xml`
   - `.htaccess`
4. Confirme que o `.htaccess` foi enviado (arquivo oculto). Se o gerenciador não exibir arquivos ocultos, use FTP/SSH.
5. Permissões típicas: pastas `755`, arquivos `644`.

## 4. Domínio, HTTPS e canônico

- Domínio: `monteiroveloso.com`.
- Aponte `www` para o mesmo document root.
- Ative o SSL gratuito da Hostinger e force HTTPS.
- O `.htaccess` redireciona `http://` e `www.` para `https://monteiroveloso.com`.
- Só descomente o HSTS depois de confirmar que todos os subdomínios usam HTTPS:

```apache
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains" env=HTTPS
```

## 5. Testes pós-deploy

- `https://monteiroveloso.com/` → 200.
- `https://monteiroveloso.com/defesa-busca-e-apreensao-veiculo/` → 200.
- `https://monteiroveloso.com/politica-de-privacidade/` → 200.
- `https://monteiroveloso.com/pagina-inexistente/` → 404 real com a página personalizada.
- `http://monteiroveloso.com` → 301 para HTTPS.
- `https://www.monteiroveloso.com` → 301 para sem `www`.
- `/sitemap-index.xml` e `/sitemap-0.xml` → 200.
- `/robots.txt` → 200 e aponta para o sitemap.
- Formulário → no modo `mailto`, abre o e-mail do cliente com o destinatário e os dados preenchidos; no modo `webhook`, o lead chega ao n8n e retorna 202.
- Consentimento recusado → nenhuma requisição ao GTM.
- Consentimento aceito → GTM/GA4 no DebugView.
- Rich Results Test: `FAQPage`, `LegalService`, `BreadcrumbList` válidos.
- Lighthouse mobile: 95+ em Performance, Accessibility, Best Practices e SEO.
- `securityheaders.com`: headers esperados; CSP ainda em Report-Only.

## 6. Cache e rollback

- HTML: `no-cache, must-revalidate`.
- `/_astro/*` (hash): cache imutável de 1 ano.
- Fontes/imagens: cache longo; imagens públicas por 30 dias.
- `boot.js`: 5 minutos.

Rollback: mantenha uma cópia do `dist/` anterior e restaure os arquivos no `public_html`. Como o HTML não é cacheado por muito tempo, a troca é rápida.

## 7. CSP

A CSP está em **Report-Only** para não quebrar GTM/GA4 e o mapa antes da validação. Antes de promover para enforce:

1. adicione o host real do n8n em `connect-src` (apenas no modo `webhook`);
2. valide GTM/GA4 e Google Ads;
3. valide o iframe do Google Maps;
4. avalie remover `'unsafe-inline'` com nonce/GTM server-side.

## 8. Acentos e charset

O build é UTF-8. O `.htaccess` já inclui:

```apache
AddDefaultCharset UTF-8
AddCharset UTF-8 .html .css .js .json .xml .txt .svg
```

Se letras como `ç`, `ã` ou `õ` aparecerem quebradas:

1. confirme que os arquivos foram enviados sem conversão para ANSI;
2. confira o header `Content-Type: text/html; charset=UTF-8`;
3. rode `npm run check:dist` — ele falha em UTF-8 inválido e em `U+FFFD`.

## 9. Checklist de conteúdo OAB

- Número de OAB/BA visível no rodapé e no schema.
- Nenhuma promessa de resultado, preço, desconto ou consulta gratuita.
- Nenhum depoimento, lista de clientes ou caso ganho.
- Aviso informativo no rodapé.
- Fotos com direitos de uso confirmados.
- Política de privacidade revisada pelo escritório.
