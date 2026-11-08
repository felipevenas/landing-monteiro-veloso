# Pull Request Description

Include a summary of the changes, the problem or feature addressed, and the expected impact on the public site.

---

## Type of Change

- [ ] 🚀 New feature (`feature`)
- [ ] 🐞 Bug fix (`bug fix`)
- [ ] 🔒 Security or privacy hardening (`security`)
- [ ] 🔧 Refactoring with no functional change (`refactor`)
- [ ] 📝 Documentation (`docs`)
- [ ] 🧪 Tests and QA (`test`)
- [ ] 🎨 Visual, responsive, or accessibility adjustment (`enhancement`)
- [ ] ⚙️ Infrastructure, CI/CD, or governance (`ci/cd`, `governance`)

## How Was It Tested?

Describe the validations performed and how to reproduce them locally.

- [ ] **Formatting:** `npm run format:check` passed.
- [ ] **Lint and types:** `npm run lint` and `npm run typecheck` passed.
- [ ] **Unit tests:** `npm test` passed.
- [ ] **E2E:** `npm run test:e2e` passed (when a flow changed).
- [ ] **Build:** `npm run build` passed (or `npm run build:preview` while placeholders remain).
- [ ] **Responsiveness:** validated at 320, 390, 768, 1024, and 1440 px.
- [ ] **Affected flow:** home, landing page, contact form, consent, analytics, reviews, Instagram, map, privacy, or 404 was tested.
- [ ] Other tests performed:

## Quality, LGPD, and OAB Checklist

- [ ] My code respects the layer boundaries in [`docs/architecture.md`](../docs/architecture.md), and lint was not suppressed.
- [ ] I performed a detailed self-review of my own changes.
- [ ] GTM remains blocked before opt-in, and Consent Mode v2 starts denied by default.
- [ ] No PII (name, phone, `gclid`/`fbclid`) is sent to the `dataLayer` or logs.
- [ ] No secret was added to `PUBLIC_*` variables or the bundle.
- [ ] The content remains OAB-compliant: no promise of result, price, discount, or testimonial implying a guaranteed outcome.
- [ ] Pending fields still use `ConfigField` and never render `[PREENCHER]`.
- [ ] Lead delivery still works in the configured mode, with a WhatsApp fallback when applicable.
- [ ] I updated the documentation and [`CHANGELOG.md`](../CHANGELOG.md) when necessary.

## Visual Evidence

_If applicable, paste mobile and desktop screenshots, recordings, or terminal output demonstrating the change._

## Additional Notes

Add deployment notes, known trade-offs, or follow-up tasks for reviewers.
