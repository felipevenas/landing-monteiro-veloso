import { leadDeliveryMode, publicEnv } from '@/shared/config/env';
import { site } from '@/shared/config/site';
import type { LeadGateway } from './application/ports';
import { submitLead } from './application/submit-lead';
import type { LeadFormInput, SubmitContext } from './domain/lead';
import { MailtoLeadGateway } from './infrastructure/mailto-lead.gateway';
import { N8nLeadGateway } from './infrastructure/n8n-lead.gateway';

const gateway: LeadGateway =
  leadDeliveryMode === 'mailto'
    ? new MailtoLeadGateway(site.email)
    : new N8nLeadGateway(publicEnv.n8nWebhookUrl, publicEnv.n8nTimeoutMs);

export function submitContactLead(input: LeadFormInput, context: SubmitContext) {
  return submitLead(gateway, input, context);
}
