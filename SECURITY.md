# Security Policy 🔒

Security and privacy are **core requirements** for the **Monteiro Veloso Advogados** website. The public contact form collects personal data (name and WhatsApp number) under LGPD, and the site publicly represents a law firm. If you believe you have found a vulnerability, we appreciate responsible disclosure.

---

## Supported Versions

Only the latest version on `main` receives active security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## Reporting a Vulnerability

**Please do not report security vulnerabilities publicly in open issues.**

1. Open a confidential report through GitHub **[Private Vulnerability Reporting](https://github.com/felipevenas/landing-monteiro-veloso/security/advisories/new)**.
2. If that feature is unavailable, contact the maintainer directly through [@felipevenas](https://github.com/felipevenas), without opening a public issue.
3. Describe the vulnerability, reproduction steps, potential impact, and any proof of concept (PoC).
4. We will respond within **48 business hours** with an assessment and a mitigation plan.

We thank security researchers who follow responsible disclosure.

---

## Security Scope

The following are considered high-priority vulnerabilities:

- **Secret exposed in the bundle**: any key, token, or credential present in `PUBLIC_*` variables or in `dist/`.
- **Consent bypass**: loading GTM/analytics before opt-in, ignoring a refusal, or re-enabling Consent Mode without user action.
- **PII exposure**: name, phone number, `gclid`/`fbclid`, or attribution data sent to the `dataLayer`, logs, or unexpected third parties.
- **XSS or injection** through the lead payload, UTM parameters, or rendered content.
- **n8n webhook abuse**: missing rate limiting/deduplication, permissive CORS, or acceptance of forged payloads.
- **Headers and transport**: missing HTTPS, an incorrect `www` redirect, ineffective CSP, or a misconfigured `.htaccess`.
- **Vulnerable dependencies** with an impact on the build or the runtime of the site.
- **Legal content manipulation**: a change that introduces a promise of result, price, discount, or testimonial — an OAB compliance violation treated with the same priority.

The internal normative baseline is in [`docs/qa.md`](docs/qa.md) (Security section) and in [`docs/decisions/`](docs/decisions).

---

## Resolution Process

1. We confirm the report and classify its impact.
2. We prepare the fix in a controlled environment with tests.
3. We publish the fix on `main` and record it in [`CHANGELOG.md`](CHANGELOG.md).
4. We credit the researcher, if desired, after the fix.

Thank you for helping keep the site and its visitors safe.
