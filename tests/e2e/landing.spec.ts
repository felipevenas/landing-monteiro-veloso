import { test, expect } from '@playwright/test';

test.describe('Landing de busca e apreensão', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/defesa-busca-e-apreensao-veiculo/');
  });

  test('entrega HTML único, canonical, schema e FAQ visível', async ({ page }) => {
    await expect(page).toHaveTitle(/Carro apreendido/);
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

  test('aplica a copy revisada do hero, diferenciais e prazos', async ({ page }) => {
    const hero = page.locator('main section').first();

    await expect(hero.locator('h1')).toContainText('Seu veículo foi apreendido?');
    await expect(hero).toContainText('Cada dia conta.');
    await expect(hero).toContainText('O banco tem prazos, procedimentos e uma equipe jurídica.');
    await expect(hero).toContainText(
      'Uma análise jurídica do contrato e do processo pode ajudar a identificar irregularidades',
    );
    await expect(hero).toContainText('Atuação especializada em busca e apreensão de veículos');
    await expect(hero).toContainText(
      'Atendimento direto com a advogada, em Salvador ou on-line para todo o Brasil.',
    );
    await expect(
      hero.getByRole('link', { name: /Falar com a advogada especialista agora/ }),
    ).toBeVisible();
    await expect(hero).toContainText('Salvador — atendimento presencial');
    await expect(hero).toContainText('Atendimento on-line em todo o Brasil.');

    await expect(
      page.getByText(
        'Analisamos o contrato e o processo de forma individualizada, considerando as particularidades de cada cliente.',
      ),
    ).toBeVisible();
    await expect(
      page.getByText('Suas informações são tratadas com o sigilo ético da advocacia.'),
    ).toBeVisible();
    await expect(
      page.getByText(
        'Atendimento direto com a advogada responsável pelo seu caso, com orientação individualizada.',
      ),
    ).toBeVisible();

    const timeline = page.locator('#prazo');
    await expect(timeline).toContainText(
      'Se o seu veículo foi apreendido, os prazos já começaram a correr!',
    );
    await expect(timeline).toContainText(
      'A execução da liminar de busca e apreensão dá início a prazos processuais importantes.',
    );
    await expect(timeline).toContainText('Não espere para entender sua situação.');
    await expect(
      timeline.getByRole('link', {
        name: /Fale com a advogada e saiba quais medidas podem ser avaliadas/,
      }),
    ).toBeVisible();
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
    await page.goto('/');
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
    await page.locator('header details').getByRole('link', { name: 'Prazos' }).click();
    await expect(page).toHaveURL(/#prazo$/);
  });

  test('WhatsApp flutuante fica visível no mobile após o consentimento', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Aceitar', exact: true }).click();

    const float = page.locator('[data-wa-location="float"]');
    await expect(float).toBeVisible();
    const box = await float.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(390);
    expect(await float.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe(
      'rgb(37, 211, 102)',
    );
  });

  test('bio da landing usa o retrato novo em 2:3', async ({ page }) => {
    const bio = page.locator('section[aria-labelledby="sobre-title"]');
    const image = bio.locator('img').first();

    await expect(image).toHaveAttribute('alt', /blusa rosa/);
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth), {
        timeout: 15_000,
      })
      .toBeGreaterThan(0);

    const source = (await image.getAttribute('src')) ?? '';
    expect(source).toContain('roberta-hero');
    expect(source).not.toContain('roberta-bio');

    const box = await image.boundingBox();
    expect(box).not.toBeNull();
    expect((box?.width ?? 0) / (box?.height ?? 1)).toBeCloseTo(2 / 3, 1);
    await expect(bio.getByText('Dra. Roberta Veloso', { exact: true })).toBeVisible();
  });

  test('header da landing mantém três âncoras e não expõe Instagram', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    const nav = page.locator('header nav[aria-label="Navegação principal"]');
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('link')).toHaveCount(3);
    await expect(nav.getByRole('link')).toHaveText(['Prazos', 'Serviços', 'Dúvidas']);
    expect(await page.locator('header a[href*="#instagram"]').count()).toBe(0);
  });

  test('Instagram só carrega o embed depois do consentimento', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('script[src*="instagram.com/embed.js"]')).toHaveCount(0);
    await expect(page.getByText(/Os vídeos são carregados pelo Instagram/)).toBeVisible();

    await page.getByRole('button', { name: 'Aceitar', exact: true }).click();
    await page.locator('#instagram').scrollIntoViewIfNeeded();

    await expect(page.locator('script[src*="instagram.com/embed.js"]')).toHaveCount(1);

    await page.locator('footer').getByRole('button', { name: 'Preferências de cookies' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-consent', 'undecided');
    await expect(page.locator('script[src*="instagram.com/embed.js"]')).toHaveCount(0);
    await expect(page.getByRole('link', { name: /Ver o post 1 no Instagram/ })).toBeVisible();

    await page.getByRole('button', { name: 'Aceitar', exact: true }).click();
    await expect(page.locator('[data-instagram-note]')).toBeHidden();
  });
});

test.describe('Instagram na landing de busca e apreensão', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/defesa-busca-e-apreensao-veiculo/');
  });

  test('renderiza uma seção com três vídeos e fallback sem terceiros', async ({ page }) => {
    const section = page.locator('#instagram');
    await expect(section).toHaveCount(1);
    await expect(section).toHaveAttribute('aria-labelledby', 'instagram-title');
    await expect(section.locator('h2')).toHaveText('Busca e apreensão, explicada em vídeo.');
    await expect(section.locator('.instagram-media')).toHaveCount(3);
    await expect(section.locator('[data-instagram-track]')).toHaveAttribute(
      'aria-label',
      'Vídeos sobre busca e apreensão no Instagram',
    );

    for (const position of [1, 2, 3]) {
      const fallback = section.getByRole('link', { name: `Ver o post ${position} no Instagram` });
      await expect(fallback).toBeVisible();
      await expect(fallback).toHaveAttribute('target', '_blank');
      await expect(fallback).toHaveAttribute('rel', /noopener/);
    }

    await expect(page.locator('script[src*="instagram.com/embed.js"]')).toHaveCount(0);
    await expect(page.locator('#instagram iframe')).toHaveCount(0);
    await expect(section.locator('[data-instagram-note]')).toContainText(
      'só aparecem depois que você aceita os cookies',
    );
  });

  test('carrega os embeds só depois do consentimento e sem overflow durante a medição', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.route('**/embed.js*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: `window.instgrm={Embeds:{process:function(){document.querySelectorAll('[data-instagram-track] blockquote').forEach(function(block){var frame=document.createElement('iframe');frame.src='about:blank';frame.setAttribute('style','position:absolute;width:302px;height:600px');block.replaceChildren(frame);});window.__qaSettle=function(){document.querySelectorAll('#instagram iframe').forEach(function(frame){frame.setAttribute('style','display:block;width:302px;height:600px;border:0');});};}}};`,
      }),
    );

    await expect(page.locator('script[src*="instagram.com/embed.js"]')).toHaveCount(0);

    await page.getByRole('button', { name: 'Aceitar', exact: true }).click();
    await page.locator('#instagram').scrollIntoViewIfNeeded();

    await expect(page.locator('script[src*="instagram.com/embed.js"]')).toHaveCount(1);
    await expect(page.locator('#instagram iframe')).toHaveCount(3);

    // O Instagram posiciona o iframe em absolute enquanto mede: o card precisa contê-lo.
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      321,
    );
    expect(await page.evaluate(() => document.body.scrollWidth)).toBeLessThanOrEqual(321);

    const titles = await page
      .locator('#instagram iframe')
      .evaluateAll((frames) => frames.map((frame) => frame.getAttribute('title') ?? ''));
    expect(titles).toEqual(['Post 1 do Instagram', 'Post 2 do Instagram', 'Post 3 do Instagram']);

    await expect(page.locator('#instagram [data-instagram-note]')).toBeHidden();
    await expect(page.locator('#instagram a[href*="instagram.com/p/"]')).toHaveCount(0);

    await page.evaluate(() => {
      (window as unknown as { __qaSettle?: () => void }).__qaSettle?.();
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      321,
    );
  });

  test('mantém o fallback quando o embed do Instagram falha', async ({ page }) => {
    await page.route('**/embed.js*', (route) => route.abort());

    await page.getByRole('button', { name: 'Aceitar', exact: true }).click();
    await page.locator('#instagram').scrollIntoViewIfNeeded();

    await expect(page.locator('#instagram [data-instagram-note]')).toContainText(
      'Não foi possível carregar os vídeos agora',
    );
    await expect(page.locator('#instagram iframe')).toHaveCount(0);
    for (const position of [1, 2, 3]) {
      await expect(
        page.locator('#instagram').getByRole('link', {
          name: new RegExp(`Ver o post ${position} no Instagram`),
        }),
      ).toHaveCount(1);
    }
  });
});

test.describe('Home, privacidade e 404', () => {
  test('hero da home expõe a foto da equipe em 4:3', async ({ page }) => {
    await page.goto('/');

    const hero = page.locator('main section').first();
    const image = hero.locator('img').first();
    await expect(image).toHaveAttribute('alt', /Equipe de cinco advogadas/);
    await expect(image).toBeVisible();
    await expect
      .poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth), {
        timeout: 15_000,
      })
      .toBeGreaterThan(0);

    const source = (await image.getAttribute('src')) ?? '';
    expect(source).toContain('equipe-monteiro-veloso');

    await expect(hero.getByText('Equipe Monteiro Veloso', { exact: true })).toBeVisible();
    await expect(hero.getByText('Direito bancário / OAB/BA 78.424', { exact: true })).toBeVisible();

    const box = await image.boundingBox();
    expect(box).not.toBeNull();
    expect((box?.width ?? 0) / (box?.height ?? 1)).toBeCloseTo(4 / 3, 1);
  });

  test('home mantém quatro posts no carrossel do Instagram', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#instagram')).toHaveCount(1);
    await expect(page.locator('#instagram .instagram-media')).toHaveCount(4);
  });

  test('home exibe os diferenciais atualizados', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByText(
        'Analisamos o contrato e o processo de forma individualizada, considerando as particularidades de cada cliente.',
      ),
    ).toBeVisible();
    await expect(
      page.getByText('Suas informações são tratadas com o sigilo ético da advocacia.'),
    ).toBeVisible();
    await expect(
      page.getByText(
        'Atendimento direto com a advogada responsável pelo seu caso, com orientação individualizada.',
      ),
    ).toBeVisible();
  });

  test('home é independente e só expõe a landing no rodapé', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page).toHaveTitle(/Monteiro Veloso/);

    const navLinks = await page
      .locator('header nav a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));
    expect(navLinks.length).toBeGreaterThan(0);
    expect(navLinks.every((href) => !href.includes('/defesa-busca-e-apreensao-veiculo'))).toBe(
      true,
    );
    await expect(page.locator('#areas')).toHaveCount(1);
    await expect(page.locator('#avaliacoes')).toHaveCount(1);
    await expect(page.locator('#instagram')).toHaveCount(1);
    await expect(page.locator('#localizacao')).toHaveCount(1);
    await expect(page.locator('#contato')).toHaveCount(1);

    const landingLinks = page.locator('a[href*="/defesa-busca-e-apreensao-veiculo"]');
    expect(await landingLinks.count()).toBeGreaterThanOrEqual(1);
    await expect(landingLinks.first()).toHaveAttribute(
      'href',
      '/defesa-busca-e-apreensao-veiculo/',
    );

    await page.locator('footer').getByRole('link', { name: 'Serviços' }).click();
    await expect(page).toHaveURL(/#areas$/);
  });

  test('home reúne seções, mapa e formulário com fonte própria', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Aceitar', exact: true }).click();

    for (const id of ['#areas', '#avaliacoes', '#instagram', '#localizacao', '#contato']) {
      await expect(page.locator(id)).toHaveCount(1);
    }

    await expect(page.getByText('Segunda a sexta, das 8h às 16h30').first()).toBeVisible();
    await expect(page.getByText('Avaliações do Google').first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ver todas no Google' }).first()).toBeVisible();

    await expect(page.locator('main details')).toHaveCount(0);

    const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
    const graph = JSON.parse(jsonLd ?? '{}')['@graph'] as Array<Record<string, unknown>>;
    expect(graph.map((node) => node['@type'])).toContain('LegalService');
    expect(jsonLd).not.toContain('FAQPage');
    expect(jsonLd).not.toContain('aggregateRating');

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

  test('novo e-mail de contato aparece no rodapé e na política', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer a[href="mailto:roberta@monteiroveloso.com"]')).toHaveCount(1);

    await page.goto('/politica-de-privacidade/');
    await expect(
      page.locator('#conteudo').getByRole('link', { name: 'roberta@monteiroveloso.com' }),
    ).toBeVisible();
  });

  test('privacidade é indexável e explica cookies', async ({ page }) => {
    await page.goto('/politica-de-privacidade/');
    await expect(page.locator('main h1')).toContainText('Política de Privacidade');
    await expect(page.getByText('Cookies, análise de uso e conteúdo incorporado')).toBeVisible();
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
