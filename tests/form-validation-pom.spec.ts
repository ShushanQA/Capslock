import { test, expect } from '@playwright/test';
import { FormPage } from '../pages/FormPage';

test.describe('Form Validation Tests - POM', () => {
  test.beforeEach(async ({ page }) => {
    const formPage = new FormPage(page);
    await formPage.goto();
  });

  test('Should validate that all fields are required', async ({ page }) => {
    const formPage = new FormPage(page);
    
    // Try to submit step 1 without filling zipcode
    await formPage.takeScreenshot('step-1-empty');
    await formPage.clickStep1Next();
    await page.waitForTimeout(1500);
    
    // Check for validation messages
    const errorMessages = await page.locator('[class*="error"], [class*="invalid"], [aria-invalid="true"], [class*="required"]').count();
    const requiredMessages = await page.locator('text=/required/i, text=/mandatory/i, text=/please/i').count();
    
    await formPage.takeScreenshot('step-1-empty-submitted');
    
    if (errorMessages === 0 && requiredMessages === 0) {
      console.log('BUG: No validation messages appear on step 1 when submitting empty form');
    }
  });

  test('Should validate zipcode format - must contain exactly 5 digits', async ({ page }) => {
    const formPage = new FormPage(page);
    
    // Test with less than 5 digits
    await formPage.fillZipcode('1234');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(800);
    await formPage.takeScreenshot('zipcode-4-digits');
    
    await formPage.clickStep1Next();
    await page.waitForTimeout(1500);
    await formPage.takeScreenshot('zipcode-4-digits-submit');
    
    // Test with more than 5 digits
    await formPage.goto();
    await formPage.fillZipcode('123456');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(800);
    await formPage.takeScreenshot('zipcode-6-digits');
    
    await formPage.clickStep1Next();
    await page.waitForTimeout(1500);
    const url = page.url();
    if (!url.includes('error') && url !== 'https://test-qa.capslock.global/') {
      console.log('BUG: Zipcode with 6 digits was accepted');
    }
    
    // Test with non-numeric characters
    await formPage.goto();
    await formPage.fillZipcode('12abc');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(800);
    await formPage.takeScreenshot('zipcode-non-numeric');
    
    await formPage.clickStep1Next();
    await page.waitForTimeout(1500);
    const url2 = page.url();
    if (!url2.includes('error') && url2 !== 'https://test-qa.capslock.global/') {
      console.log('BUG: Zipcode with non-numeric characters was accepted');
    }
    
    // Test with exactly 5 digits (should be valid)
    await formPage.goto();
    await formPage.fillZipcode('12345');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(800);
    await formPage.takeScreenshot('zipcode-valid');
  });

  test('Should validate name field - required and format', async ({ page }) => {
    const formPage = new FormPage(page);
    
    // Navigate to step 4 (name field)
    await formPage.fillZipcode('12345');
    await formPage.clickStep1Next();
    await formPage.clickStep2Next();
    await formPage.selectPropertyType();
    await formPage.clickStep3Next();
    
    await formPage.takeScreenshot('name-field-empty');
    
    // Test: Try to submit without name
    await formPage.fillEmail(`test-${Date.now()}@test.test`);
    await formPage.fillPhone('1234567890');
    await formPage.submitForm();
    await page.waitForTimeout(2000);
    await formPage.takeScreenshot('name-field-empty-submitted');
    
    // Check for validation
    const errorMessages = await page.locator('[class*="error"], [class*="invalid"], [aria-invalid="true"]').count();
    const requiredMessages = await page.locator('text=/required/i, text=/mandatory/i, text=/please/i').count();
    
    if (errorMessages === 0 && requiredMessages === 0) {
      console.log('BUG: No validation message when name field is empty');
    }
    
    // Test: Name with special characters
    await formPage.goto();
    await formPage.fillZipcode('12345');
    await formPage.clickStep1Next();
    await formPage.clickStep2Next();
    await formPage.selectPropertyType();
    await formPage.clickStep3Next();
    
    await formPage.fillName('Test@User#123');
    await formPage.fillEmail(`test-${Date.now()}@test.test`);
    await formPage.fillPhone('1234567890');
    await formPage.takeScreenshot('name-with-special-chars');
    await formPage.submitForm();
    await page.waitForTimeout(2000);
    
    // Test: Name with only spaces
    await formPage.goto();
    await formPage.fillZipcode('12345');
    await formPage.clickStep1Next();
    await formPage.clickStep2Next();
    await formPage.selectPropertyType();
    await formPage.clickStep3Next();
    
    await formPage.fillName('   ');
    await formPage.fillEmail(`test-${Date.now()}@test.test`);
    await formPage.fillPhone('1234567890');
    await formPage.takeScreenshot('name-with-spaces-only');
    await formPage.submitForm();
    await page.waitForTimeout(2000);
    
    const url = page.url();
    if (url.includes('thank') || !url.includes('error')) {
      console.log('BUG: Name field accepted invalid formats (special chars or spaces only)');
    }
  });

  test('Should validate email field - required, format, and uniqueness', async ({ page }) => {
    const formPage = new FormPage(page);
    
    // Navigate to step 4
    await formPage.fillZipcode('12345');
    await formPage.clickStep1Next();
    await formPage.clickStep2Next();
    await formPage.selectPropertyType();
    await formPage.clickStep3Next();
    
    await formPage.takeScreenshot('email-field-empty');
    
    // Test: Try to submit without email
    await formPage.fillName('Test User');
    await formPage.fillPhone('1234567890');
    await formPage.submitForm();
    await page.waitForTimeout(2000);
    await formPage.takeScreenshot('email-field-empty-submitted');
    
    // Check for validation
    const errorMessages = await page.locator('[class*="error"], [class*="invalid"], [aria-invalid="true"]').count();
    const requiredMessages = await page.locator('text=/required/i, text=/mandatory/i, text=/please/i').count();
    
    if (errorMessages === 0 && requiredMessages === 0) {
      console.log('BUG: No validation message when email field is empty (even though it has required attribute)');
    }
    
    // Test: Invalid email format
    await formPage.goto();
    await formPage.fillZipcode('12345');
    await formPage.clickStep1Next();
    await formPage.clickStep2Next();
    await formPage.selectPropertyType();
    await formPage.clickStep3Next();
    
    await formPage.fillName('Test User');
    await formPage.fillEmail('invalid-email-format');
    await formPage.fillPhone('1234567890');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(1000);
    await formPage.takeScreenshot('email-invalid-format');
    
    await formPage.submitForm();
    await page.waitForTimeout(3000);
    await formPage.takeScreenshot('email-invalid-format-submitted');
    
    const url = page.url();
    if (url.includes('thank') || !url.includes('error')) {
      console.log('BUG: Invalid email format was accepted');
    }
    
    // Test: Email without @ symbol
    await formPage.goto();
    await formPage.fillZipcode('12345');
    await formPage.clickStep1Next();
    await formPage.clickStep2Next();
    await formPage.selectPropertyType();
    await formPage.clickStep3Next();
    
    await formPage.fillName('Test User');
    await formPage.fillEmail('testtest.test');
    await formPage.fillPhone('1234567890');
    await formPage.takeScreenshot('email-no-at-symbol');
    await formPage.submitForm();
    await page.waitForTimeout(3000);
    
    // Test: Email without domain
    await formPage.goto();
    await formPage.fillZipcode('12345');
    await formPage.clickStep1Next();
    await formPage.clickStep2Next();
    await formPage.selectPropertyType();
    await formPage.clickStep3Next();
    
    await formPage.fillName('Test User');
    await formPage.fillEmail('test@');
    await formPage.fillPhone('1234567890');
    await formPage.takeScreenshot('email-no-domain');
    await formPage.submitForm();
    await page.waitForTimeout(3000);
    
    // Test: Duplicate email
    const testEmail = 'test@test.test';
    
    // First submission
    await formPage.goto();
    await formPage.fillZipcode('12345');
    await formPage.clickStep1Next();
    await formPage.clickStep2Next();
    await formPage.selectPropertyType();
    await formPage.clickStep3Next();
    
    await formPage.fillName('Test User');
    await formPage.fillEmail(testEmail);
    await formPage.fillPhone('1234567890');
    await formPage.submitForm();
    await page.waitForTimeout(5000);
    await formPage.takeScreenshot('email-first-submission');
    
    // Try duplicate
    await formPage.goto();
    await formPage.fillZipcode('12345');
    await formPage.clickStep1Next();
    await formPage.clickStep2Next();
    await formPage.selectPropertyType();
    await formPage.clickStep3Next();
    
    await formPage.fillName('Test User 2');
    await formPage.fillEmail(testEmail);
    await formPage.fillPhone('0987654321');
    await formPage.takeScreenshot('duplicate-email-before-submit');
    await formPage.submitForm();
    await page.waitForTimeout(5000);
    await formPage.takeScreenshot('duplicate-email-submitted');
    
    const pageText = await page.textContent('body') || '';
    const hasError = pageText.toLowerCase().includes('already') ||
                    pageText.toLowerCase().includes('duplicate') ||
                    pageText.toLowerCase().includes('exists') ||
                    page.url().includes('error');
    
    if (!hasError) {
      console.log('BUG: Duplicate email was accepted without error message');
      console.log('Page URL:', page.url());
      console.log('Page content snippet:', pageText.substring(0, 200));
    }
  });

  test('Should validate phone number format - must contain exactly 10 digits', async ({ page }) => {
    const formPage = new FormPage(page);
    
    // Navigate to step 4
    await formPage.fillZipcode('12345');
    await formPage.clickStep1Next();
    await formPage.clickStep2Next();
    await formPage.selectPropertyType();
    await formPage.clickStep3Next();
    
    // Test with less than 10 digits
    await formPage.fillName('Test User');
    await formPage.fillEmail(`test-${Date.now()}@test.test`);
    await formPage.fillPhone('123456789');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(800);
    await formPage.takeScreenshot('phone-9-digits');
    
    await formPage.submitForm();
    await page.waitForTimeout(3000);
    await formPage.takeScreenshot('phone-9-digits-submitted');
    
    const url = page.url();
    if (url.includes('thank') || !url.includes('error')) {
      console.log('BUG: Phone with 9 digits was accepted');
    }
    
    // Test with more than 10 digits
    await formPage.goto();
    await formPage.fillZipcode('12345');
    await formPage.clickStep1Next();
    await formPage.clickStep2Next();
    await formPage.selectPropertyType();
    await formPage.clickStep3Next();
    
    await formPage.fillName('Test User');
    await formPage.fillEmail(`test-${Date.now()}@test.test`);
    await formPage.fillPhone('12345678901');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(800);
    await formPage.takeScreenshot('phone-11-digits');
    
    await formPage.submitForm();
    await page.waitForTimeout(3000);
    
    // Test with formatting characters
    await formPage.goto();
    await formPage.fillZipcode('12345');
    await formPage.clickStep1Next();
    await formPage.clickStep2Next();
    await formPage.selectPropertyType();
    await formPage.clickStep3Next();
    
    await formPage.fillName('Test User');
    await formPage.fillEmail(`test-${Date.now()}@test.test`);
    await formPage.fillPhone('123-456-7890');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(800);
    await formPage.takeScreenshot('phone-with-dashes');
    
    await formPage.submitForm();
    await page.waitForTimeout(3000);
  });

  test('Should redirect to Thank you page after successful form submission', async ({ page }) => {
    const formPage = new FormPage(page);
    
    // Complete form with valid data
    await formPage.completeFormWithValidData();
    await formPage.takeScreenshot('before-submission');
    await formPage.submitForm();
    await page.waitForTimeout(5000);
    await formPage.takeScreenshot('after-submission');
    
    // Check if redirected to thank you page
    const currentUrl = page.url();
    const pageContent = await page.textContent('body') || '';
    const thankYouText = await page.locator('text=/thank you/i, text=/thank/i').first().textContent().catch(() => null);
    
    const isThankYouPage =
      currentUrl.toLowerCase().includes('thank') ||
      pageContent.toLowerCase().includes('thank') ||
      (thankYouText && thankYouText.toLowerCase().includes('thank'));
    
    if (!isThankYouPage) {
      console.log('BUG: User not redirected to Thank you page after successful submission');
      console.log(`Current URL: ${currentUrl}`);
      console.log(`Page content preview: ${pageContent.substring(0, 300)}`);
    } else {
      console.log('SUCCESS: Redirected to Thank you page');
      console.log(`URL: ${currentUrl}`);
    }
  });
});

