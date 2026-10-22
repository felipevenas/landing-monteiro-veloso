import { nowIso } from '@/shared/domain/clock';
import { err, ok, type Result } from '@/shared/domain/result';
import { formatPhoneBR, normalizePhone } from '../domain/phone';
import type { Lead, LeadFormErrors } from '../domain/lead';
import type { LeadFormData } from './lead-schema';

export function mapLead(
  data: LeadFormData,
  context: {
    attribution: Lead['attribution'];
    idempotencyKey: string;
    source: string;
    page: string;
    consentVersion: string;
  },
): Result<Lead, LeadFormErrors> {
  const phone = normalizePhone(data.phone);
  if (!phone.ok) {
    return err({ phone: 'Informe um WhatsApp válido com DDD.' });
  }

  return ok({
    name: data.name,
    phoneE164: phone.value,
    phoneDisplay: formatPhoneBR(phone.value),
    situation: data.situation,
    consent: {
      accepted: true,
      version: context.consentVersion,
      acceptedAt: nowIso(),
    },
    attribution: context.attribution,
    source: context.source,
    page: context.page,
    submittedAt: nowIso(),
    idempotencyKey: context.idempotencyKey,
  });
}
