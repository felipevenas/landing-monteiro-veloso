import { publicEnv } from '@/shared/config/env';
import { pushCommand, pushToDataLayer } from './data-layer';

const GTM_SCRIPT_ID = 'mv-gtm';

function consentPayload(granted: boolean) {
  return {
    ad_storage: granted ? 'granted' : 'denied',
    ad_user_data: granted ? 'granted' : 'denied',
    ad_personalization: granted ? 'granted' : 'denied',
    analytics_storage: granted ? 'granted' : 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
  };
}

export function setDefaultConsent(): void {
  pushCommand('consent', 'default', {
    ...consentPayload(false),
    wait_for_update: 500,
  });
}

export function updateConsent(granted: boolean): void {
  pushCommand('consent', 'update', consentPayload(granted));
}

export function loadGtm(): void {
  if (!publicEnv.gtmId || document.getElementById(GTM_SCRIPT_ID)) return;

  setDefaultConsent();
  updateConsent(true);

  pushToDataLayer({ 'gtm.start': Date.now(), event: 'gtm.js' });

  const script = document.createElement('script');
  script.id = GTM_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(publicEnv.gtmId)}`;
  document.head.appendChild(script);
}
