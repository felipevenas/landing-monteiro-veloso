export {
  getConsentDecision,
  getConsentState,
  hasAnalyticsConsent,
  reopenConsentBanner,
  setConsentDecision,
} from './application/consent-service';
export { CONSENT_EVENT } from './domain/consent';
export type { ConsentDecision, ConsentRecord, ConsentState } from './domain/consent';
