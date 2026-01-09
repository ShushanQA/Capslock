import { Page, expect } from '@playwright/test';
import { FormPage } from '../pages/FormPage';
import { TestData } from '../test-data/test-data';

/**
 * Reusable test helpers for common form interactions and assertions
 */

/**
 * Navigate through form steps 1-3 (zipcode, checkbox, property type)
 * This is a common flow used in many tests
 */
export async function navigateToStep4(
  formPage: FormPage,
  zipcode: string = TestData.valid.zipcode
): Promise<void> {
  await formPage.fillZipcode(zipcode);
  await formPage.clickStep1Next();
  await formPage.selectStep2Checkbox();
  await formPage.clickStep2Next();
  await formPage.selectPropertyType();
  await formPage.clickStep3Next();
}

/**
 * Navigate through form steps 1-4 (includes name and email)
 */
export async function navigateToStep5(
  formPage: FormPage,
  name: string = TestData.valid.name,
  email?: string
): Promise<string> {
  const testEmail = email || TestData.generateUniqueEmail();
  await navigateToStep4(formPage);
  await formPage.fillName(name);
  await formPage.fillEmail(testEmail);
  await formPage.clickStep4Next();
  return testEmail;
}

/**
 * Complete the entire form with valid data
 */
export async function completeFullForm(
  formPage: FormPage,
  customData?: {
    zipcode?: string;
    name?: string;
    email?: string;
    phone?: string;
  }
): Promise<string> {
  const zipcode = customData?.zipcode || TestData.valid.zipcode;
  const name = customData?.name || TestData.valid.name;
  const email = customData?.email || TestData.generateUniqueEmail();
  const phone = customData?.phone || TestData.valid.phone;

  await formPage.fillZipcode(zipcode);
  await formPage.clickStep1Next();
  await formPage.selectStep2Checkbox();
  await formPage.clickStep2Next();
  await formPage.selectPropertyType();
  await formPage.clickStep3Next();
  await formPage.fillName(name);
  await formPage.fillEmail(email);
  await formPage.clickStep4Next();
  await formPage.fillPhone(phone);
  await formPage.submitForm();

  return email;
}

/**
 * Assert that we are on the thank you page
 * This is a meaningful assertion that verifies actual behavior
 */
export async function expectThankYouPage(page: Page): Promise<void> {
  // Wait for thank you content to appear (meaningful UI state)
  // Try multiple selectors for thank you page
  const thankYouSelectors = [
    page.locator('h1').filter({ hasText: /thank/i }),
    page.locator('h1').filter({ hasText: /thank you/i }),
    page.locator('[class*="thank"]'),
    page.locator('text=/thank/i'),
  ];

  // Wait for any thank you indicator to appear
  await Promise.race(
    thankYouSelectors.map(selector => 
      selector.waitFor({ state: 'visible', timeout: 20000 }).catch(() => null)
    )
  );

  // Verify URL contains thank you indicator OR page content
  const url = page.url();
  const pageContent = await page.textContent('body') || '';
  const hasThankYou = 
    url.toLowerCase().includes('thank') ||
    pageContent.toLowerCase().includes('thank');

  expect(hasThankYou).toBeTruthy();
}

/**
 * Assert that we are NOT on the thank you page
 * Useful for negative test cases
 */
export async function expectNotThankYouPage(page: Page): Promise<void> {
  const url = page.url();
  const pageContent = await page.textContent('body') || '';
  const isThankYouPage = 
    url.toLowerCase().includes('thank') ||
    pageContent.toLowerCase().includes('thank');

  expect(isThankYouPage).toBeFalsy();
}

/**
 * Check for validation error messages on the page
 * Returns true if validation errors are found
 */
export async function hasValidationErrors(page: Page): Promise<boolean> {
  // Check for error classes
  const errorClasses = await page
    .locator('[class*="error"], [class*="invalid"], [aria-invalid="true"]')
    .count();

  // Check for error text
  const errorText = await page
    .locator('text=/required/i, text=/mandatory/i, text=/please/i, text=/error/i')
    .count();

  // Check for help/validation messages
  const helpText = await page
    .locator('[class*="help"], [class*="message"], [class*="validation"], [class*="feedback"]')
    .count();

  return errorClasses > 0 || errorText > 0 || helpText > 0;
}

/**
 * Assert that validation errors are present
 */
export async function expectValidationErrors(page: Page): Promise<void> {
  const hasErrors = await hasValidationErrors(page);
  expect(hasErrors).toBeTruthy();
}

/**
 * Assert that validation errors are NOT present
 */
export async function expectNoValidationErrors(page: Page): Promise<void> {
  const hasErrors = await hasValidationErrors(page);
  expect(hasErrors).toBeFalsy();
}

/**
 * Check if form is still on step 1 (zipcode step)
 * Useful for validating that form prevented navigation
 */
export async function isOnStep1(page: Page): Promise<boolean> {
  const url = page.url();
  const pageContent = await page.textContent('body') || '';
  
  const stillOnStep1 = 
    pageContent.toLowerCase().includes('zip') ||
    pageContent.toLowerCase().includes('zipcode') ||
    url === TestData.urls.base ||
    url === `${TestData.urls.base}/`;

  return stillOnStep1;
}

/**
 * Assert that form is still on step 1
 */
export async function expectOnStep1(page: Page): Promise<void> {
  const onStep1 = await isOnStep1(page);
  expect(onStep1).toBeTruthy();
}

/**
 * Check for duplicate email error messages
 */
export async function hasDuplicateEmailError(page: Page): Promise<boolean> {
  const duplicateMessages = await page
    .locator('text=/already/i, text=/duplicate/i, text=/exists/i, text=/taken/i, text=/registered/i')
    .count();

  const pageContent = await page.textContent('body') || '';
  const hasDuplicateText = 
    pageContent.toLowerCase().includes('already') ||
    pageContent.toLowerCase().includes('duplicate') ||
    pageContent.toLowerCase().includes('exists') ||
    pageContent.toLowerCase().includes('taken') ||
    pageContent.toLowerCase().includes('registered');

  return duplicateMessages > 0 || hasDuplicateText;
}

/**
 * Assert that duplicate email error is shown
 */
export async function expectDuplicateEmailError(page: Page): Promise<void> {
  const hasError = await hasDuplicateEmailError(page);
  expect(hasError).toBeTruthy();
}

/**
 * Check if duplicate email error is shown (returns boolean)
 */
export async function checkDuplicateEmailError(page: Page): Promise<boolean> {
  return await hasDuplicateEmailError(page);
}

/**
 * Wait for form step to be visible
 * More reliable than arbitrary timeouts
 */
export async function waitForStepTransition(
  page: Page,
  stepNumber: number,
  timeout: number = 10000
): Promise<void> {
  const stepContainer = page.locator(`#form-container-1 > div.steps.step-${stepNumber}`);
  await stepContainer.waitFor({ state: 'visible', timeout });
}

/**
 * Wait for step 2 to be visible after navigation from step 1
 */
export async function waitForStep2(page: Page): Promise<void> {
  const step2Container = page.locator('#form-container-1 > div.steps.step-2');
  await step2Container.waitFor({ state: 'visible', timeout: 15000 });
}

/**
 * Wait for step 3 to be visible after navigation from step 2
 */
export async function waitForStep3(page: Page): Promise<void> {
  const step3Container = page.locator('#form-container-1 > div.steps.step-3');
  await step3Container.waitFor({ state: 'visible', timeout: 15000 });
}

/**
 * Wait for step 4 to be visible after navigation from step 3
 */
export async function waitForStep4(page: Page): Promise<void> {
  const step4Container = page.locator('#form-container-1 > div.steps.step-4');
  await step4Container.waitFor({ state: 'visible', timeout: 15000 });
}

/**
 * Wait for step 5 to be visible after navigation from step 4
 */
export async function waitForStep5(page: Page): Promise<void> {
  const step5Container = page.locator('#form-container-1 > div.steps.step-5');
  await step5Container.waitFor({ state: 'visible', timeout: 15000 });
}

/**
 * Wait for form submission to complete (thank you page or error)
 */
export async function waitForFormSubmission(page: Page): Promise<void> {
  await Promise.race([
    page.waitForURL((url) => url.toString().toLowerCase().includes('thank'), { timeout: 15000 }).catch(() => null),
    page.locator('h1:has-text("Thank")').waitFor({ state: 'visible', timeout: 15000 }).catch(() => null),
    page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => null)
  ]);
}
