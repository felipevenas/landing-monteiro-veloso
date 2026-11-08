# Contributing Guide 🤝

Thank you for your interest in contributing to the **Monteiro Veloso Advogados** website. This document explains the development process and the standards that keep the codebase accessible, maintainable, privacy-preserving, and compliant with LGPD and OAB advertising rules.

> **Golden rule:** this site is the public face of a law firm. No contribution may weaken **LGPD consent**, **safe lead delivery**, or **OAB compliance** — no promise of result, price, discount, or testimonial that implies a guaranteed outcome. The production build is intentionally strict and must stay strict.

---

## 🛠️ Development Environment

### Prerequisites

- **Node.js >= 22.22.0** — required by the Astro version in the lockfile; validated with Node 24.11.
- **npm >= 10**.
- No backend service: the site is **100% static** and is deployed to Hostinger's `public_html`.

### Installation

```bash
git clone https://github.com/felipevenas/landing-monteiro-veloso.git
cd landing-monteiro-veloso
npm install
cp .env.example .env
npm run dev
```

The development server starts at **http://localhost:4321**. On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`.

Complete setup, architecture, and configuration details are in [`README.md`](README.md).

> Variables prefixed with `PUBLIC_` are embedded into the client bundle at build time. **Never** put secrets in them. The n8n webhook URL is public by nature; real protection (rate limiting, HMAC deduplication, validation) lives in the webhook workflow.

---

## 🌿 Branches and Commits

We use **trunk-based development** with short-lived branches created from `main` and merged through pull requests.

### Branch names

- `feat/feature-name`
- `bug/bug-name`
- `chore/task-name`
- `docs/document-name`
- `style/visual-or-formatting-adjustment`
- `refactor/refactoring-name`
- `test/test-name`

Examples: `feat/faq-revisional`, `bug/mobile-form-focus`, `docs/update-contributing`.

### Commit messages

Commit messages are written in **English** with Conventional Commit prefixes:

| Prefix      | Use                                           |
| ----------- | --------------------------------------------- |
| `feat:`     | New user-visible behavior or content          |
| `fix:`      | Bug, layout, or behavior fix                  |
| `refactor:` | Refactoring with no functional change         |
| `docs:`     | Documentation, README, or meaningful comments |
| `test:`     | Unit, integration, or E2E tests               |
| `style:`    | Purely visual or formatting adjustment        |
| `chore:`    | Build, dependencies, CI/CD, or configuration  |

Example: `fix: prevent duplicate contact form submission`.

---

## 🏛️ Architectural Guidelines

The full architecture is documented in [`docs/architecture.md`](docs/architecture.md), and decisions are recorded in [`docs/decisions/`](docs/decisions). In summary:

1. **Layers have real boundaries.**
   - `domain` is **pure TypeScript**: no Astro, React, Zod, `fetch`, or `window`.
   - `application` does not know UI or concrete adapters.
   - `ui` imports infrastructure **only** through `composition.ts`.
   - `shared` does not import `features`, `pages`, or `layouts`.
   - Features communicate through their public `index.ts`. ESLint enforces this with `no-restricted-imports`.
2. **Pages do not own business rules.** `src/pages/` composes layouts and features; content and logic live in `src/features/`.
3. **No React outside the island.** The contact form is the only island (`client:visible`). Do not add a client-side framework without an ADR.
4. **Design tokens are centralized.** Colors, typography, and spacing live in `src/styles/global.css`. Do not use magic values in markup.
5. **Content is data, not loose markup.** Firm, lawyer, address, and link data live in `src/shared/config/site.ts`. Pending fields use `ConfigField` + `publishable()` and **never** render `[PREENCHER]`.
6. **Privacy by default.**
   - GTM **does not load** before opt-in (`mv_consent_v1`).
   - Consent Mode v2 starts denied.
   - **No PII** in the `dataLayer`; allowed events are `click_whatsapp`, `form_submit`, and `scroll_75`.
   - UTMs, `gclid`, and `fbclid` stay in `sessionStorage` (`mv_attribution_v1`).
7. **UTF-8 without BOM.** `check:dist` fails on invalid bytes, `U+FFFD`, or a missing `<meta charset="UTF-8">`. Never re-encode files as ANSI/Windows-1252.
8. **New behavior needs tests.** Every new domain/application rule requires a test in `tests/unit`. Flow changes require E2E coverage in `tests/e2e`.

---

## 🧪 Quality Gates

Run the full matrix before opening a pull request. Details are in [`docs/qa.md`](docs/qa.md).

```bash
npm run format:check   # Prettier + Astro plugin
npm run lint           # ESLint with feature/layer boundaries
npm run typecheck      # astro check
npm test               # Vitest (domain and application)
npm run test:e2e       # Playwright (mock webhook + dev server on 4322)
npm run build          # strict production build
```

While launch placeholders remain, use `npm run build:preview` instead of `npm run build`. Never deploy a preview build to production.

---

## 🔐 Security and Privacy

- Never add secrets to `PUBLIC_*` variables, the repository, or the generated bundle.
- Keep the Google Places API key build-only and restricted to the Places API (New).
- Do not log names, phone numbers, `gclid`, or `fbclid` in analytics, error messages, or third-party calls.
- Keep GTM blocked until opt-in and Consent Mode v2 denied by default.
- Treat external links with `rel="noopener noreferrer"`.
- Do not weaken the honeypot, time-trap, or duplicate-submit protection without a security review.
- Report vulnerabilities through [`SECURITY.md`](SECURITY.md), never in a public issue.

---

## 📬 Submitting a Pull Request

1. Create a short-lived branch from `main`.
2. Make the change and keep formatting, lint, types, unit tests, E2E tests, and the build green.
3. Update [`CHANGELOG.md`](CHANGELOG.md) when the change is user-visible or operationally relevant.
4. Fill in the pull request template with evidence and test steps.
5. Attach mobile and desktop screenshots for visual changes.
6. Wait for CI and review before merging.

Changes involving the **form, consent, analytics, environment variables, security headers, or legal copy** require explicit security/privacy review. Changes to public copy require an OAB compliance check.

---

## ✅ Definition of Done

- Behavior is described and covered by tests.
- No responsiveness, accessibility, or SEO regression.
- Loading, success, error, and fallback states are handled.
- Consent and analytics behavior remains opt-in.
- No secret or PII is exposed.
- Documentation and changelog are updated when applicable.
- CI is green and the pull request is approved.
