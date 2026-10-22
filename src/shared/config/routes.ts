export const routes = {
  home: '/',
  landing: '/defesa-busca-e-apreensao-veiculo/',
  privacy: '/politica-de-privacidade/',
  notFound: '/404.html',
} as const;

export type RouteKey = keyof typeof routes;
