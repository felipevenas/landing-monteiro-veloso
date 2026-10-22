import { configField, type ConfigField } from './field';

export const SITE_URL = 'https://monteiroveloso.com';

export const site = {
  name: 'Monteiro Veloso Advogados',
  shortName: 'Monteiro Veloso',
  legalName: 'MONTEIRO VELOSO SOCIEDADE INDIVIDUAL DE ADVOCACIA',
  cnpj: '59.575.024/0001-11',
  url: SITE_URL,
  domain: 'monteiroveloso.com',
  description:
    'Escritório de advocacia em Salvador com atuação concentrada em Direito Bancário, na defesa de pessoas físicas nas relações com instituições financeiras: financiamento de veículo, busca e apreensão e revisional de contrato. Atendimento presencial em Salvador e online em todo o Brasil.',
  email: 'robertavelosoadv@gmail.com',
  lawyer: {
    name: 'Roberta Victoria Monteiro Veloso Santos',
    displayName: 'Dra. Roberta Veloso',
    role: 'Advogada',
    oab: configField(
      '78.424',
      'OAB/BA',
      true,
      'Número de inscrição na OAB da advogada responsável.',
    ),
    instagram: 'https://www.instagram.com/robertavelosoadv/',
  },
  phone: {
    display: '+55 71 92006-4621',
    e164: '+5571920064621',
    whatsapp: 'https://wa.me/message/FHOA2RTRCH7ON1',
    whatsappLabel: 'Falar pelo WhatsApp',
  },
  address: {
    street: 'Rua Portugal',
    number: '17',
    complement: 'Ed. Regente Feijó',
    room: configField('', 'Sala/conjunto', false, 'Complemento interno, se houver.'),
    district: 'Comércio',
    city: 'Salvador',
    state: 'BA',
    stateName: 'Bahia',
    postalCode: '40015-000',
    country: 'BR',
  },
  hours: configField('', 'Horário de atendimento', false, 'Ex.: segunda a sexta, 9h às 18h.'),
  geo: {
    latitude: configField('', 'Latitude', false),
    longitude: configField('', 'Longitude', false),
    placeId: configField('', 'Google Place ID', false),
  },
  social: {
    instagram: 'https://www.instagram.com/monteirovelosoadvogados/',
    instagramLawyer: 'https://www.instagram.com/robertavelosoadv/',
  },
  serviceArea: 'todo o Brasil',
  navHome: [
    { label: 'O escritório', href: '#escritorio' },
    { label: 'Áreas de atuação', href: '#areas' },
    { label: 'Dúvidas', href: '#duvidas' },
    { label: 'Onde estamos', href: '#localizacao' },
    { label: 'Contato', href: '#contato' },
  ],
  navLanding: [
    { label: 'O problema', href: '/defesa-busca-e-apreensao-veiculo/#problema' },
    { label: 'Como funciona', href: '/defesa-busca-e-apreensao-veiculo/#como-funciona' },
    { label: 'Serviços', href: '/defesa-busca-e-apreensao-veiculo/#servicos' },
    { label: 'Dúvidas', href: '/defesa-busca-e-apreensao-veiculo/#duvidas' },
  ],
} as const;

export const configFields: ReadonlyArray<{ path: string; field: ConfigField }> = [
  { path: 'site.lawyer.oab', field: site.lawyer.oab },
  { path: 'site.hours', field: site.hours },
  { path: 'site.address.room', field: site.address.room },
  { path: 'site.geo.latitude', field: site.geo.latitude },
  { path: 'site.geo.longitude', field: site.geo.longitude },
  { path: 'site.geo.placeId', field: site.geo.placeId },
];

export function fullAddress(): string {
  const room = site.address.room.value;
  return [
    `${site.address.street}, ${site.address.number}`,
    site.address.complement,
    room || null,
    site.address.district,
    `${site.address.city}-${site.address.state}`,
    site.address.postalCode,
  ]
    .filter(Boolean)
    .join(', ');
}

export function mapQuery(): string {
  return encodeURIComponent(
    `${site.address.street}, ${site.address.number}, ${site.address.district}, ${site.address.city} - ${site.address.state}, ${site.address.postalCode}`,
  );
}
