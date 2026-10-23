const env = import.meta.env;

function bool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === '') return fallback;
  return value.toLowerCase() !== 'false';
}

function int(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const publicEnv = {
  n8nWebhookUrl: (env.PUBLIC_N8N_WEBHOOK_URL ?? '').trim(),
  gtmId: (env.PUBLIC_GTM_ID ?? '').trim(),
  formEnabled: bool(env.PUBLIC_FORM_ENABLED, true),
  consentVersion: (env.PUBLIC_CONSENT_VERSION ?? '2026-10.1').trim(),
  n8nTimeoutMs: int(env.PUBLIC_N8N_TIMEOUT_MS, 12_000),
  leadDelivery: (env.PUBLIC_LEAD_DELIVERY ?? '').trim().toLowerCase(),
} as const;

export const isWebhookConfigured = publicEnv.n8nWebhookUrl.length > 0;
export const isAnalyticsConfigured = publicEnv.gtmId.length > 0;

export type LeadDeliveryMode = 'webhook' | 'mailto';

/** `PUBLIC_LEAD_DELIVERY` explícito; sem ele, webhook se configurado, senão mailto. */
export const leadDeliveryMode: LeadDeliveryMode =
  publicEnv.leadDelivery === 'webhook' || publicEnv.leadDelivery === 'mailto'
    ? publicEnv.leadDelivery
    : isWebhookConfigured
      ? 'webhook'
      : 'mailto';
