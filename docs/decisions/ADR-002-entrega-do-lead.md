# ADR 002 — Entrega do lead por e-mail do cliente (mailto)

## Contexto

O formulário da landing envia o lead por `POST` para um webhook n8n. Como o site é estático e não há
servidor Node, qualquer integração (Supabase, Resend) exigiria manter os segredos fora do bundle — o
que só é possível com um intermediário (n8n ou Edge Function).

O escritório decidiu não manter integrações por ora e pediu que o envio do formulário abrisse o
aplicativo de e-mail do próprio cliente, com o e-mail do escritório como destinatário fixo.

## Decisão

Adotar um **gateway `mailto:`** como forma de entrega padrão, selecionável por
`PUBLIC_LEAD_DELIVERY`:

- `mailto` (padrão quando não há webhook): monta um `mailto:` com assunto e corpo prontos, usando
  `site.email` como destinatário, e abre o aplicativo de e-mail do cliente.
- `webhook`: mantém o `POST` para o n8n já especificado em `docs/n8n-contract.md`.

Sem a variável, a escolha é automática: `webhook` se `PUBLIC_N8N_WEBHOOK_URL` estiver definido;
caso contrário, `mailto`.

A montagem da mensagem fica em `application/lead-message.ts` (TypeScript puro e testável); o
adaptador `infrastructure/mailto-lead.gateway.ts` apenas dispara a navegação.

## Consequências

- Nenhum segredo no bundle; o site funciona sozinho, sem backend.
- **Não há confirmação de entrega**: o lead só existe depois que o cliente toca em "enviar". Por
  isso a tela de sucesso deixa de dizer "recebemos" e passa a orientar o envio, com fallback de
  WhatsApp.
- Se o cliente não tiver aplicativo de e-mail configurado, o `mailto:` pode não abrir nada — o
  fallback de WhatsApp é obrigatório na tela de sucesso.
- O próprio e-mail registra o consentimento (versão e data/hora) e a referência de idempotência,
  servindo como prova LGPD.
- Sem rate limit, dedupe ou validação no servidor; o honeypot e o time-trap do formulário são a
  única barreira, e o cliente pode editar a mensagem antes de enviar.
- O caminho do n8n permanece disponível para quando houver CRM, sem alterar o domínio do lead.

## Alternativas descartadas

- **Supabase direto do browser**: `anon key` pública, sem validação server-side, rate limit ou
  dedupe; dois caminhos de falha.
- **Resend direto do browser**: impossível, a API key é secreta.
- **Edge Function do Supabase como endpoint**: boa opção futura, mas mantém a integração que o
  escritório decidiu não adotar agora.
