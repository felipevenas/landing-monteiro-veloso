import { test, expect } from '@playwright/test';

const paths = [
  '/',
  '/defesa-busca-e-apreensao-veiculo/',
  '/politica-de-privacidade/',
  '/pagina-inexistente/',
];

for (const width of [320, 360, 390, 768, 1024, 1280, 1366, 1440, 1920, 2560]) {
  test(`sem overflow horizontal em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });

    for (const path of paths) {
      await page.goto(path);
      const metrics = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
      }));

      expect(metrics.scrollWidth, `${path} em ${width}px`).toBeLessThanOrEqual(
        metrics.clientWidth + 1,
      );
      expect(metrics.bodyScrollWidth, `${path} em ${width}px`).toBeLessThanOrEqual(
        metrics.clientWidth + 1,
      );
    }

    await page.goto('/');
    await page.locator('[data-map-load]').scrollIntoViewIfNeeded();
    const map = await page.evaluate(() => {
      const button = document.querySelector<HTMLElement>('[data-map-load]');
      const card = button?.parentElement;
      const buttonRect = button?.getBoundingClientRect();
      const cardRect = card?.getBoundingClientRect();
      return {
        cardRight: cardRect?.right ?? 0,
        viewport: document.documentElement.clientWidth,
        cardScrollWidth: card?.scrollWidth ?? 0,
        cardClientWidth: card?.clientWidth ?? 0,
        buttonRight: buttonRect?.right ?? 0,
        buttonLeft: buttonRect?.left ?? 0,
      };
    });

    expect(map.buttonLeft, `botão do mapa em ${width}px`).toBeGreaterThanOrEqual(0);
    expect(map.buttonRight, `botão do mapa em ${width}px`).toBeLessThanOrEqual(map.viewport + 1);
    expect(map.cardScrollWidth, `conteúdo do mapa em ${width}px`).toBeLessThanOrEqual(
      map.cardClientWidth + 1,
    );
  });
}

test('Instagram carrega embeds sem overflow em 320px e com nome acessível', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Aceitar', exact: true }).click();
  await page.locator('#instagram').scrollIntoViewIfNeeded();

  await expect.poll(() => page.locator('#instagram iframe').count()).toBeGreaterThan(0);

  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
    .toBeLessThanOrEqual(321);
  await expect.poll(() => page.evaluate(() => document.body.scrollWidth)).toBeLessThanOrEqual(321);

  await expect
    .poll(async () => (await page.locator('#instagram iframe').first().getAttribute('title')) ?? '')
    .not.toBe('');
});
