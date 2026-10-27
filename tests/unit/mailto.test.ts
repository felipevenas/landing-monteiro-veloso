import { describe, expect, it } from 'vitest';
import {
  buildLeadMailto,
  buildLeadMessage,
} from '../../src/features/contact-form/application/lead-message';
import type { Lead } from '../../src/features/contact-form/domain/lead';

const lead: Lead = {
  name: 'Ana',
  phoneE164: '+5571999999999',
  phoneDisplay: '(71) 99999-9999',
  situation: 'apreendido',
  consent: {
    accepted: true,
    version: '2026-10',
    acceptedAt: '2026-10-20T12:00:00.000Z',
  },
  attribution: {
    utm_source: 'google',
    utm_campaign: 'busca-apreensao',
    landing_page: '/defesa-busca-e-apreensao-veiculo/',
  },
  source: 'lp-busca-apreensao',
  page: '/defesa-busca-e-apreensao-veiculo/',
  submittedAt: '2026-10-20T12:00:01.000Z',
  idempotencyKey: '8f0e0d3a-0000-0000-0000-000000000000',
};

describe('mensagem de e-mail do lead', () => {
  it('inclui nome, WhatsApp, situação e consentimento', () => {
    const { subject, body } = buildLeadMessage(lead, 'https://monteiroveloso.com');

    expect(subject).toContain('busca e apreensão');
    expect(body).toContain('Nome: Ana');
    expect(body).toContain('(71) 99999-9999');
    expect(body).toContain('+5571999999999');
    expect(body).toContain('O veículo já foi apreendido');
    expect(body).toContain('versão 2026-10');
    expect(body).toContain('https://monteiroveloso.com/defesa-busca-e-apreensao-veiculo/');
  });

  it('monta um mailto com destinatário fixo e campos codificados', () => {
    const url = buildLeadMailto(lead, 'roberta@monteiroveloso.com', 'https://monteiroveloso.com');

    expect(url.startsWith('mailto:roberta@monteiroveloso.com?')).toBe(true);
    expect(url).not.toContain('\n');

    const params = new URLSearchParams(url.split('?')[1]);
    expect(params.get('subject')).toContain('busca e apreensão');
    expect(params.get('body')).toContain('Nome: Ana');
  });

  it('omite a linha de campanha quando não há UTM', () => {
    const { body } = buildLeadMessage({ ...lead, attribution: {} }, 'https://monteiroveloso.com');

    expect(body).not.toContain('Origem:');
  });
});
