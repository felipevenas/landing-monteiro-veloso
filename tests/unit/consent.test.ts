import { describe, expect, it } from 'vitest';
import { createConsent, parseConsent } from '../../src/features/consent/domain/consent';

describe('consent', () => {
  it('cria e lê um consentimento válido', () => {
    const record = createConsent('granted', '2026-10');
    expect(record.decision).toBe('granted');
    expect(parseConsent(JSON.stringify(record))).toEqual(record);
  });

  it('rejeita JSON inválido e decisão desconhecida', () => {
    expect(parseConsent('não é json')).toBeNull();
    expect(
      parseConsent(JSON.stringify({ decision: 'talvez', version: '1', timestamp: 'x' })),
    ).toBeNull();
  });
});
