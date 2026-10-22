import { sanitizeAttribution, type Attribution } from '../domain/attribution';

export const ATTRIBUTION_STORAGE_KEY = 'mv_attribution_v1';

export function readAttribution(): Attribution {
  try {
    const raw = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    return raw ? sanitizeAttribution(JSON.parse(raw)) : {};
  } catch {
    return {};
  }
}
