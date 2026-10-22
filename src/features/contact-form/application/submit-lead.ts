import { mapLead } from './map-lead';
import { validateLeadForm } from './lead-schema';
import type { LeadGateway } from './ports';
import type { LeadFormInput, SubmitContext, SubmitOutcome } from '../domain/lead';

const MIN_FILL_TIME_MS = 1_500;

export async function submitLead(
  gateway: LeadGateway,
  input: LeadFormInput,
  context: SubmitContext,
): Promise<SubmitOutcome> {
  const validated = validateLeadForm(input);
  if (!validated.success) {
    return {
      kind: 'error',
      failure: {
        code: 'validation',
        message: 'Revise os campos destacados.',
        fieldErrors: validated.errors,
      },
    };
  }

  if (validated.data.website.trim().length > 0) {
    return { kind: 'ignored' };
  }

  if (validated.data.startedAt > 0 && Date.now() - validated.data.startedAt < MIN_FILL_TIME_MS) {
    return {
      kind: 'error',
      failure: {
        code: 'bot',
        message: 'Aguarde um instante e tente novamente.',
      },
    };
  }

  const mapped = mapLead(validated.data, context);
  if (!mapped.ok) {
    return {
      kind: 'error',
      failure: {
        code: 'validation',
        message: 'Revise os campos destacados.',
        fieldErrors: mapped.error,
      },
    };
  }

  const result = await gateway.submit(mapped.value);
  if (!result.ok) {
    return { kind: 'error', failure: result.error };
  }

  return { kind: 'success', receipt: result.value };
}
