import { defineConfig, devices } from '@playwright/test';

const WEBHOOK_PORT = 4444;
const APP_PORT = 4322;
const webhook = `http://127.0.0.1:${WEBHOOK_PORT}/webhook`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://127.0.0.1:${APP_PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: [
    {
      command: 'node tests/e2e/mock-webhook.mjs',
      url: `http://127.0.0.1:${WEBHOOK_PORT}/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: `npx cross-env PUBLIC_N8N_WEBHOOK_URL=${webhook} npm run dev -- --port ${APP_PORT} --host 127.0.0.1`,
      url: `http://127.0.0.1:${APP_PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
