import raw from './data/reviews.json';
import curatedRaw from './data/reviews.curated.json';
import type { GoogleReview, GoogleReviews } from './domain/review';

export type CuratedReview = {
  author: string;
  relativeDate: string;
  text: string;
};

const MAX_CACHE_AGE_MS = 30 * 24 * 60 * 60 * 1000;
const data = raw as Partial<GoogleReviews>;

function isFresh(fetchedAt: unknown): fetchedAt is string {
  if (typeof fetchedAt !== 'string' || fetchedAt.length === 0) return false;
  const timestamp = Date.parse(fetchedAt);
  if (Number.isNaN(timestamp)) return false;
  return Date.now() - timestamp <= MAX_CACHE_AGE_MS;
}

function isReview(value: unknown): value is GoogleReview {
  if (!value || typeof value !== 'object') return false;
  const review = value as Partial<GoogleReview>;
  return (
    typeof review.author === 'string' &&
    typeof review.text === 'string' &&
    typeof review.rating === 'number' &&
    typeof review.relativeDate === 'string'
  );
}

export function getGoogleReviews(): GoogleReviews | null {
  if (!data || typeof data.rating !== 'number' || !Array.isArray(data.reviews)) return null;
  if (!isFresh(data.fetchedAt)) return null;

  const reviews = data.reviews.filter(isReview);
  if (data.rating <= 0 && reviews.length === 0) return null;

  return {
    placeName: typeof data.placeName === 'string' ? data.placeName : 'Monteiro Veloso Advogados',
    rating: data.rating,
    userRatingCount:
      typeof data.userRatingCount === 'number' && data.userRatingCount > 0
        ? Math.trunc(data.userRatingCount)
        : 0,
    googleMapsUri: typeof data.googleMapsUri === 'string' ? data.googleMapsUri : null,
    reviews,
    fetchedAt: data.fetchedAt,
  };
}

export type { GoogleReview, GoogleReviews } from './domain/review';

function isCuratedReview(value: unknown): value is CuratedReview {
  if (!value || typeof value !== 'object') return false;
  const review = value as Partial<CuratedReview>;
  return (
    typeof review.author === 'string' &&
    review.author.trim().length > 0 &&
    typeof review.text === 'string' &&
    review.text.trim().length > 0 &&
    typeof review.relativeDate === 'string'
  );
}

/**
 * Avaliações reais copiadas do perfil público do Google.
 *
 * A Places API desta chave devolve nota e total, mas não os textos dos
 * comentários. Enquanto isso não muda, o carrossel usa esta curadoria.
 * Quando a API voltar a entregar `reviews`, ela tem prioridade.
 */
export function getCuratedReviews(): CuratedReview[] {
  const source = curatedRaw as { reviews?: unknown };
  const items = Array.isArray(source.reviews) ? source.reviews : [];
  return items.filter(isCuratedReview).map((review) => ({
    author: review.author.trim(),
    relativeDate: review.relativeDate.trim(),
    text: review.text.trim(),
  }));
}
