import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const NAVY = { r: 10, g: 22, b: 40, alpha: 1 };
const brandLogo = 'src/assets/brand/logo-color.png';
const whiteLogo = 'src/assets/brand/logo-branco.png';

await mkdir('public/og', { recursive: true });

// Monograma branco para favicon/apple-touch-icon.
const monogram = await sharp(whiteLogo)
  .extract({ left: 115, top: 0, width: 630, height: 400 })
  .resize(56, 56, { fit: 'contain', background: NAVY })
  .png()
  .toBuffer();

await sharp({ create: { width: 64, height: 64, channels: 4, background: NAVY } })
  .composite([{ input: monogram, gravity: 'center' }])
  .png()
  .toFile('public/favicon.png');

const appleMonogram = await sharp(whiteLogo)
  .extract({ left: 115, top: 0, width: 630, height: 400 })
  .resize(156, 156, { fit: 'contain', background: NAVY })
  .png()
  .toBuffer();

await sharp({ create: { width: 180, height: 180, channels: 4, background: NAVY } })
  .composite([{ input: appleMonogram, gravity: 'center' }])
  .png()
  .toFile('public/apple-touch-icon.png');

// Logo para o schema.org, em fundo branco.
await sharp(brandLogo)
  .flatten({ background: '#ffffff' })
  .resize(460, 460, { fit: 'contain', background: '#ffffff' })
  .extend({ top: 26, bottom: 26, left: 26, right: 26, background: '#ffffff' })
  .png()
  .toFile('public/og/logo.png');

// Card social 1200x630.
const ogSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#2E63A8" stop-opacity="0.42"/>
      <stop offset="100%" stop-color="#2E63A8" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#9DBBE0" stop-opacity="0"/>
      <stop offset="50%" stop-color="#9DBBE0" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#9DBBE0" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#0A1628"/>
  <circle cx="1080" cy="70" r="330" fill="url(#g1)"/>
  <circle cx="1160" cy="580" r="250" fill="#1A3B6F" opacity="0.45"/>
  <path d="M0 560 L1200 390" stroke="url(#line)" stroke-width="1"/>
  <text x="80" y="286" fill="#9DBBE0" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="bold" letter-spacing="4">ADVOCACIA BANCÁRIA · SALVADOR/BA</text>
  <text x="80" y="366" fill="#FFFFFF" font-family="Georgia, 'Times New Roman', serif" font-size="62">Busca e apreensão</text>
  <text x="80" y="432" fill="#FFFFFF" font-family="Georgia, 'Times New Roman', serif" font-size="62">de veículo</text>
  <text x="80" y="492" fill="#C3D6EC" font-family="Arial, Helvetica, sans-serif" font-size="21">Entenda o próximo passo com orientação individualizada.</text>
  <text x="80" y="578" fill="#9DBBE0" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="bold" letter-spacing="3">MONTEIROVELOSO.COM</text>
</svg>`;

const logoForOg = await sharp(whiteLogo).resize({ height: 140 }).png().toBuffer();

await sharp(Buffer.from(ogSvg))
  .composite([{ input: logoForOg, left: 80, top: 55 }])
  .png()
  .toFile('public/og/og-default.png');

console.log('Assets gerados: favicon.png, apple-touch-icon.png, og/logo.png, og/og-default.png');
