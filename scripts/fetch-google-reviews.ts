import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadEnv } from 'vite';
import {
  mapGooglePlace,
  type GooglePlaceResponse,
} from '../src/features/reviews/infrastructure/map-place';
import { site } from '../src/shared/config/site';

const allowMissing = process.argv.includes('--allow-missing');
const outputFile = path.resolve('src/features/reviews/data/reviews.json');
const tempFile = `${outputFile}.tmp`;
const env = loadEnv('production', process.cwd(), '');
const apiKey = (process.env.GOOGLE_PLACES_API_KEY || env.GOOGLE_PLACES_API_KEY || '').trim();
const placeId = (
  process.env.GOOGLE_PLACE_ID ||
  env.GOOGLE_PLACE_ID ||
  site.geo.placeId.value
).trim();

type CachedReviews = {
  rating?: number;
  reviews?: unknown[];
};

async function readCache(): Promise<CachedReviews | null> {
  try {
    const parsed = JSON.parse(await readFile(outputFile, 'utf8')) as CachedReviews;
    if (!parsed || typeof parsed !== 'object') return null;
    if (typeof parsed.rating !== 'number' && !Array.isArray(parsed.reviews)) return null;
    if (parsed.reviews !== undefined && !Array.isArray(parsed.reviews)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function cacheIsUsable(cache: CachedReviews | null): boolean {
  if (!cache) return false;
  return (typeof cache.rating === 'number' && cache.rating > 0) || Boolean(cache.reviews?.length);
}

function isUsablePayload(payload: GooglePlaceResponse): boolean {
  if (!payload || typeof payload !== 'object') return false;
  if (payload.rating !== undefined && typeof payload.rating !== 'number') return false;
  if (payload.userRatingCount !== undefined && typeof payload.userRatingCount !== 'number') {
    return false;
  }
  if (payload.reviews !== undefined && !Array.isArray(payload.reviews)) return false;
  return true;
}

function warn(message: string): void {
  console.warn(`\nAviso (avaliações do Google): ${message}`);
}

function keepCache(message: string): void {
  warn(message);
  warn('Mantendo o último cache de avaliações já gravado.');
}

async function writeEmptyCache(): Promise<void> {
  const empty = {
    placeName: 'Monteiro Veloso Advogados',
    rating: 0,
    userRatingCount: 0,
    googleMapsUri: null,
    reviews: [],
    fetchedAt: '',
  };
  await mkdir(path.dirname(outputFile), { recursive: true });
  await writeFile(outputFile, `${JSON.stringify(empty, null, 2)}\n`, 'utf8');
  warn('Cache de avaliações recriado vazio para permitir a prévia.');
}

async function failOrEmpty(reason: string, cached: CachedReviews | null): Promise<void> {
  warn(reason);
  if (cacheIsUsable(cached)) {
    keepCache('A consulta não substituirá o cache atual.');
    return;
  }
  if (allowMissing) {
    await writeEmptyCache();
    return;
  }
  process.exitCode = 1;
}

async function main(): Promise<void> {
  const cached = await readCache();

  if (!apiKey || !placeId) {
    const missing = [!apiKey && 'GOOGLE_PLACES_API_KEY', !placeId && 'GOOGLE_PLACE_ID']
      .filter(Boolean)
      .join(' e ');
    warn(`${missing} não configurado(s).`);

    if (cacheIsUsable(cached)) {
      keepCache('A consulta à Places API não será feita.');
      return;
    }

    if (allowMissing) {
      warn(
        'Sem cache e sem chave: a seção mostrará apenas o link para o perfil no Google nesta prévia.',
      );
      await writeEmptyCache();
      return;
    }

    console.error(
      'A seção de avaliações do Google não pode ser publicada sem GOOGLE_PLACES_API_KEY e GOOGLE_PLACE_ID.',
    );
    process.exitCode = 1;
    return;
  }

  const url = new URL(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`);
  url.searchParams.set('languageCode', 'pt-BR');

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'displayName,rating,userRatingCount,reviews,googleMapsUri',
      },
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    await failOrEmpty(
      `falha de rede ao consultar a Places API (${(error as Error).message}).`,
      cached,
    );
    return;
  }

  if (!response.ok) {
    const detail = (await response.text().catch(() => '')).slice(0, 300);
    await failOrEmpty(`a Places API respondeu ${response.status}. ${detail}`, cached);
    return;
  }

  let payload: GooglePlaceResponse;
  try {
    payload = (await response.json()) as GooglePlaceResponse;
  } catch {
    await failOrEmpty('a resposta da Places API não é um JSON válido.', cached);
    return;
  }

  if (!isUsablePayload(payload)) {
    await failOrEmpty('a resposta da Places API veio em formato inesperado.', cached);
    return;
  }

  const data = mapGooglePlace(payload);

  if (data.rating <= 0 && data.reviews.length === 0) {
    await failOrEmpty('a Places API não retornou nota nem comentários utilizáveis.', cached);
    return;
  }

  await mkdir(path.dirname(outputFile), { recursive: true });
  try {
    await writeFile(tempFile, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
    await rename(tempFile, outputFile);
  } catch (error) {
    await rm(tempFile, { force: true });
    await failOrEmpty(
      `não foi possível gravar o cache de avaliações (${(error as Error).message}).`,
      cached,
    );
    return;
  }

  console.log(
    `Avaliações do Google atualizadas: ${data.reviews.length} comentário(s), nota ${data.rating.toFixed(1).replace('.', ',')} com ${data.userRatingCount} avaliação(ões).`,
  );
}

await main();
