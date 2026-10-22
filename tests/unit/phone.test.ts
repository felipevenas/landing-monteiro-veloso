import { describe, expect, it } from 'vitest';
import {
  formatPhoneBR,
  formatPhoneInput,
  normalizePhone,
} from '../../src/features/contact-form/domain/phone';
import { validateName } from '../../src/features/contact-form/domain/name';

describe('phone', () => {
  it('normaliza números com DDD e nono dígito', () => {
    const result = normalizePhone('(71) 99999-9999');
    expect(result).toEqual({ ok: true, value: '+5571999999999' });
  });

  it('aceita +55 e descarta o prefixo', () => {
    const result = normalizePhone('+55 71 98888-7777');
    expect(result).toEqual({ ok: true, value: '+5571988887777' });
  });

  it('rejeita número curto', () => {
    expect(normalizePhone('9999-9999').ok).toBe(false);
  });

  it('formata para exibição', () => {
    expect(formatPhoneBR('+5571999999999')).toBe('(71) 99999-9999');
  });

  it('formata a digitação progressiva', () => {
    expect(formatPhoneInput('71999999999')).toBe('(71) 99999-9999');
    expect(formatPhoneInput('+5571999999999')).toBe('(71) 99999-9999');
  });
});

describe('name', () => {
  it('aceita nome de um único termo', () => {
    expect(validateName('Ana')).toEqual({ ok: true, value: 'Ana' });
  });

  it('rejeita nome vazio ou só números', () => {
    expect(validateName('   ').ok).toBe(false);
    expect(validateName('12345').ok).toBe(false);
  });
});
