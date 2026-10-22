import { publishable } from '@/shared/config/field';
import { site } from '@/shared/config/site';

export function legalServiceSchema(): Record<string, unknown> {
  const address: Record<string, unknown> = {
    '@type': 'PostalAddress',
    streetAddress: [
      `${site.address.street}, ${site.address.number}`,
      site.address.complement,
      publishable(site.address.room),
    ]
      .filter(Boolean)
      .join(', '),
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  };

  const schema: Record<string, unknown> = {
    '@type': 'LegalService',
    '@id': `${site.url}/#legal-service`,
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: site.url,
    logo: new URL('/og/logo.png', site.url).toString(),
    image: new URL('/og/og-default.png', site.url).toString(),
    telephone: site.phone.e164,
    email: site.email,
    address,
    areaServed: [
      { '@type': 'City', name: site.address.city },
      { '@type': 'Country', name: 'Brasil' },
    ],
    sameAs: [site.social.instagram],
    founder: { '@id': `${site.url}/#lawyer` },
    employee: { '@id': `${site.url}/#lawyer` },
    knowsAbout: [
      'Direito bancário',
      'Busca e apreensão de veículo',
      'Financiamento de veículo',
      'Revisional de contrato bancário',
    ],
  };

  const oab = publishable(site.lawyer.oab);
  if (oab) {
    schema.identifier = {
      '@type': 'PropertyValue',
      propertyID: 'OAB/BA',
      value: oab,
    };
  }

  const hours = publishable(site.hours);
  if (hours) schema.openingHours = hours;

  const latitude = publishable(site.geo.latitude);
  const longitude = publishable(site.geo.longitude);
  if (latitude && longitude) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: Number(latitude),
      longitude: Number(longitude),
    };
  }

  return schema;
}
