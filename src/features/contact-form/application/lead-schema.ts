import type { LeadFormErrors, LeadFormInput } from '../domain/lead';
import { validateName } from '../domain/name';
import { normalizePhone } from '../domain/phone';
import { isVehicleSituation, type VehicleSituation } from '../domain/situation';

export type LeadFormData = {
  name: string;
  phone: string;
  situation: VehicleSituation;
  consent: true;
  website: string;
  startedAt: number;
};

export function validateLeadForm(
  input: LeadFormInput,
): { success: true; data: LeadFormData } | { success: false; errors: LeadFormErrors } {
  const errors: LeadFormErrors = {};

  const name = validateName(input.name);
  if (!name.ok) {
    errors.name =
      name.error === 'too-long'
        ? 'Use no máximo 80 caracteres.'
        : name.error === 'invalid'
          ? 'Informe um nome válido.'
          : 'Informe seu nome.';
  }

  const phone = normalizePhone(input.phone);
  if (!phone.ok) {
    errors.phone = 'Informe um WhatsApp válido com DDD.';
  }

  if (!isVehicleSituation(input.situation)) {
    errors.situation = 'Selecione a sua situação.';
  }

  if (input.consent !== true) {
    errors.consent = 'É necessário autorizar o contato.';
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      name: name.ok ? name.value : input.name.trim(),
      phone: input.phone.trim(),
      situation: input.situation as VehicleSituation,
      consent: true,
      website: input.website.trim(),
      startedAt: input.startedAt,
    },
  };
}
