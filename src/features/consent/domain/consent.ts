export type ConsentDecision = 'granted' | 'denied';
export type ConsentState = ConsentDecision | 'undecided';

export type ConsentRecord = {
  version: string;
  decision: ConsentDecision;
  timestamp: string;
};

export const CONSENT_EVENT = 'mv:consent';

export function parseConsent(raw: string | null): ConsentRecord | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<ConsentRecord>;
    if (
      (parsed.decision === 'granted' || parsed.decision === 'denied') &&
      typeof parsed.version === 'string' &&
      typeof parsed.timestamp === 'string'
    ) {
      return { version: parsed.version, decision: parsed.decision, timestamp: parsed.timestamp };
    }
  } catch {
    return null;
  }

  return null;
}

export function createConsent(decision: ConsentDecision, version: string): ConsentRecord {
  return {
    version,
    decision,
    timestamp: new Date().toISOString(),
  };
}
