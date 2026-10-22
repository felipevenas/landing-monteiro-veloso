# Contrato do webhook n8n

Endpoint público consumido pelo formulário da landing page **quando `PUBLIC_LEAD_DELIVERY=webhook`**.

> Sem webhook configurado, o formulário usa o modo `mailto` (abre o aplicativo de e-mail do cliente com `site.email` como destinatário). Ver `docs/decisions/ADR-002-entrega-do-lead.md`.

## Requisição

```http
POST {PUBLIC_N8N_WEBHOOK_URL}
Content-Type: application/json
Accept: application/json
```

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
    "utm_medium": "cpc",
    "utm_campaign": "busca-apreensao",
    "utm_content": "anuncio-1",
    "utm_term": "advogado busca e apreensao",
    "gclid": "...",
    "fbclid": "...",
    "landing_page": "/defesa-busca-e-apreensao-veiculo/",
    "referrer": "https://www.google.com/",
    "captured_at": "2026-10-20T11:59:58.000Z"
  },
  "source": "lp-busca-apreensao",
  "page": "/defesa-busca-e-apreensao-veiculo/",
  "submitted_at": "2026-10-20T12:00:01.000Z",
  "idempotency_key": "8f0e0d3a-..."
}
```

### Valores de `situation`

- `apreendido`
- `notificacao`
- `atraso`
- `outro`

## Respostas

| Status              | Significado                                 |
| ------------------- | ------------------------------------------- |
| `200`, `201`, `202` | Lead aceito. O frontend mostra confirmação. |
| `400`, `422`        | Payload inválido.                           |
| `429`               | Rate limit.                                 |
| `5xx`               | Falha temporária.                           |

Resposta recomendada:

```json
{ "id": "lead_123", "status": "accepted" }
```

## CORS

O navegador envia `Content-Type: application/json`, o que gera preflight `OPTIONS`.

```http
Access-Control-Allow-Origin: https://monteiroveloso.com
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Accept
Access-Control-Max-Age: 600
```

Não use `Access-Control-Allow-Credentials: true`; o frontend envia `credentials: 'omit'`.

Se o CORS não for possível, o fallback documentado é enviar `text/plain` (sem preflight) e parsear o JSON no n8n. O código atual usa `application/json`; altere apenas se necessário e teste o preflight.

## Regras no n8n

1. Validar campos obrigatórios e formatos; rejeitar payloads fora do contrato.
2. Normalizar/validar telefone em E.164.
3. Deduplicar por HMAC do telefone + janela de tempo (segredo só no servidor).
4. Aplicar rate limit por IP/telefone (Cloudflare ou n8n).
5. Gravar em Google Sheets/CRM com `idempotency_key`.
6. Notificar a equipe (Gmail/WhatsApp) sem expor dados sensíveis em canais abertos.
7. Registrar consentimento (versão, data/hora) para fins de LGPD.
8. Não registrar nome/telefone em logs de erro; mascarar PII.
9. Definir retenção e expurgo conforme a política de privacidade.

## Segurança

- A URL do webhook é pública; não é um segredo.
- HMAC, tokens de CRM e credenciais ficam no n8n.
- Honeypot e time-trap no frontend são barreiras simples; a proteção real é rate limit + dedupe + validação.
- Se o webhook for abusado, rotacione a URL e atualize o build.
