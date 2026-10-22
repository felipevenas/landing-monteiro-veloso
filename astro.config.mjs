import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://monteiroveloso.com',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  build: {
    format: 'directory',
  },
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('404'),
    }),
    icon(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
