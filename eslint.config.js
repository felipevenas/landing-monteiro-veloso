import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

const featureDeepImport = {
  group: [
    '@/features/*/domain/*',
    '@/features/*/application/*',
    '@/features/*/infrastructure/*',
    '@/features/*/ui/*',
    '@/features/*/content/*',
  ],
  message: 'Importe outra feature apenas pelo index.ts público.',
};

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      '.playwright-mcp/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs['flat/recommended'],
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['src/features/**/*.{ts,tsx,astro}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [featureDeepImport] }],
    },
  },
  {
    files: ['src/features/**/*.astro'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [featureDeepImport] }],
    },
  },
  {
    files: ['src/features/*/domain/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                'astro:*',
                'react',
                'react-dom',
                'zod',
                '@/features/*',
                '@/shared/config/*',
                '@/shared/seo/*',
                '@/shared/ui/*',
                '@/pages/*',
                '@/layouts/*',
              ],
              message: 'O domínio deve ser TypeScript puro e independente de UI/infra.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/features/*/application/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                'astro:*',
                'react',
                'react-dom',
                '@/features/*/infrastructure/*',
                '@/shared/ui/*',
              ],
              message: 'A aplicação não conhece UI nem adaptadores concretos.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/features/*/ui/**/*.{ts,tsx,astro}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*/infrastructure/*'],
              message: 'A UI importa infraestrutura apenas via composition.ts.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/pages/**/*.{astro,ts}', 'src/layouts/**/*.astro'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  {
    files: ['src/shared/**/*.{ts,tsx,astro}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*', '@/pages/*', '@/layouts/*'],
              message: 'shared não pode depender de features, pages ou layouts.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['public/scripts/**/*.js'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['tests/e2e/**/*.mjs', 'scripts/**/*.ts', '*.config.{js,ts,mjs}'],
    languageOptions: {
      globals: globals.node,
    },
  },
);
