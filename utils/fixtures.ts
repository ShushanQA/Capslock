import { test as base } from '@playwright/test';
import { FormPage } from '../pages/FormPage';

/**
 * Playwright fixtures for test setup
 * Fixtures provide a better way to share page objects across tests
 */

type MyFixtures = {
  formPage: FormPage;
};

export const test = base.extend<MyFixtures>({
  formPage: async ({ page }, use) => {
    const formPage = new FormPage(page);
    await formPage.goto();
    await use(formPage);
  },
});

export { expect } from '@playwright/test';
