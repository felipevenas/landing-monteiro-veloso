import { site } from '@/shared/config/site';

export function websiteSchema(): Record<string, unknown> {
  return {
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    url: site.url,
    name: site.name,
    publisher: { '@id': `${site.url}/#legal-service` },
    inLanguage: 'pt-BR',
  };
}

export function webPageSchema(input: {
  canonical: string;
  title: string;
  description: string;
}): Record<string, unknown> {
  return {
    '@type': 'WebPage',
    '@id': `${input.canonical}#webpage`,
    url: input.canonical,
    name: input.title,
    description: input.description,
    isPartOf: { '@id': `${site.url}/#website` },
    about: { '@id': `${site.url}/#legal-service` },
    inLanguage: 'pt-BR',
  };
}
