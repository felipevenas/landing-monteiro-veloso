import { err, ok, type Result } from '@/shared/domain/result';

export type NameError = 'empty' | 'too-short' | 'too-long' | 'invalid';

export function validateName(raw: string): Result<string, NameError> {
  const name = raw.trim().replace(/\s+/g, ' ');
  if (!name) return err('empty');
  if (name.length < 2) return err('too-short');
  if (name.length > 80) return err('too-long');
  if (!/[A-Za-zÀ-ÿ]/.test(name)) return err('invalid');
  return ok(name);
}
