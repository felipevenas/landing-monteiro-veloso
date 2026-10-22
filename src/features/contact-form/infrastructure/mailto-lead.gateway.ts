import { err, ok, type Result } from '@/shared/domain/result';
import { buildLeadMailto } from '../application/lead-message';
import type { LeadGateway } from '../application/ports';
import type { Lead, SubmitFailure, SubmitReceipt } from '../domain/lead';

/**
 * Entrega o lead abrindo o aplicativo de e-mail do cliente com a mensagem pronta.
 * Não há confirmação de entrega: o cliente precisa tocar em "enviar".
 */
export class MailtoLeadGateway implements LeadGateway {
  constructor(private readonly recipient: string) {}

  async submit(lead: Lead): Promise<Result<SubmitReceipt, SubmitFailure>> {
    if (!this.recipient) {
      return err({
        code: 'disabled',
        message: 'O envio por e-mail está indisponível. Fale pelo WhatsApp.',
      });
    }

    window.location.href = buildLeadMailto(lead, this.recipient, window.location.origin);

    return ok({
      id: lead.idempotencyKey,
      receivedAt: new Date().toISOString(),
    });
  }
}
