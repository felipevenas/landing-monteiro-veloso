import { parseConsent, type ConsentRecord } from '../domain/consent';

export const CONSENT_STORAGE_KEY = 'mv_consent_v1';

function storage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readStoredConsent(): ConsentRecord | null {
  const store = storage();
  if (!store) return null;
  return parseConsent(store.getItem(CONSENT_STORAGE_KEY));
}

export function writeStoredConsent(record: ConsentRecord): void {
  storage()?.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
}
