import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { loadEnv } from 'vite';

const allowPlaceholders = process.argv.includes('--allow-placeholders');
const env = loadEnv('production', process.cwd(), '');
const apiKey = (process.env.GOOGLE_PLACES_API_KEY || env.GOOGLE_PLACES_API_KEY || '').trim();
const dist = path.resolve('dist');
const errors: string[] = [];
const warnings: string[] = [];

const requiredFiles = [
  'index.html',
  'defesa-busca-e-apreensao-veiculo/index.html',
  'politica-de-privacidade/index.html',
  '404.html',
  'sitemap-index.xml',
  'sitemap-0.xml',
  'robots.txt',
  '.htaccess',
  'favicon.png',
  'apple-touch-icon.png',
  'og/og-default.png',
  'og/logo.png',
  'scripts/boot.js',
];

async function exists(relative: string): Promise<boolean> {
  try {
    await stat(path.join(dist, relative));
    return true;
  } catch {
    return false;
  }
}

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

function count(html: string, regex: RegExp): number {
  return [...html.matchAll(regex)].length;
}

function findForbiddenKeys(value: unknown, found: string[] = []): string[] {
  if (Array.isArray(value)) {
    for (const item of value) findForbiddenKeys(item, found);
    return found;
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      if (key === 'aggregateRating' || key === 'review' || key === 'priceRange') found.push(key);
      findForbiddenKeys(child, found);
    }
  }
  return found;
}

for (const file of requiredFiles) {
  if (!(await exists(file))) errors.push(`Arquivo obrigatório ausente em dist/: ${file}`);
}

const sitemap = await readFile(path.join(dist, 'sitemap-0.xml'), 'utf8').catch(() => '');
if (sitemap.includes('404')) errors.push('O sitemap inclui a página 404.');
if (!sitemap.includes('https://monteiroveloso.com/')) {
  errors.push('O sitemap não contém a home canônica.');
}

const robots = await readFile(path.join(dist, 'robots.txt'), 'utf8').catch(() => '');
if (!robots.includes('Sitemap: https://monteiroveloso.com/sitemap-index.xml')) {
  errors.push('robots.txt não aponta para o sitemap-index.xml.');
}

const htaccess = await readFile(path.join(dist, '.htaccess'), 'utf8').catch(() => '');
if (!htaccess.includes('ErrorDocument 404 /404.html')) {
  errors.push('.htaccess sem ErrorDocument para /404.html.');
}

const allFiles = await walk(dist);
const textFiles = allFiles.filter((file) => /\.(html|js|css|txt|xml|json)$/i.test(file));

if (allFiles.some((file) => file.endsWith('.map'))) {
  errors.push('dist contém source maps; remova-os antes do deploy.');
}

if (apiKey) {
  const keyBytes = Buffer.from(apiKey, 'utf8');
  for (const file of allFiles) {
    const content = await readFile(file);
    if (content.includes(keyBytes)) {
      errors.push(
        `${path.relative(dist, file).replaceAll('\\', '/')}: contém o valor literal da GOOGLE_PLACES_API_KEY.`,
      );
    }
  }
}

for (const file of textFiles) {
  let content: string;
  try {
    content = new TextDecoder('utf-8', { fatal: true }).decode(await readFile(file));
  } catch {
    errors.push(`${path.relative(dist, file)}: não é UTF-8 válido.`);
    continue;
  }

  const relative = path.relative(dist, file).replaceAll('\\', '/');

  if (content.includes('\uFFFD')) {
    errors.push(`${relative}: contém caractere de substituição (U+FFFD).`);
  }

  if (!allowPlaceholders && content.includes('[PREENCHER]')) {
    errors.push(`${relative}: contém [PREENCHER].`);
  }
  if (content.includes('NEXT_PUBLIC_')) {
    errors.push(`${relative}: contém variável NEXT_PUBLIC_.`);
  }
  if (/AIza[0-9A-Za-z_-]{35}/.test(content)) {
    errors.push(`${relative}: contém possível chave da API do Google exposta no bundle.`);
  }
  if (/https?:\/\/(localhost|127\.0\.0\.1)/.test(content)) {
    errors.push(`${relative}: contém URL de localhost.`);
  }
}

const htmlFiles = textFiles.filter((file) => file.endsWith('.html'));

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const relative = path.relative(dist, file).replaceAll('\\', '/');

  if (!/<meta charset="utf-8"/i.test(html)) {
    errors.push(`${relative}: sem meta charset UTF-8.`);
  }

  const visibleHtml = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/\s(?:href|src|srcset|action)="[^"]*"/gi, ' ');
  if (/[\p{L}]\?[\p{L}]/u.test(visibleHtml)) {
    errors.push(`${relative}: possível caractere corrompido (palavra com "?").`);
  }

  if (count(html, /<h1\b/gi) !== 1) {
    errors.push(`${relative}: deve ter exatamente um H1.`);
  }

  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '';
  if (!title) errors.push(`${relative}: sem <title>.`);
  if (title.length > 60) warnings.push(`${relative}: title com ${title.length} caracteres (>60).`);

  const description = html.match(/<meta name="description" content="([^"]*)"/i)?.[1] ?? '';
  if (!description) errors.push(`${relative}: sem meta description.`);
  if (description.length > 160) {
    warnings.push(`${relative}: description com ${description.length} caracteres (>160).`);
  }

  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  if (!canonical) {
    errors.push(`${relative}: sem canonical.`);
  } else {
    if (!canonical.startsWith('https://monteiroveloso.com/')) {
      errors.push(`${relative}: canonical fora do domínio.`);
    }
    if (!canonical.endsWith('/') && !canonical.endsWith('/404.html')) {
      errors.push(`${relative}: canonical sem barra final.`);
    }
  }

  if (relative === '404.html') {
    const robotsMeta = html.match(/<meta name="robots" content="([^"]+)"/i)?.[1] ?? '';
    if (!robotsMeta.includes('noindex')) errors.push('404.html sem noindex.');
  }

  for (const match of html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi,
  )) {
    try {
      const parsed = JSON.parse(match[1]);
      const forbidden = findForbiddenKeys(parsed);
      if (forbidden.length > 0) {
        errors.push(`${relative}: JSON-LD contém ${[...new Set(forbidden)].join(', ')}.`);
      }
      const serialized = JSON.stringify(parsed).replace(/https?:\/\/[^"]+/g, ' ');
      if (/[\p{L}]\?[\p{L}]/u.test(serialized)) {
        errors.push(`${relative}: JSON-LD com possível caractere corrompido (palavra com "?").`);
      }
    } catch {
      errors.push(`${relative}: JSON-LD inválido.`);
    }
  }
}

const lpHtml = await readFile(
  path.join(dist, 'defesa-busca-e-apreensao-veiculo/index.html'),
  'utf8',
);
if (!lpHtml.includes('FAQPage')) errors.push('LP sem FAQPage no JSON-LD.');
if (!lpHtml.includes('Solicitar contato')) errors.push('LP sem o formulário pré-renderizado.');
if (!lpHtml.includes('data-consent-banner')) errors.push('LP sem banner de consentimento.');

if (!(await exists('_astro'))) errors.push('Pasta _astro ausente.');

if (warnings.length > 0) {
  console.log('\nAvisos:');
  for (const warning of warnings) console.log(`  • ${warning}`);
}

if (errors.length > 0) {
  console.log('\nFalhas no dist:');
  for (const error of errors) console.log(`  ✗ ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    allowPlaceholders
      ? '\ncheck:dist OK (preview com placeholders permitidos).'
      : '\ncheck:dist OK: artefatos de produção consistentes.',
  );
}
