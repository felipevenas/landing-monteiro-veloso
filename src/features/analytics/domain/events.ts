export type WhatsAppLocation =
  'header' | 'hero' | 'bio' | 'services' | 'final' | 'float' | 'footer';

export type AnalyticsEvents = {
  click_whatsapp: { location: WhatsAppLocation; page: string };
  form_submit: { status: 'success' | 'error'; situation?: string; page: string };
  scroll_75: { page: string };
};

export type AnalyticsEventName = keyof AnalyticsEvents;
