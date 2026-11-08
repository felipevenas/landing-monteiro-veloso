# Changelog 📋

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### 📝 Documentation

- Standardized `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `CHANGELOG.md`, the pull request and issue templates, and the comments in `.env.example` in English.
- Documented the verified stack, architecture, configuration, lead delivery modes, testing matrix, deployment runbook, governance, and known limitations.
- Preserved the Portuguese deep-dive documents under `docs/` for a follow-up translation pass. No application behavior, source code, dependencies, lockfiles, or production configuration changed.

### 🎨 Changed (2026-10-27)

- **Landing page copy revised**: new hero, trust/differentials strip, and deadlines section focused on guidance and individualized analysis.
- **Home differentials strip** aligned with the revised landing copy.
- **Contact email** updated across the site, footer, privacy policy, and the `mailto` form mode.

## [Unreleased snapshot — 2026-10-23]

### 🚀 Added

- **Google reviews** on the home page and landing page: rating, total count, and a carousel with curated comments, refreshed by `npm run fetch:reviews`.
- **Shared differentials strip**: individualized analysis, professional confidentiality, and direct contact.
- **Reviews section** on the vehicle repossession landing page.
- **Return-to-home icon** in the landing page header.

### 🎨 Changed

- **Leaner home page** with hero, practice areas, reviews, Instagram, location, and contact.
- **Focused vehicle repossession landing page**: compact timeline and removal of redundant sections (documents, process, differentials, and location).
- **Premium footer** with watermark, navigation, contact, and revised legal block.
- **Section headings** without numbering or em dashes.
- **Lawyer bio** with a new portrait, title, and shorter text.
- **Floating WhatsApp button** enlarged by 20%.

### 🔧 Fixed

- **Consent** remains resilient when `localStorage` is unavailable, with banner reopening and Consent Mode updates.
- **Instagram** loads only after consent, with fallback restoration on refusal.
- **Deployment**: Astro output (`dist`) configured for Vercel, and review validations added to `check:dist`.

## [1.0.0] — 2026-10-21

### 🚀 Added

- **Institutional site** (`/`): home page with practice areas, how it works, FAQ, service, location, and contact sections.
- **Campaign landing page** (`/defesa-busca-e-apreensao-veiculo/`): an independent vehicle repossession page with anchor navigation and its own SEO metadata.
- **Privacy policy** (`/politica-de-privacidade/`) and a real 404 page with `noindex`.
- **Contact form** with a React island (`client:visible`), validation for name, WhatsApp number, situation, and consent, plus honeypot, time-trap, and duplicate-submit blocking.
- **Two lead delivery modes**: `mailto` (default, no backend) and n8n webhook, selected through `PUBLIC_LEAD_DELIVERY`.
- **LGPD consent**: banner, `localStorage` (`mv_consent_v1`), Consent Mode v2 denied by default, and reopening through cookie preferences.
- **Analytics**: GTM/Noop strategy, events `click_whatsapp`, `form_submit`, and `scroll_75`, with no PII in the `dataLayer`.
- **Attribution**: capture of UTMs, `gclid`, and `fbclid` in `sessionStorage` (`mv_attribution_v1`), included in the lead payload.
- **SEO**: canonical URLs, Open Graph/Twitter metadata, JSON-LD (`LegalService`, `Person`, `WebSite`, `WebPage`, `BreadcrumbList`, `FAQPage`), sitemap, and robots.
- **Content and UX**: Brazil coverage map generated from CC0 data, office map loaded on click, native FAQ, and a floating WhatsApp button.
- **Design system**: Tailwind tokens in `src/styles/global.css`, editorial typography (Playfair Display + Manrope), and two visual rhythms (light home, dark landing page).
- **Build gates**: `check:launch` (required content and environment values) and `check:dist` (charset, 404, sitemap, canonical, JSON-LD, H1, placeholders, and files).
- **Tests**: Vitest for domain/application logic and Playwright for E2E, responsiveness, consent, and the contact form.
- **Repository governance**: `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md`, `.editorconfig`, `.github/` (issue/PR templates and CI/label workflows), and the multi-agent ecosystem in `.agents/`.

### 🔒 Security

- No secrets in the bundle: only `PUBLIC_*` variables are exposed.
- GTM gated by opt-in; Consent Mode v2 starts denied.
- External links use `rel="noopener noreferrer"`.
- `.htaccess` provides HTTPS, non-`www` redirects, a real 404, compression, cache policy, and security headers.
- HMAC deduplication and rate limiting delegated to n8n.

### 📝 Documentation

- `docs/architecture.md`, `docs/design.md`, `docs/deploy.md`, `docs/n8n-contract.md`, `docs/qa.md`, and the ADRs under `docs/decisions/`.
