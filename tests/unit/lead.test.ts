import { describe, expect, it } from 'vitest';
import { validateLeadForm } from '../../src/features/contact-form/application/lead-schema';

const valid = {
  name: 'Ana',
  phone: '(71) 99999-9999',
  situation: 'apreendido' as const,
  consent: true,
  website: '',
  startedAt: Date.now() - 5000,
};

describe('lead form', () => {
  it('aceita os dados mínimos', () => {
    const result = validateLeadForm(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Ana');
      expect(result.data.situation).toBe('apreendido');
      expect(result.data.consent).toBe(true);
    }
  });

  it('acumula erros de campos', () => {
    const result = validateLeadForm({
      ...valid,
      name: '',
      phone: '123',
      situation: '',
      consent: false,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.name).toBeTruthy();
      expect(result.errors.phone).toBeTruthy();
      expect(result.errors.situation).toBeTruthy();
      expect(result.errors.consent).toBeTruthy();
    }
  });

  it('mantém o honeypot para o caso de uso decidir', () => {
    const result = validateLeadForm({ ...valid, website: 'spam' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.website).toBe('spam');
  });
});
