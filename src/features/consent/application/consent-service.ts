import { publicEnv } from '@/shared/config/env';
import {
  CONSENT_EVENT,
  createConsent,
  type ConsentDecision,
  type ConsentState,
} from '../domain/consent';
import { readStoredConsent, writeStoredConsent } from '../infrastructure/local-storage';

function currentRecord() {
  const record = readStoredConsent();
  return record?.version === publicEnv.consentVersion ? record : null;
}

export function getConsentState(): ConsentState {
  return currentRecord()?.decision ?? 'undecided';
}

export function getConsentDecision(): ConsentDecision | null {
  return currentRecord()?.decision ?? null;
}

export function hasAnalyticsConsent(): boolean {
  return getConsentDecision() === 'granted';
}

export function setConsentDecision(decision: ConsentDecision): void {
  const record = createConsent(decision, publicEnv.consentVersion);
  writeStoredConsent(record);
  document.documentElement.setAttribute('data-consent', decision);
  window.dispatchEvent(
    new CustomEvent(CONSENT_EVENT, {
      detail: { decision, version: record.version, timestamp: record.timestamp },
    }),
  );
}

export function reopenConsentBanner(): void {
  document.documentElement.setAttribute('data-consent', 'undecided');
}
