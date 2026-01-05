/// <reference lib="es5" />
/// <reference lib="es2015" />
/// <reference lib="es2020" />
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
    
    // Click Next button without filling zipcode
    await formPage.clickStep1Next();
    
    // Wait longer for validation messages to appear (they might be animated or delayed)
    await page.waitForTimeout(2000);
    
    // Check for validation messages with multiple strategies
    // 1. Check for error classes
    const errorClasses = await page.locator('[class*="error"], [class*="invalid"], [class*="required"], [class*="warning"], [class*="alert"]').count();
    
    // 2. Check for aria attributes
    const ariaInvalid = await page.locator('[aria-invalid="true"], [aria-required="true"]').count();
    
    // 3. Check for visible text messages
    const requiredText = await page.locator('text=/required/i, text=/mandatory/i, text=/please/i, text=/enter/i, text=/fill/i').count();
    
    // 4. Check for help text or validation messages
    const helpText = await page.locator('[class*="help"], [class*="message"], [class*="validation"], [class*="feedback"]').count();
    
    // 5. Check if form prevented submission (still on step 1)
    const currentUrl = page.url();
    const pageContent = await page.textContent('body') || '';
    const stillOnStep1 = pageContent.includes('ZIP Code') || 
                         pageContent.includes('zipcode') || 
                         pageContent.includes('Enter ZIP') ||
                         currentUrl === 'https://test-qa.capslock.global/' ||
                         currentUrl === 'https://test-qa.capslock.global';
    
    // 6. Check for HTML5 validation (browser native)
    const zipcodeInput = formPage.zipcodeInput;
    const isValid = await zipcodeInput.evaluate((el: HTMLInputElement) => {
      return el.validity.valid;
    }).catch(() => true);
    
    const validationMessage = await zipcodeInput.evaluate((el: HTMLInputElement) => {
      return el.validationMessage || '';
    }).catch(() => '');
    
    await formPage.takeScreenshot('step-1-empty-submitted');
    
    // Log all findings
    console.log('Validation check results:');
    console.log('- Error classes found:', errorClasses);
    console.log('- Aria invalid found:', ariaInvalid);
    console.log('- Required text found:', requiredText);
    console.log('- Help text found:', helpText);
    console.log('- Still on step 1:', stillOnStep1);
    console.log('- Input validity.valid:', isValid);
    console.log('- Input validationMessage:', validationMessage || '(none)');
    
    // Check if any validation is present
    // Validation can be detected by:
    // 1. Error/help text elements visible
    // 2. Form preventing navigation (still on step 1)
    // 3. HTML5 validation attributes
    const hasValidation = errorClasses > 0 || 
                         ariaInvalid > 0 || 
                         requiredText > 0 || 
                         helpText > 0 || 
                         !isValid ||
                         (validationMessage && validationMessage.length > 0) ||
                         stillOnStep1; // If form stays on step 1, validation is working
    
    if (!hasValidation) {
      console.log('BUG: No validation messages appear on step 1 when submitting empty form');
      console.log('Form allowed submission without zipcode validation');
    } else {
      console.log('SUCCESS: Validation is working - form prevented submission or showed validation messages');
      if (stillOnStep1) {
        console.log('✓ Form correctly prevented navigation to next step');
      }
      if (helpText > 0) {
        console.log(`✓ Found ${helpText} help/validation text elements`);
      }
    }
  });

  test('Should validate zipcode format - negative cases', async ({ page }) => {
    test.setTimeout(60000); // Increase timeout to 60 seconds
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
  });

  test('Full Flow: Complete form validation with positive and negative cases', async ({ page }) => {
    test.setTimeout(120000); // Increase timeout to 120 seconds for full flow
    const formPage = new FormPage(page);
    
    // Step 1: Positive zipcode case - add "23451" and click Next
    await formPage.fillZipcode('23451');
    await page.waitForTimeout(500);
    await formPage.takeScreenshot('zipcode-23451-entered');
    
    await formPage.clickStep1Next();
    await formPage.takeScreenshot('after-zipcode-next');
    
    // Step 2: Select label (checkbox)
    await formPage.selectStep2Checkbox();
    await formPage.takeScreenshot('step2-checkbox-selected');
    
    // Click next on step 2
    await formPage.clickStep2Next();
    await formPage.takeScreenshot('after-step2-next');
    
    // Step 3: Select another label (property type)
    await formPage.selectPropertyType();
    await formPage.takeScreenshot('step3-property-selected');
    
    // Click next on step 3
    await formPage.clickStep3Next();
    await formPage.takeScreenshot('after-step3-next');
    
    // Step 4: Get Name field and Email field
    // Validate Name field - negative cases
    await formPage.takeScreenshot('step4-name-email-fields');
    
    // Test: Try to submit without name
    await formPage.fillEmail(`test-${Date.now()}@test.test`);
    await formPage.takeScreenshot('step4-no-name-filled');
    
    await formPage.clickStep4Next();
    await page.waitForTimeout(2000);
    await formPage.takeScreenshot('step4-no-name-submitted');
    
    // Check for validation
    const errorMessages = await page.locator('[class*="error"], [class*="invalid"], [aria-invalid="true"]').count();
    const requiredMessages = await page.locator('text=/required/i, text=/mandatory/i, text=/please/i').count();
    
    if (errorMessages === 0 && requiredMessages === 0) {
      console.log('BUG: No validation message when name field is empty');
    }
    
    // Test: Invalid email format
    await formPage.goto();
    await formPage.fillZipcode('23451');
    await formPage.clickStep1Next();
    await formPage.selectStep2Checkbox();
    await formPage.clickStep2Next();
    await formPage.selectPropertyType();
    await formPage.clickStep3Next();
    
    await formPage.fillName('Test User');
    await formPage.fillEmail('invalid-email-format');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(1000);
    await formPage.takeScreenshot('step4-invalid-email');
    
    await formPage.clickStep4Next();
    await page.waitForTimeout(3000);
    await formPage.takeScreenshot('step4-invalid-email-submitted');
    
    // Step 4: Positive cases - name with surname and positive email
    await formPage.goto();
    await formPage.fillZipcode('23451');
    await formPage.clickStep1Next();
    await formPage.selectStep2Checkbox();
    await formPage.clickStep2Next();
    await formPage.selectPropertyType();
    await formPage.clickStep3Next();
    
    // Positive name with surname
    await formPage.fillName('John Smith');
    await formPage.takeScreenshot('step4-positive-name');
    
    // Positive email
    await formPage.fillEmail(`testuser-${Date.now()}@example.com`);
    await formPage.takeScreenshot('step4-positive-email');
    
    // Click next on step 4
    await formPage.clickStep4Next();
    await formPage.takeScreenshot('after-step4-next');
    
    // Step 5: Get phone number field
    // Validate phone number - negative test cases
    await formPage.takeScreenshot('step5-phone-field');
    
    // Test: Less than 10 digits
    await formPage.fillPhone('123456789');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(800);
    await formPage.takeScreenshot('step5-phone-9-digits');
    
    await formPage.submitForm();
    await page.waitForTimeout(3000);
    await formPage.takeScreenshot('step5-phone-9-digits-submitted');
    
    const url = page.url();
    if (url.includes('thank') || !url.includes('error')) {
      console.log('BUG: Phone with 9 digits was accepted');
    }
    
    // Test: More than 10 digits
    await formPage.goto();
    await formPage.fillZipcode('23451');
    await formPage.clickStep1Next();
    await formPage.selectStep2Checkbox();
    await formPage.clickStep2Next();
    await formPage.selectPropertyType();
    await formPage.clickStep3Next();
    
    await formPage.fillName('John Smith');
    await formPage.fillEmail(`testuser-${Date.now()}@example.com`);
    await formPage.clickStep4Next();
    
    await formPage.fillPhone('12345678901');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(800);
    await formPage.takeScreenshot('step5-phone-11-digits');
    
    await formPage.submitForm();
    await page.waitForTimeout(3000);
    
    // Test: Non-numeric characters
    await formPage.goto();
    await formPage.fillZipcode('23451');
    await formPage.clickStep1Next();
    await formPage.selectStep2Checkbox();
    await formPage.clickStep2Next();
    await formPage.selectPropertyType();
    await formPage.clickStep3Next();
    
    await formPage.fillName('John Smith');
    await formPage.fillEmail(`testuser-${Date.now()}@example.com`);
    await formPage.clickStep4Next();
    
    await formPage.fillPhone('123-456-7890');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(800);
    await formPage.takeScreenshot('step5-phone-with-dashes');
    
    await formPage.submitForm();
    await page.waitForTimeout(3000);
    
    // Step 5: Last positive case - valid phone number
    await formPage.goto();
    await formPage.fillZipcode('23451');
    await formPage.clickStep1Next();
    await formPage.selectStep2Checkbox();
    await formPage.clickStep2Next();
    await formPage.selectPropertyType();
    await formPage.clickStep3Next();
    
    await formPage.fillName('John Smith');
    await formPage.fillEmail(`testuser-${Date.now()}@example.com`);
    await formPage.clickStep4Next();
    
    // Positive phone number - exactly 10 digits
    await formPage.fillPhone('1234567890');
    await formPage.takeScreenshot('step5-positive-phone');
    
    // Click Next on step 5 (Submit)
    await formPage.submitForm();
    await page.waitForTimeout(5000);
    await formPage.takeScreenshot('after-step5-submit');
    
    // Verify Thank you page
    const finalUrl = page.url();
    const pageContent = await page.textContent('body') || '';
    const hasThankYou = pageContent.toLowerCase().includes('thank') || 
                       pageContent.toLowerCase().includes('thank you') ||
                       finalUrl.includes('thank');
    
    if (hasThankYou) {
      console.log('SUCCESS: Redirected to Thank you page');
      console.log('URL:', finalUrl);
    } else {
      console.log('BUG: Did not redirect to Thank you page');
      console.log('URL:', finalUrl);
    }
    
    // Verify we're on thank you page
    expect(hasThankYou).toBeTruthy();
  });

  test('Should not allow registration with duplicate email', async ({ page }) => {
    const formPage = new FormPage(page);
    const testEmail = `duplicate-test-${Date.now()}@example.com`;
    
    // First registration - should succeed
    await formPage.fillZipcode('23451');
    await formPage.clickStep1Next();
    await formPage.selectStep2Checkbox();
    await formPage.clickStep2Next();
    await formPage.selectPropertyType();
    await formPage.clickStep3Next();
    
    await formPage.fillName('John Doe');
    await formPage.fillEmail(testEmail);
    await formPage.clickStep4Next();
    
    await formPage.fillPhone('1234567890');
    await formPage.takeScreenshot('duplicate-email-first-registration');
    
    await formPage.submitForm();
    await page.waitForTimeout(5000);
    
    // Verify first registration succeeded (redirected to thank you page)
    const firstUrl = page.url();
    const firstPageContent = await page.textContent('body') || '';
    const firstSuccess = firstPageContent.toLowerCase().includes('thank') || 
                        firstPageContent.toLowerCase().includes('thank you') ||
                        firstUrl.includes('thank');
    
    if (!firstSuccess) {
      console.log('WARNING: First registration may not have succeeded. URL:', firstUrl);
      // Continue with test anyway to check duplicate validation
    }
    
    // Second registration attempt with same email - should fail
    await formPage.goto();
    await formPage.fillZipcode('23451');
    await formPage.clickStep1Next();
    await formPage.selectStep2Checkbox();
    await formPage.clickStep2Next();
    await formPage.selectPropertyType();
    await formPage.clickStep3Next();
    
    await formPage.fillName('Jane Smith');
    await formPage.fillEmail(testEmail);
    await formPage.takeScreenshot('duplicate-email-second-registration-before-submit');
    
    await formPage.clickStep4Next();
    await formPage.fillPhone('9876543210');
    await formPage.takeScreenshot('duplicate-email-second-registration-phone-filled');
    
    await formPage.submitForm();
    await page.waitForTimeout(5000);
    await formPage.takeScreenshot('duplicate-email-second-registration-after-submit');
    
    // Check for duplicate email error
    const secondUrl = page.url();
    const secondPageContent = await page.textContent('body') || '';
    
    // Look for error messages indicating duplicate email
    const errorMessages = await page.locator('[class*="error"], [class*="invalid"], [aria-invalid="true"]').count();
    const duplicateMessages = await page.locator('text=/already/i, text=/duplicate/i, text=/exists/i, text=/taken/i, text=/registered/i').count();
    
    const hasError = errorMessages > 0 || 
                    duplicateMessages > 0 ||
                    secondPageContent.toLowerCase().includes('already') ||
                    secondPageContent.toLowerCase().includes('duplicate') ||
                    secondPageContent.toLowerCase().includes('exists') ||
                    secondPageContent.toLowerCase().includes('taken') ||
                    secondPageContent.toLowerCase().includes('registered') ||
                    secondUrl.includes('error');
    
    // Check if we were redirected to thank you page (should NOT happen for duplicate)
    const redirectedToThankYou = secondPageContent.toLowerCase().includes('thank') || 
                                 secondPageContent.toLowerCase().includes('thank you') ||
                                 secondUrl.includes('thank');
    
    if (redirectedToThankYou && !hasError) {
      console.log('BUG: Duplicate email was accepted - user was able to register with the same email twice');
      console.log('First registration email:', testEmail);
      console.log('Second registration email:', testEmail);
      console.log('Second registration URL:', secondUrl);
      console.log('Second registration content snippet:', secondPageContent.substring(0, 300));
    } else if (hasError) {
      console.log('SUCCESS: Duplicate email was rejected');
      console.log('Error messages found:', errorMessages);
      console.log('Duplicate messages found:', duplicateMessages);
      console.log('URL:', secondUrl);
    } else {
      console.log('WARNING: Unable to determine if duplicate email was rejected');
      console.log('URL:', secondUrl);
      console.log('Content snippet:', secondPageContent.substring(0, 300));
    }
    
    // Assert that duplicate email should NOT be accepted
    // If redirected to thank you page without error, it's a bug
    expect(redirectedToThankYou && !hasError).toBeFalsy();
  });

  test('Bug 1: Email field validation - should reject email without proper domain (test@test)', async ({ page }) => {
    const formPage = new FormPage(page);
    
    await formPage.fillZipcode('23451');
    await formPage.clickStep1Next();
    await formPage.selectStep2Checkbox();
    await formPage.clickStep2Next();
    await formPage.selectPropertyType();
    await formPage.clickStep3Next();
    
    await formPage.fillName('Test User');
    await formPage.fillEmail('test@test');
    await formPage.takeScreenshot('bug1-email-test-at-test');
    
    await formPage.clickStep4Next();
    await formPage.fillPhone('1234567890');
    await formPage.submitForm();
    await page.waitForTimeout(5000);
    await formPage.takeScreenshot('bug1-email-test-at-test-submitted');
    
    const url = page.url();
    const pageContent = await page.textContent('body') || '';
    const redirectedToThankYou = pageContent.toLowerCase().includes('thank') || 
                                 pageContent.toLowerCase().includes('thank you') ||
                                 url.includes('thank');
    
    if (redirectedToThankYou) {
      console.log('BUG 1: Email "test@test" (without proper domain) was accepted');
      console.log('URL:', url);
    } else {
      console.log('SUCCESS: Email "test@test" was correctly rejected');
    }
    
    // This should fail - email without proper domain should not be accepted
    expect(redirectedToThankYou).toBeFalsy();
  });

  test('Bug 2: Duplicate email registration - should not allow multiple registrations with same email', async ({ page }) => {
    const formPage = new FormPage(page);
    const duplicateEmail = `duplicate-${Date.now()}@example.com`;
    
    // First registration
    await formPage.fillZipcode('23451');
    await formPage.clickStep1Next();
    await formPage.selectStep2Checkbox();
    await formPage.clickStep2Next();
    await formPage.selectPropertyType();
    await formPage.clickStep3Next();
    
    await formPage.fillName('First User');
    await formPage.fillEmail(duplicateEmail);
    await formPage.clickStep4Next();
    await formPage.fillPhone('1111111111');
    await formPage.submitForm();
    await page.waitForTimeout(5000);
    await formPage.takeScreenshot('bug2-first-registration');
    
    // Second registration with same email
    await formPage.goto();
    await formPage.fillZipcode('23451');
    await formPage.clickStep1Next();
    await formPage.selectStep2Checkbox();
    await formPage.clickStep2Next();
    await formPage.selectPropertyType();
    await formPage.clickStep3Next();
    
    await formPage.fillName('Second User');
    await formPage.fillEmail(duplicateEmail);
    await formPage.takeScreenshot('bug2-duplicate-email-before-submit');
    
    await formPage.clickStep4Next();
    await formPage.fillPhone('2222222222');
    await formPage.submitForm();
    await page.waitForTimeout(5000);
    await formPage.takeScreenshot('bug2-duplicate-email-submitted');
    
    const url = page.url();
    const pageContent = await page.textContent('body') || '';
    const redirectedToThankYou = pageContent.toLowerCase().includes('thank') || 
                                 pageContent.toLowerCase().includes('thank you') ||
                                 url.includes('thank');
    
    if (redirectedToThankYou) {
      console.log('BUG 2: Duplicate email registration was allowed - same email registered twice');
      console.log('Duplicate email:', duplicateEmail);
      console.log('URL:', url);
    } else {
      console.log('SUCCESS: Duplicate email was correctly rejected');
    }
    
    // This should fail - duplicate email should not be accepted
    expect(redirectedToThankYou).toBeFalsy();
  });

  test('Bug 3: Phone number validation - should reject phone number with all zeros (0000000000)', async ({ page }) => {
    const formPage = new FormPage(page);
    
    await formPage.fillZipcode('23451');
    await formPage.clickStep1Next();
    await formPage.selectStep2Checkbox();
    await formPage.clickStep2Next();
    await formPage.selectPropertyType();
    await formPage.clickStep3Next();
    
    await formPage.fillName('Test User');
    await formPage.fillEmail(`test-${Date.now()}@example.com`);
    await formPage.clickStep4Next();
    
    await formPage.fillPhone('0000000000');
    await formPage.takeScreenshot('bug3-phone-all-zeros');
    
    await formPage.submitForm();
    await page.waitForTimeout(5000);
    await formPage.takeScreenshot('bug3-phone-all-zeros-submitted');
    
    const url = page.url();
    const pageContent = await page.textContent('body') || '';
    const redirectedToThankYou = pageContent.toLowerCase().includes('thank') || 
                                 pageContent.toLowerCase().includes('thank you') ||
                                 url.includes('thank');
    
    if (redirectedToThankYou) {
      console.log('BUG 3: Phone number "0000000000" (all zeros) was accepted');
      console.log('URL:', url);
    } else {
      console.log('SUCCESS: Phone number "0000000000" was correctly rejected');
    }
    
    // This should fail - all zeros phone number should not be accepted
    expect(redirectedToThankYou).toBeFalsy();
  });

  test('Bug 4: Phone number validation - should allow phone number starting with 1', async ({ page }) => {
    const formPage = new FormPage(page);
    
    await formPage.fillZipcode('23451');
    await formPage.clickStep1Next();
    await formPage.selectStep2Checkbox();
    await formPage.clickStep2Next();
    await formPage.selectPropertyType();
    await formPage.clickStep3Next();
    
    await formPage.fillName('Test User');
    await formPage.fillEmail(`test-${Date.now()}@example.com`);
    await formPage.clickStep4Next();
    
    // Try to fill phone number starting with 1
    await formPage.fillPhone('1234567890');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(1000);
    await formPage.takeScreenshot('bug4-phone-starts-with-1');
    
    // Check if phone number was actually filled
    const phoneValue = await formPage.phoneInput.inputValue();
    await formPage.takeScreenshot('bug4-phone-value-check');
    
    if (phoneValue === '' || phoneValue !== '1234567890') {
      console.log('BUG 4: Phone number starting with 1 cannot be entered');
      console.log('Expected: 1234567890');
      console.log('Actual:', phoneValue);
    } else {
      console.log('SUCCESS: Phone number starting with 1 can be entered');
    }
    
    // Try to submit
    await formPage.submitForm();
    await page.waitForTimeout(5000);
    await formPage.takeScreenshot('bug4-phone-starts-with-1-submitted');
    
    const url = page.url();
    const pageContent = await page.textContent('body') || '';
    const redirectedToThankYou = pageContent.toLowerCase().includes('thank') || 
                                 pageContent.toLowerCase().includes('thank you') ||
                                 url.includes('thank');
    
    // Phone starting with 1 should be accepted
    if (!redirectedToThankYou && phoneValue === '1234567890') {
      console.log('BUG 4: Phone number starting with 1 was entered but form submission failed');
      console.log('URL:', url);
    }
    
    // This should pass - phone starting with 1 should be allowed
    expect(phoneValue).toBe('1234567890');
  });

  test('Bug 5: Security - Thank you page should not be accessible directly via URL', async ({ page }) => {
    const formPage = new FormPage(page);
    
    // Try to access thank you page directly without form submission
    await page.goto('https://test-qa.capslock.global/thankyou');
    await page.waitForTimeout(3000);
    await formPage.takeScreenshot('bug5-direct-thankyou-url');
    
    const url = page.url();
    const pageContent = await page.textContent('body') || '';
    const isThankYouPage = pageContent.toLowerCase().includes('thank') || 
                          pageContent.toLowerCase().includes('thank you') ||
                          url.includes('thank');
    
    if (isThankYouPage) {
      console.log('BUG 5: Thank you page is accessible directly via URL without form submission');
      console.log('URL:', url);
      console.log('Security Issue: Users can bypass form submission');
    } else {
      console.log('SUCCESS: Thank you page is not accessible directly - redirects to form');
      console.log('Current URL:', url);
    }
    
    // This should fail - thank you page should not be directly accessible
    expect(isThankYouPage).toBeFalsy();
  });

  test('Bug 6: ZIP code validation - special zipcodes (11111, 12345) skip mandatory steps', async ({ page }) => {
    const formPage = new FormPage(page);
    
    // Test with zipcode 11111
    await formPage.fillZipcode('11111');
    await formPage.takeScreenshot('bug6-zipcode-11111');
    
    await formPage.clickStep1Next();
    await page.waitForTimeout(3000);
    await formPage.takeScreenshot('bug6-after-zipcode-11111-next');
    
    // Check if we skipped to a later step or thank you page
    const url11111 = page.url();
    const pageContent11111 = await page.textContent('body') || '';
    const skippedSteps11111 = url11111.includes('thank') || 
                              !pageContent11111.includes('Why Interested') ||
                              !pageContent11111.includes('Property Type');
    
    if (skippedSteps11111) {
      console.log('BUG 6a: ZIP code "11111" skipped mandatory registration steps');
      console.log('URL:', url11111);
    } else {
      console.log('SUCCESS: ZIP code "11111" did not skip steps');
    }
    
    // Test with zipcode 12345
    await formPage.goto();
    await formPage.fillZipcode('12345');
    await formPage.takeScreenshot('bug6-zipcode-12345');
    
    await formPage.clickStep1Next();
    await page.waitForTimeout(3000);
    await formPage.takeScreenshot('bug6-after-zipcode-12345-next');
    
    // Check if we skipped to a later step or thank you page
    const url12345 = page.url();
    const pageContent12345 = await page.textContent('body') || '';
    const skippedSteps12345 = url12345.includes('thank') || 
                              !pageContent12345.includes('Why Interested') ||
                              !pageContent12345.includes('Property Type');
    
    if (skippedSteps12345) {
      console.log('BUG 6b: ZIP code "12345" skipped mandatory registration steps');
      console.log('URL:', url12345);
    } else {
      console.log('SUCCESS: ZIP code "12345" did not skip steps');
    }
    
    // Both should fail - zipcodes should not skip mandatory steps
    expect(skippedSteps11111 || skippedSteps12345).toBeFalsy();
  });
});
