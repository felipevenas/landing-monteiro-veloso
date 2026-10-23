import { publicEnv } from '@/shared/config/env';
import {
  CONSENT_EVENT,
  createConsent,
  type ConsentDecision,
  type ConsentRecord,
  type ConsentState,
} from '../domain/consent';
import {
  clearStoredConsent,
  readStoredConsent,
  writeStoredConsent,
} from '../infrastructure/local-storage';

let memoryRecord: ConsentRecord | null = null;
let memoryOnly = false;

function currentRecord(): ConsentRecord | null {
  if (memoryOnly) {
    return memoryRecord?.version === publicEnv.consentVersion ? memoryRecord : null;
  }

  const stored = readStoredConsent();
  if (stored?.version === publicEnv.consentVersion) {
    memoryRecord = stored;
    return stored;
  }

  memoryRecord = null;
  return null;
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
  memoryRecord = record;
  memoryOnly = !writeStoredConsent(record);
  document.documentElement.setAttribute('data-consent', decision);
  window.dispatchEvent(
    new CustomEvent(CONSENT_EVENT, {
      detail: { decision, version: record.version, timestamp: record.timestamp },
    }),
  );
}

export function reopenConsentBanner(): void {
  memoryRecord = null;
  memoryOnly = false;
  clearStoredConsent();
  document.documentElement.setAttribute('data-consent', 'undecided');
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: { decision: 'undecided' } }));
}
