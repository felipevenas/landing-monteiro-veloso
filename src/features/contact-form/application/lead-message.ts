import type { Lead } from '../domain/lead';
import { situationLabel } from '../domain/situation';

export type LeadMessage = {
  subject: string;
  body: string;
};

const SUBJECT = 'Solicitação de contato: busca e apreensão de veículo';

function campaignLine(lead: Lead): string | null {
  const parts = [
    lead.attribution.utm_source,
    lead.attribution.utm_medium,
    lead.attribution.utm_campaign,
  ].filter((value): value is string => Boolean(value));

  return parts.length > 0 ? parts.join(' / ') : null;
}

/**
 * Monta a mensagem informativa enviada pelo cliente. O próprio e-mail funciona
 * como registro do consentimento (versão e data/hora), já que não há servidor.
 */
export function buildLeadMessage(lead: Lead, origin: string): LeadMessage {
  const campaign = campaignLine(lead);

  const lines = [
    'Olá, gostaria de falar com o escritório sobre busca e apreensão de veículo.',
    '',
    `Nome: ${lead.name}`,
    `WhatsApp: ${lead.phoneDisplay} (${lead.phoneE164})`,
    `Situação: ${situationLabel(lead.situation)}`,
  ];

  if (campaign) lines.push(`Origem: ${campaign}`);
  if (lead.page) lines.push(`Página: ${origin}${lead.page}`);

  lines.push(
    '',
    `Enviado em: ${lead.submittedAt}`,
    `Consentimento LGPD: versão ${lead.consent.version}, aceito em ${lead.consent.acceptedAt}.`,
    `Referência: ${lead.idempotencyKey}`,
  );

  return { subject: SUBJECT, body: lines.join('\r\n') };
}

export function buildLeadMailto(lead: Lead, recipient: string, origin: string): string {
  const { subject, body } = buildLeadMessage(lead, origin);
  const query = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return `mailto:${recipient}?${query}`;
}
