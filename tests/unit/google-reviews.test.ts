import { describe, expect, it } from 'vitest';
import { mapGooglePlace } from '../../src/features/reviews/infrastructure/map-place';
import { getCuratedReviews } from '../../src/features/reviews';

describe('mapGooglePlace', () => {
  it('mapeia nota, total e no máximo cinco comentários com texto', () => {
    const result = mapGooglePlace({
      displayName: { text: 'Monteiro Veloso Advogados' },
      rating: 4.86,
      userRatingCount: 37.9,
      googleMapsUri: 'https://maps.google.com/?cid=1',
      reviews: Array.from({ length: 7 }, (_, index) => ({
        rating: 5,
        relativePublishTimeDescription: 'há 2 semanas',
        text: { text: `Comentário ${index + 1}` },
        authorAttribution: { displayName: `Cliente ${index + 1}` },
      })),
    });

    expect(result.rating).toBe(4.9);
    expect(result.userRatingCount).toBe(37);
    expect(result.reviews).toHaveLength(5);
    expect(result.reviews[0]).toMatchObject({
      author: 'Cliente 1',
      rating: 5,
      relativeDate: 'há 2 semanas',
      text: 'Comentário 1',
    });
    expect(result.googleMapsUri).toBe('https://maps.google.com/?cid=1');
  });

  it('descarta comentários vazios e usa fallback de autor', () => {
    const result = mapGooglePlace({
      rating: 5,
      userRatingCount: 3,
      reviews: [
        { rating: 5, text: { text: '   ' } },
        { rating: 4, text: { text: 'Atendimento direto e claro.' } },
      ],
    });

    expect(result.reviews).toHaveLength(1);
    expect(result.reviews[0]?.author).toBe('Cliente do Google');
    expect(result.reviews[0]?.relativeDate).toBe('');
  });

  it('normaliza limites de nota e datas inválidas', () => {
    const result = mapGooglePlace({
      rating: 9,
      userRatingCount: -4,
      reviews: [
        {
          rating: -2,
          publishTime: 'data-invalida',
          text: { text: 'Texto\n\n\ncom quebras' },
          authorAttribution: { displayName: '  Ana  ' },
        },
      ],
    });

    expect(result.rating).toBe(5);
    expect(result.userRatingCount).toBe(0);
    expect(result.reviews[0]).toMatchObject({
      author: 'Ana',
      rating: 0,
      relativeDate: '',
      text: 'Texto\n\ncom quebras',
    });
  });

  it('usa o nome padrão quando o payload não traz displayName', () => {
    const result = mapGooglePlace({});
    expect(result.placeName).toBe('Monteiro Veloso Advogados');
    expect(result.reviews).toEqual([]);
  });

  it('descarta URLs que não sejam https do Google', () => {
    const result = mapGooglePlace({
      rating: 5,
      googleMapsUri: 'javascript:alert(1)',
      reviews: [
        {
          rating: 5,
          text: { text: 'Comentário' },
          authorAttribution: { displayName: 'Ana', uri: 'https://evil.example/perfil' },
        },
        {
          rating: 5,
          text: { text: 'Outro comentário' },
          authorAttribution: { displayName: 'Bia', uri: 'https://www.google.com/maps/contrib/1' },
        },
      ],
    });

    expect(result.googleMapsUri).toBeNull();
    expect(result.reviews[0]?.authorUrl).toBeNull();
    expect(result.reviews[1]?.authorUrl).toBe('https://www.google.com/maps/contrib/1');
  });
});

describe('getCuratedReviews', () => {
  it('entrega avaliacoes reais com autor, data e texto', () => {
    const reviews = getCuratedReviews();
    expect(reviews.length).toBeGreaterThanOrEqual(3);
    for (const review of reviews) {
      expect(review.author.length).toBeGreaterThan(0);
      expect(review.relativeDate.length).toBeGreaterThan(0);
      expect(review.text.length).toBeGreaterThan(20);
    }
  });
});
