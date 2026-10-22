import type { Attribution } from '@/shared/domain/attribution';

const ALLOWED_KEYS: ReadonlyArray<keyof Attribution> = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'fbclid',
  'msclkid',
  'landing_page',
  'referrer',
  'captured_at',
];

export function sanitizeAttribution(input: unknown): Attribution {
  if (!input || typeof input !== 'object') return {};

  const source = input as Record<string, unknown>;
  const output: Attribution = {};

  for (const key of ALLOWED_KEYS) {
    const value = source[key];
    if (typeof value === 'string' && value.length > 0) {
      output[key] = value.slice(0, 300);
    }
  }

  return output;
}

export type { Attribution };
