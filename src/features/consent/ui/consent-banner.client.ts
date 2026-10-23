import {
  getConsentState,
  reopenConsentBanner,
  setConsentDecision,
} from '../application/consent-service';

function bind(): void {
  const banner = document.querySelector<HTMLElement>('[data-consent-banner]');
  if (!banner) return;

  banner.querySelectorAll<HTMLElement>('[data-consent-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      const choice = button.dataset.consentChoice;
      if (choice === 'granted' || choice === 'denied') {
        setConsentDecision(choice);
      }
    });
  });

  document.querySelectorAll<HTMLElement>('[data-consent-open]').forEach((button) => {
    button.addEventListener('click', () => {
      reopenConsentBanner();
      banner.querySelector<HTMLElement>('[data-consent-choice="granted"]')?.focus();
    });
  });

  // Mantém o atributo coerente quando outra aba altera a decisão.
  window.addEventListener('storage', () => {
    const state = getConsentState();
    document.documentElement.setAttribute('data-consent', state);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bind, { once: true });
} else {
  bind();
}
