import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  // Global timeout for each test (3 minutes)
  timeout: 180000,
  // Expect timeout for assertions (30 seconds)
  expect: {
    timeout: 30000,
  },
  reporter: [
    ['html'],
    ['list']
  ],
  use: {
    baseURL: 'https://test-qa.capslock.global',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Action timeout (30 seconds)
    actionTimeout: 30000,
    // Navigation timeout (60 seconds)
    navigationTimeout: 60000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  outputDir: 'test-results/',
});

