import type { GoogleReview, GoogleReviews } from '../domain/review';

export type GooglePlaceReview = {
  rating?: number;
  relativePublishTimeDescription?: string;
  publishTime?: string;
  text?: { text?: string };
  authorAttribution?: { displayName?: string; uri?: string };
};

export type GooglePlaceResponse = {
  displayName?: { text?: string };
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: GooglePlaceReview[];
};

const MAX_REVIEWS = 5;

function safeGoogleUrl(value: string | undefined): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return null;

    const host = url.hostname.toLowerCase();
    const allowed =
      host === 'google.com' ||
      host.endsWith('.google.com') ||
      host === 'goo.gl' ||
      host === 'maps.app.goo.gl' ||
      host === 'g.co';

    return allowed ? url.toString() : null;
  } catch {
    return null;
  }
}

function clampRating(value: number | undefined): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0;
  return Math.min(5, Math.max(0, Math.round(value * 10) / 10));
}

function formatPublishDate(value: string | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function cleanText(value: string | undefined): string {
  return (value ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function mapReview(review: GooglePlaceReview): GoogleReview | null {
  const text = cleanText(review.text?.text);
  if (!text) return null;

  const author = review.authorAttribution?.displayName?.trim() || 'Cliente do Google';
  const relativeDate =
    review.relativePublishTimeDescription?.trim() || formatPublishDate(review.publishTime);

  return {
    author,
    authorUrl: safeGoogleUrl(review.authorAttribution?.uri),
    rating: clampRating(review.rating),
    relativeDate,
    text,
  };
}

export function mapGooglePlace(payload: GooglePlaceResponse): GoogleReviews {
  const reviews = (payload.reviews ?? [])
    .map(mapReview)
    .filter((review): review is GoogleReview => review !== null)
    .slice(0, MAX_REVIEWS);

  return {
    placeName: payload.displayName?.text?.trim() || 'Monteiro Veloso Advogados',
    rating: clampRating(payload.rating),
    userRatingCount:
      typeof payload.userRatingCount === 'number' && payload.userRatingCount > 0
        ? Math.trunc(payload.userRatingCount)
        : 0,
    googleMapsUri: safeGoogleUrl(payload.googleMapsUri),
    reviews,
    fetchedAt: new Date().toISOString(),
  };
}
