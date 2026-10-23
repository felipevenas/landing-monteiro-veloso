export type GoogleReview = {
  author: string;
  authorUrl: string | null;
  rating: number;
  relativeDate: string;
  text: string;
};

export type GoogleReviews = {
  placeName: string;
  rating: number;
  userRatingCount: number;
  googleMapsUri: string | null;
  reviews: GoogleReview[];
  fetchedAt: string;
};
