/** @type {import('prettier').Config} */
export default {
  plugins: ['prettier-plugin-astro'],
  singleQuote: true,
  semi: true,
  tabWidth: 2,
  printWidth: 100,
  trailingComma: 'all',
  overrides: [
    {
      files: '*.astro',
      options: { parser: 'astro' },
    },
  ],
};
