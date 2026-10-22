import { err, ok, type Result } from '@/shared/domain/result';

export type PhoneError = 'empty' | 'invalid';

export function normalizePhone(raw: string): Result<string, PhoneError> {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return err('empty');

  let national = digits;
  if (national.startsWith('55') && national.length >= 12) {
    national = national.slice(2);
  }

  if (national.length !== 10 && national.length !== 11) {
    return err('invalid');
  }

  const ddd = Number.parseInt(national.slice(0, 2), 10);
  if (ddd < 11 || ddd > 99) return err('invalid');

  const subscriber = national.slice(2);
  if (!/^\d+$/.test(subscriber)) return err('invalid');

  return ok(`+55${national}`);
}

export function formatPhoneBR(e164: string): string {
  const digits = e164.replace(/\D/g, '').replace(/^55/, '');
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return e164;
}

export function formatPhoneInput(value: string): string {
  let raw = value.replace(/\D/g, '');
  if (raw.startsWith('55') && raw.length > 11) raw = raw.slice(2);
  const digits = raw.slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}
