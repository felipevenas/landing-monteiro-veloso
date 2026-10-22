import { site } from '@/shared/config/site';

export type MetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
  type?: 'website' | 'article';
};

export type Metadata = {
  title: string;
  description: string;
  canonical: string;
  image: string;
  robots: string;
  type: 'website' | 'article';
  siteName: string;
  locale: string;
};

export function createMetadata(input: MetadataInput): Metadata {
  const canonical = new URL(input.path, site.url).toString();
  const image = new URL(input.image ?? '/og/og-default.png', site.url).toString();

  return {
    title: input.title,
    description: input.description,
    canonical,
    image,
    robots: input.noindex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    type: input.type ?? 'website',
    siteName: site.name,
    locale: 'pt_BR',
  };
}
