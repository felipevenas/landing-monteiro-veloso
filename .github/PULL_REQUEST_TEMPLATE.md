# Descrição do Pull Request

Por favor, inclua um resumo das alterações realizadas e quais problemas ou funcionalidades foram abordados.

---

## Tipo de Alteração

- [ ] 🚀 Nova funcionalidade (`feature`)
- [ ] 🐞 Correção de bug (`bug fix`)
- [ ] 🔒 Correção/endurecimento de segurança (`security`)
- [ ] 🔧 Refatoração de código sem alteração funcional (`refactor`)
- [ ] 📝 Atualização de documentação (`docs`)
- [ ] 🧪 Testes e QA (`test`)
- [ ] 🎨 Ajuste visual, responsividade ou acessibilidade (`enhancement`)
- [ ] ⚙️ Ajustes de infraestrutura, CI/CD ou governança (`ci/cd`, `governance`)

## Como foi testado?

Por favor, descreva as validações executadas para verificar suas alterações:

- [ ] **Lint e Tipos:** `npm run lint` e `npm run typecheck` sem erros.
- [ ] **Testes Unitários:** `npm test` passou 100%.
- [ ] **E2E:** `npm run test:e2e` passou (quando o fluxo foi alterado).
- [ ] **Build:** `npm run build` (ou `npm run build:preview` com placeholders) concluiu.
- [ ] **Responsividade:** validei em 320, 390, 768, 1024 e 1440 px.

## Checklist de Qualidade, LGPD e OAB

- [ ] Meu código respeita as fronteiras de camadas de [`docs/architecture.md`](docs/architecture.md) e o lint não foi silenciado.
- [ ] Realizei uma auto-revisão detalhada do meu próprio código.
- [ ] Mantive o GTM bloqueado antes do opt-in e o Consent Mode v2 negado por padrão.
- [ ] Nenhum PII (nome, telefone, `gclid`/`fbclid`) é enviado ao `dataLayer` ou a logs.
- [ ] Nenhum segredo foi adicionado a variáveis `PUBLIC_*` ou ao bundle.
- [ ] O conteúdo permanece conforme as normas da OAB: sem promessa de resultado, preço, desconto ou depoimento.
- [ ] Campos pendentes continuam usando `ConfigField` e não renderizam `[PREENCHER]`.
- [ ] Atualizei a documentação e o `CHANGELOG.md` conforme necessário.

## Evidências

_Cole logs do terminal, saídas de teste, capturas de tela ou excertos relevantes que comprovem a mudança._
