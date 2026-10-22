import { err, ok, type Result } from '@/shared/domain/result';
import type { Lead, SubmitFailure, SubmitReceipt } from '../domain/lead';
import type { LeadGateway } from '../application/ports';
import { toLeadPayload } from './lead-payload.mapper';

export class N8nLeadGateway implements LeadGateway {
  constructor(
    private readonly endpoint: string,
    private readonly timeoutMs: number,
  ) {}

  async submit(lead: Lead): Promise<Result<SubmitReceipt, SubmitFailure>> {
    if (!this.endpoint) {
      return err({
        code: 'disabled',
        message: 'O envio pelo formulário está indisponível. Fale pelo WhatsApp.',
      });
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(toLeadPayload(lead)),
        signal: controller.signal,
        credentials: 'omit',
      });

      if (response.status === 200 || response.status === 201 || response.status === 202) {
        const data = (await response.json().catch(() => null)) as { id?: string } | null;
        return ok({
          id: data?.id ?? lead.idempotencyKey,
          receivedAt: new Date().toISOString(),
        });
      }

      if (response.status === 429) {
        return err({
          code: 'rate_limited',
          message:
            'Muitas tentativas em pouco tempo. Aguarde alguns minutos ou fale pelo WhatsApp.',
        });
      }

      if (response.status === 400 || response.status === 422) {
        return err({
          code: 'validation',
          message: 'Não foi possível validar os dados. Revise as informações e tente novamente.',
        });
      }

      return err({
        code: 'server',
        message: 'Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.',
      });
    } catch (error) {
      const aborted = error instanceof Error && error.name === 'AbortError';
      return err(
        aborted
          ? {
              code: 'timeout',
              message:
                'A solicitação demorou mais que o esperado. Tente novamente ou fale pelo WhatsApp.',
            }
          : {
              code: 'network',
              message:
                'Falha de conexão. Verifique sua internet e tente novamente ou fale pelo WhatsApp.',
            },
      );
    } finally {
      window.clearTimeout(timer);
    }
  }
}
