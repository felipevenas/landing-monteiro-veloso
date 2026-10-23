import { CONSENT_EVENT, hasAnalyticsConsent } from '@/features/consent';
import { initAnalytics, trackEvent } from '../application/analytics';
import { updateConsent } from '../infrastructure/gtm';

const SCROLL_KEY = 'mv_scroll_75';

function bindWhatsAppTracking(): void {
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const link = target.closest<HTMLElement>('[data-wa]');
    if (!link) return;

    trackEvent('click_whatsapp', {
      location: (link.dataset.waLocation as 'header' | undefined) ?? 'final',
      page: window.location.pathname,
    });
  });
}

function bindScrollTracking(): void {
  let done = false;

  const check = () => {
    try {
      if (done || sessionStorage.getItem(SCROLL_KEY) === '1') return;
    } catch {
      return;
    }

    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;

    const progress = window.scrollY / scrollable;
    if (progress >= 0.75) {
      done = true;
      try {
        sessionStorage.setItem(SCROLL_KEY, '1');
      } catch {
        /* sem sessionStorage: o evento ainda é enviado uma vez por carregamento. */
      }
      trackEvent('scroll_75', { page: window.location.pathname });
    }
  };

  window.addEventListener('scroll', check, { passive: true });
  check();
}

function onConsentChange(event: Event): void {
  const detail = (event as CustomEvent<{ decision?: string }>).detail;
  if (detail?.decision === 'granted' && hasAnalyticsConsent()) {
    initAnalytics();
    return;
  }
  if (detail?.decision === 'denied' || detail?.decision === 'undecided') {
    updateConsent(false);
  }
}

function boot(): void {
  initAnalytics();
  bindWhatsAppTracking();
  bindScrollTracking();
  window.addEventListener(CONSENT_EVENT, onConsentChange);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
