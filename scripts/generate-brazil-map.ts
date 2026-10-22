/**
 * Gera `src/shared/ui/brazil-map.data.ts` (mapa do Brasil, 26 estados + DF).
 *
 * Fonte: Natural Earth (domínio público) via BenPortner/geojson-atlas, licença CC0 1.0.
 * https://github.com/BenPortner/geojson-atlas
 *
 * Pipeline: GeoJSON -> projeção Mercator -> normalização para um viewBox quadrado ->
 * simplificação Douglas-Peucker -> descarte de ilhas minúsculas -> paths SVG.
 *
 * Uso: npm run generate:map
 */
import { writeFile } from 'node:fs/promises';

const SRC =
  'https://raw.githubusercontent.com/BenPortner/geojson-atlas/master/geojson/natural_earth/countries/10m/BR.geojson';
const OUT = new URL('../src/shared/ui/brazil-map.data.ts', import.meta.url);

const BOX = 400;
const PAD = 4;
const TOL = 0.6;
const MIN_RING_AREA = 2;

type Point = [number, number];

const project = ([lon, lat]: Point): Point => [
  (lon * Math.PI) / 180,
  Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)),
];

function perpDist(p: Point, a: Point, b: Point): number {
  const [x, y] = p;
  const [x1, y1] = a;
  const [x2, y2] = b;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(x - x1, y - y1);
  let t = ((x - x1) * dx + (y - y1) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
}

function simplify(points: Point[], tol: number): Point[] {
  if (points.length <= 2) return points;
  const keep = new Array<boolean>(points.length).fill(false);
  keep[0] = true;
  keep[points.length - 1] = true;
  const stack: Array<[number, number]> = [[0, points.length - 1]];
  while (stack.length > 0) {
    const [i, j] = stack.pop() as [number, number];
    let maxD = 0;
    let idx = -1;
    for (let k = i + 1; k < j; k++) {
      const d = perpDist(points[k], points[i], points[j]);
      if (d > maxD) {
        maxD = d;
        idx = k;
      }
    }
    if (maxD > tol && idx > -1) {
      keep[idx] = true;
      stack.push([i, idx], [idx, j]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

function ringArea(ring: Point[]): number {
  let area = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    area += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  }
  return Math.abs(area / 2);
}

const response = await fetch(SRC);
const collection = (await response.json()) as {
  features: Array<{
    properties: { name: string; iso_3166_2: string };
    geometry: { type: string; coordinates: number[][][] | number[][][][] };
  }>;
};

const states = collection.features.map((feature) => {
  const polygons =
    feature.geometry.type === 'Polygon'
      ? [feature.geometry.coordinates as number[][][]]
      : (feature.geometry.coordinates as number[][][][]);
  // apenas o anel externo de cada polígono; buracos não são relevantes nesta escala
  const rings = polygons.map((polygon) => polygon[0].map((point) => project(point as Point)));
  return {
    id: feature.properties.iso_3166_2.replace('BR-', '').toLowerCase(),
    name: feature.properties.name,
    rings,
  };
});

type Ring = Point[];

function bbox(rings: Ring[]): { minX: number; minY: number; maxX: number; maxY: number } {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const ring of rings) {
    for (const [x, y] of ring) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  return { minX, minY, maxX, maxY };
}

// 1) Descarta ilhas minúsculas ANTES de medir a caixa. Ilhas oceânicas distantes
//    (Fernando de Noronha, Trindade) esticariam o bbox e descentralizariam o mapa.
const provisional = bbox(states.flatMap((state) => state.rings));
const provisionalScale = Math.min(
  (BOX - PAD * 2) / (provisional.maxX - provisional.minX),
  (BOX - PAD * 2) / (provisional.maxY - provisional.minY),
);

let dropped = 0;
const kept = states.map((state) => {
  const rings = state.rings.filter((ring) => {
    const scaled = ring.map(([x, y]): Point => [
      (x - provisional.minX) * provisionalScale,
      (y - provisional.minY) * provisionalScale,
    ]);
    if (ringArea(scaled) < MIN_RING_AREA) {
      dropped++;
      return false;
    }
    return true;
  });
  return { ...state, rings };
});

// 2) Caixa final, apenas sobre o que permaneceu visível.
const { minX, minY, maxX, maxY } = bbox(kept.flatMap((state) => state.rings));
const scale = Math.min((BOX - PAD * 2) / (maxX - minX), (BOX - PAD * 2) / (maxY - minY));
const offsetX = PAD + (BOX - PAD * 2 - (maxX - minX) * scale) / 2;
const offsetY = PAD + (BOX - PAD * 2 - (maxY - minY) * scale) / 2;

const toBox = ([x, y]: Point): Point => [
  offsetX + (x - minX) * scale,
  offsetY + (maxY - y) * scale,
];

let ringCount = 0;
const out = kept.map((state) => {
  const parts: string[] = [];
  for (const rawRing of state.rings) {
    ringCount++;
    parts.push(
      simplify(rawRing.map(toBox), TOL)
        .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
        .join('') + 'Z',
    );
  }
  return { id: state.id, name: state.name, path: parts.join('') };
});

out.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

const file = `// Mapa do Brasil (26 estados + DF) gerado a partir de dados de domínio público.
//
// Fonte: Natural Earth (domínio público) via BenPortner/geojson-atlas, licença CC0 1.0.
// https://github.com/BenPortner/geojson-atlas
//
// Projeção Mercator, normalizada para um viewBox ${BOX}x${BOX} e simplificada
// (Douglas-Peucker, tolerância ${TOL}). Não editar à mão: regenere com \`npm run generate:map\`.

export const BRAZIL_MAP_VIEWBOX = '0 0 ${BOX} ${BOX}';

export type BrazilState = {
  /** Sigla da UF em minúsculas (ex.: "ba"). */
  id: string;
  name: string;
  path: string;
};

export const BRAZIL_STATES: BrazilState[] = [
${out.map((s) => `  { id: '${s.id}', name: '${s.name}', path: '${s.path}' },`).join('\n')}
];
`;

await writeFile(OUT, file, 'utf8');

const bytes = out.reduce((total, state) => total + state.path.length, 0);
console.log(
  `Mapa do Brasil gerado: ${out.length} estados, ${ringCount} anéis, ${dropped} ilhas descartadas.`,
);
console.log(
  `Paths: ${(bytes / 1024).toFixed(1)} KB | arquivo: ${(file.length / 1024).toFixed(1)} KB`,
);
