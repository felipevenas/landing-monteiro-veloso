import { test, expect } from '@playwright/test';

test.describe('Landing de busca e apreensão', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/defesa-busca-e-apreensao-veiculo/');
  });

  test('entrega HTML único, canonical, schema e FAQ visível', async ({ page }) => {
    await expect(page).toHaveTitle(/Busca e apreensão de veículo em Salvador/);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://monteiroveloso.com/defesa-busca-e-apreensao-veiculo/',
    );

    const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(jsonLd).toBeTruthy();
    const graph = JSON.parse(jsonLd ?? '{}')['@graph'] as Array<Record<string, unknown>>;
    const types = graph.map((node) => node['@type']);
    expect(types).toEqual(
      expect.arrayContaining(['LegalService', 'Person', 'WebPage', 'BreadcrumbList', 'FAQPage']),
    );

    const faq = graph.find((node) => node['@type'] === 'FAQPage') as {
      mainEntity: unknown[];
    };
    expect(faq.mainEntity).toHaveLength(7);
    await expect(page.locator('main details')).toHaveCount(7);
    await expect(page.locator('body')).not.toContainText('[PREENCHER]');
    await expect(page.locator('body')).not.toContainText('AggregateRating');
    await expect.poll(() => page.evaluate(() => document.characterSet)).toBe('UTF-8');
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toContain('\uFFFD');
    expect(bodyText).not.toMatch(/\s+[.,;:!?]/);
  });

  test('consentimento bloqueia GTM, aceita e persiste', async ({ page }) => {
    await expect(page.locator('[data-consent-banner]')).toBeVisible();
    await expect(page.locator('script[src*="googletagmanager.com"]')).toHaveCount(0);

    await page.getByRole('button', { name: 'Aceitar', exact: true }).click();
    await expect(page.locator('[data-consent-banner]')).toBeHidden();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.dataset.consent))
      .toBe('granted');

    await page.reload();
    await expect(page.locator('[data-consent-banner]')).toBeHidden();

    await page.getByRole('button', { name: 'Preferências de cookies' }).click();
    await expect(page.locator('[data-consent-banner]')).toBeVisible();
    await page.getByRole('button', { name: 'Recusar', exact: true }).click();
    await expect(page.locator('[data-consent-banner]')).toBeHidden();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.dataset.consent))
      .toBe('denied');
  });

  test('mapa carrega sob clique sem estourar o card', async ({ page }) => {
    await page.getByRole('button', { name: 'Aceitar', exact: true }).click();
    await page.locator('[data-map-load]').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Carregar mapa' }).click();

    const iframe = page.locator('iframe[title^="Mapa do escritório"]');
    await expect(iframe).toBeVisible();
    const box = await iframe.boundingBox();
    const viewport = await page.evaluate(() => document.documentElement.clientWidth);
    expect(box?.width ?? 0).toBeLessThanOrEqual(viewport + 1);
  });

  test('formulário valida, envia ao webhook e confirma', async ({ page }) => {
    await page.getByRole('button', { name: 'Aceitar', exact: true }).click();
    await page.locator('#contato').scrollIntoViewIfNeeded();
    await page.locator('form[data-hydrated="true"]').waitFor();

    await page.getByRole('button', { name: 'Solicitar contato' }).click();
    await expect(page.getByRole('alert')).toContainText('Revise os campos');
    await expect(page.getByText('Informe seu nome.')).toBeVisible();

    await page.getByLabel('Nome').fill('Ana');
    await page.getByRole('textbox', { name: 'WhatsApp' }).fill('(71) 99999-9999');
    await page.getByLabel('O que aconteceu com o veículo?').selectOption('apreendido');
    await page.getByLabel(/Autorizo o contato/).check();
    await page.waitForTimeout(1700);
    await page.getByRole('button', { name: 'Solicitar contato' }).click();

    await expect(page.getByRole('heading', { name: 'Recebemos sua solicitação.' })).toBeVisible();

    const request = await page.request.get('http://127.0.0.1:4444/requests');
    const leads = (await request.json()) as Array<{ phone?: string; situation?: string }>;
    expect(leads.at(-1)?.phone).toBe('+5571999999999');
    expect(leads.at(-1)?.situation).toBe('apreendido');
  });

  test('menu móvel abre e leva para a seção', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByLabel('Abrir menu de navegação').click();
    await expect(page.getByRole('link', { name: 'O problema' })).toBeVisible();
  });
});

test.describe('Home, privacidade e 404', () => {
  test('home é independente e só expõe a landing no rodapé', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page).toHaveTitle(/Monteiro Veloso Advogados/);

    const navLinks = await page
      .locator('header nav a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));
    expect(navLinks.length).toBeGreaterThan(0);
    expect(navLinks.every((href) => !href.includes('/defesa-busca-e-apreensao-veiculo'))).toBe(
      true,
    );
    await expect(page.locator('#escritorio')).toHaveCount(1);
    await expect(page.locator('#areas')).toHaveCount(1);
    await expect(page.locator('#contato')).toHaveCount(1);

    const landingLinks = page.locator('a[href*="/defesa-busca-e-apreensao-veiculo"]');
    await expect(landingLinks).toHaveCount(1);
    await expect(landingLinks.first()).toHaveAttribute(
      'href',
      '/defesa-busca-e-apreensao-veiculo/',
    );

    await page.locator('footer').getByRole('link', { name: 'Áreas de atuação' }).click();
    await expect(page).toHaveURL(/#areas$/);
  });

  test('home reúne seções, mapa e formulário com fonte própria', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Aceitar', exact: true }).click();

    for (const id of [
      '#escritorio',
      '#areas',
      '#como-funciona',
      '#duvidas',
      '#atendimento',
      '#localizacao',
      '#contato',
    ]) {
      await expect(page.locator(id)).toHaveCount(1);
    }

    await expect(page.locator('#atendimento svg.brazil-map path')).toHaveCount(27);
    await expect(page.getByText('Atendimento online: todos os estados')).toBeVisible();

    await expect(page.locator('main details')).toHaveCount(6);

    const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
    const graph = JSON.parse(jsonLd ?? '{}')['@graph'] as Array<Record<string, unknown>>;
    expect(graph.map((node) => node['@type'])).toContain('FAQPage');

    await page.locator('#localizacao [data-map-load]').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Carregar mapa' }).click();
    await expect(page.locator('iframe[title^="Mapa do escritório"]')).toBeVisible();

    await page.locator('#contato').scrollIntoViewIfNeeded();
    await page.locator('form[data-hydrated="true"]').waitFor();
    await page.getByLabel('Nome').fill('Ana Home');
    await page.getByRole('textbox', { name: 'WhatsApp' }).fill('(71) 98888-7777');
    await page.getByLabel('Qual é a sua situação?').selectOption('atraso');
    await page.getByLabel(/Autorizo o contato/).check();
    await page.waitForTimeout(1700);
    await page.getByRole('button', { name: 'Solicitar contato' }).click();
    await expect(page.getByRole('heading', { name: 'Recebemos sua solicitação.' })).toBeVisible();

    const request = await page.request.get('http://127.0.0.1:4444/requests');
    const leads = (await request.json()) as Array<{ phone?: string; source?: string }>;
    const mine = leads.filter((lead) => lead.phone === '+5571988887777');
    expect(mine.length).toBeGreaterThan(0);
    expect(mine.at(-1)?.source).toBe('home');
  });

  test('privacidade é indexável e explica cookies', async ({ page }) => {
    await page.goto('/politica-de-privacidade/');
    await expect(page.locator('main h1')).toContainText('Política de Privacidade');
    await expect(page.getByText('Cookies e análise de uso')).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /index, follow/);
  });

  test('404 tem noindex e caminho de volta', async ({ page }) => {
    const response = await page.goto('/pagina-que-nao-existe/');
    expect(response?.status()).toBe(404);
    await expect(page.locator('main h1')).toContainText('não foi encontrada');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.getByRole('link', { name: /Voltar ao início/ })).toBeVisible();
  });
});
