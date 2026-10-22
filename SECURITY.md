# Política de Segurança 🔒

A segurança e a privacidade são **pilares centrais** do site do **Monteiro Veloso Advogados**. A página coleta dados pessoais (nome e WhatsApp) por meio do formulário de contato, sob a LGPD, e representa publicamente um escritório de advocacia. Se você acredita ter encontrado uma vulnerabilidade, agradecemos sua ajuda em nos informar de maneira responsável.

---

## Versões Suportadas

Apenas a versão mais recente em `main` recebe atualizações ativas de segurança:

| Versão | Suportada          |
| ------ | ------------------ |
| 1.0.x  | :white_check_mark: |
| < 1.0  | :x:                |

---

## Relatando uma Vulnerabilidade

**Por favor, não relate vulnerabilidades de segurança publicamente em Issues abertas.**

Para relatar um problema de segurança:

1. Abra um relatório confidencial através do recurso de **[Private Vulnerability Reporting](https://github.com/felipevenas/landing-monteiro-veloso/security/advisories/new)** do GitHub. Caso o recurso não esteja habilitado no repositório, entre em contato diretamente com o mantenedor pelo perfil [@felipevenas](https://github.com/felipevenas), sem abrir uma Issue pública.
2. Descreva os detalhes da vulnerabilidade, passos para reprodução, impacto potencial e qualquer prova de conceito (PoC).
3. Nossa equipe analisará e responderá dentro de 48 horas úteis com uma avaliação e plano de mitigação.

Agradecemos aos pesquisadores de segurança que seguem as diretrizes de divulgação responsável (_Responsible Disclosure_).

---

## Escopo de Segurança do Produto

São consideradas vulnerabilidades de alta prioridade, entre outras:

- **Vazamento de segredos no bundle**: qualquer chave, token ou credencial exposta em variáveis `PUBLIC_*` ou no `dist/`.
- **Bypass de consentimento**: carregar GTM/analytics antes do opt-in, ignorar a recusa ou reativar o Consent Mode sem ação do usuário.
- **Exposição de PII**: nome, telefone, `gclid`/`fbclid` ou atribuição enviados ao `dataLayer`, a logs ou a terceiros não previstos.
- **XSS ou injeção** via payload do lead, parâmetros de UTM ou conteúdo renderizado.
- **Abuso do webhook n8n**: ausência de rate limit/deduplicação, CORS permissivo ou aceitação de payload forjado.
- **Headers e transporte**: ausência de HTTPS, redirecionamento `www` incorreto, CSP ineficaz ou `.htaccess` mal configurado.
- **Dependências vulneráveis** com impacto no build ou no runtime do site.
- **Manipulação de conteúdo jurídico**: alteração que introduza promessa de resultado, preço, desconto ou depoimento — violação das normas da OAB, tratada com a mesma prioridade.

A base normativa interna está em [`docs/qa.md`](docs/qa.md) (seção _Segurança_) e nas decisões em [`docs/decisions/`](docs/decisions).
