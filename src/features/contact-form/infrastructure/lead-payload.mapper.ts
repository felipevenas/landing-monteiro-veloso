import type { Lead } from '../domain/lead';

export type LeadPayload = {
  name: string;
  phone: string;
  phone_display: string;
  situation: string;
  consent: {
    accepted: true;
    version: string;
    accepted_at: string;
  };
  attribution: Lead['attribution'];
  source: string;
  page: string;
  submitted_at: string;
  idempotency_key: string;
};

export function toLeadPayload(lead: Lead): LeadPayload {
  return {
    name: lead.name,
    phone: lead.phoneE164,
    phone_display: lead.phoneDisplay,
    situation: lead.situation,
    consent: {
      accepted: true,
      version: lead.consent.version,
      accepted_at: lead.consent.acceptedAt,
    },
    attribution: lead.attribution,
    source: lead.source,
    page: lead.page,
    submitted_at: lead.submittedAt,
    idempotency_key: lead.idempotencyKey,
  };
}
