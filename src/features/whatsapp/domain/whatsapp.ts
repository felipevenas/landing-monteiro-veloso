export function whatsappUrl(base: string): string {
  try {
    const url = new URL(base);
    return url.toString();
  } catch {
    return base;
  }
}
