/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_N8N_WEBHOOK_URL?: string;
  readonly PUBLIC_GTM_ID?: string;
  readonly PUBLIC_FORM_ENABLED?: string;
  readonly PUBLIC_CONSENT_VERSION?: string;
  readonly PUBLIC_N8N_TIMEOUT_MS?: string;
  readonly PUBLIC_LEAD_DELIVERY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
