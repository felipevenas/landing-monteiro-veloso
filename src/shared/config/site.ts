import { configField, publishable, type ConfigField } from './field';

export const SITE_URL = 'https://monteiroveloso.com';

export const businessHours = {
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  opens: '08:00',
  closes: '16:30',
  label: 'Segunda a sexta, das 8h às 16h30',
} as const;

export const site = {
  name: 'Monteiro Veloso Advogados',
  shortName: 'Monteiro Veloso',
  legalName: 'MONTEIRO VELOSO SOCIEDADE INDIVIDUAL DE ADVOCACIA',
  cnpj: '59.575.024/0001-11',
  url: SITE_URL,
  domain: 'monteiroveloso.com',
  description:
    'Advocacia em Salvador dedicada à defesa de pessoas físicas contra bancos e financeiras: busca e apreensão de veículo, revisional de financiamento e cobrança abusiva. Atendimento presencial em Salvador e online em todo o Brasil.',
  email: 'roberta@monteiroveloso.com',
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
  hours: configField(
    businessHours.label,
    'Horário de atendimento',
    true,
    'Ex.: segunda a sexta, 9h às 18h.',
  ),
  geo: {
    latitude: configField('', 'Latitude', false),
    longitude: configField('', 'Longitude', false),
    placeId: configField('ChIJYYCApFkbFgcRJoXGIZQ1Mj8', 'Google Place ID', false),
  },
  social: {
    instagram: 'https://www.instagram.com/monteirovelosoadvogados/',
    instagramLawyer: 'https://www.instagram.com/robertavelosoadv/',
  },
  serviceArea: 'todo o Brasil',
  navHome: [
    { label: 'Serviços', href: '#areas' },
    { label: 'Avaliações', href: '#avaliacoes' },
    { label: 'Instagram', href: '#instagram' },
    { label: 'Localização', href: '#localizacao' },
    { label: 'Contato', href: '#contato' },
  ],
  navLanding: [
    { label: 'Prazos', href: '/defesa-busca-e-apreensao-veiculo/#prazo' },
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

export function googlePlaceUrl(): string | null {
  const placeId = publishable(site.geo.placeId);
  return placeId ? `https://www.google.com/maps/place/?q=place_id:${placeId}` : null;
}

export function googleReviewsUrl(): string | null {
  const placeId = publishable(site.geo.placeId);
  return placeId ? `https://search.google.com/local/reviews?placeid=${placeId}` : null;
}
