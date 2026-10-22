export function jsonLdGraph(nodes: Array<Record<string, unknown> | null | undefined>) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter((node): node is Record<string, unknown> => Boolean(node)),
  };
}
