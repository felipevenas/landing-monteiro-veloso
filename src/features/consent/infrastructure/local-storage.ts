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

export function writeStoredConsent(record: ConsentRecord): boolean {
  try {
    const store = storage();
    if (!store) return false;
    store.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
    return true;
  } catch {
    /* localStorage indisponível ou cheio: o estado em memória continua válido na sessão. */
    return false;
  }
}

export function clearStoredConsent(): void {
  try {
    storage()?.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    /* localStorage indisponível: nada a limpar. */
  }
}
