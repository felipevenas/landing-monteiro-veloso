import { publicEnv } from '@/shared/config/env';
import { hasAnalyticsConsent } from '@/features/consent';
import type { AnalyticsEventName, AnalyticsEvents } from '../domain/events';
import { pushToDataLayer } from '../infrastructure/data-layer';
import { loadGtm } from '../infrastructure/gtm';

function canTrack(): boolean {
  return publicEnv.gtmId.length > 0 && hasAnalyticsConsent();
}

export function trackEvent<K extends AnalyticsEventName>(
  name: K,
  params: AnalyticsEvents[K],
): void {
  if (!canTrack()) return;
  pushToDataLayer({ event: name, ...params });
}

export function initAnalytics(): void {
  if (!publicEnv.gtmId || !hasAnalyticsConsent()) return;
  loadGtm();
}
