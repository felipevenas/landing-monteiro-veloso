import { publishable } from '@/shared/config/field';
import { site } from '@/shared/config/site';

export function lawyerSchema(): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@type': 'Person',
    '@id': `${site.url}/#lawyer`,
    name: site.lawyer.name,
    alternateName: site.lawyer.displayName,
    jobTitle: site.lawyer.role,
    worksFor: { '@id': `${site.url}/#legal-service` },
    url: `${site.url}/defesa-busca-e-apreensao-veiculo/#sobre-title`,
    sameAs: [site.lawyer.instagram],
    knowsAbout: ['Direito bancário', 'Busca e apreensão de veículo', 'Direito do consumidor'],
  };

  const oab = publishable(site.lawyer.oab);
  if (oab) {
    schema.identifier = {
      '@type': 'PropertyValue',
      propertyID: 'OAB/BA',
      value: oab,
    };
  }

  return schema;
}
