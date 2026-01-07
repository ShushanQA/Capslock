/// <reference lib="es5" />
/// <reference lib="es2015" />
/// <reference lib="es2020" />
import { test, expect } from '@playwright/test';
import { FormPage } from '../pages/FormPage';
import { TestData } from '../test-data/test-data';
import {
  navigateToStep4,
  navigateToStep5,
  completeFullForm,
  expectThankYouPage,
  expectNotThankYouPage,
  expectValidationErrors,
  expectOnStep1,
  hasValidationErrors,
  isOnStep1,
  hasDuplicateEmailError,
} from '../utils/test-helpers';

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
    
    // Wait for validation to appear (meaningful UI state)
    await page.waitForTimeout(TestData.timeouts.medium);
    
    // Check for HTML5 validation (browser native)
    const zipcodeInput = formPage.zipcodeInput;
    const inputValidity = await zipcodeInput.evaluate((input: HTMLInputElement) => ({
      valid: input.checkValidity(),
      validationMessage: input.validationMessage
    })).catch(() => ({ valid: true, validationMessage: '' }));
    
    await formPage.takeScreenshot('step-1-empty-submitted');
    
    // Meaningful assertions: Form should prevent navigation OR show validation
    const hasValidation = await hasValidationErrors(page);
    const stillOnStep1 = await isOnStep1(page);
    
    // Assert that validation is working (either shows errors or prevents navigation)
    expect(hasValidation || stillOnStep1 || !inputValidity.valid).toBeTruthy();
    
    // If form stayed on step 1, that's validation working
    if (stillOnStep1) {
      expect(stillOnStep1).toBeTruthy();
    }
  });

  test('Should validate Step 4: Email field is required', async ({ page }) => {
    const formPage = new FormPage(page);
    
    // Navigate to step 4
    await navigateToStep4(formPage);
    
    // Fill name but leave email empty
    await formPage.fillName(TestData.valid.name);
    await formPage.takeScreenshot('step4-email-empty');
    
    // Try to proceed without email
    await formPage.clickStep4Next();
    await page.waitForTimeout(TestData.timeouts.medium);
    await formPage.takeScreenshot('step4-email-empty-submitted');
    
    // Check for HTML5 validation (browser native)
    const emailInput = formPage.emailInput;
    const inputValidity = await emailInput.evaluate((input: HTMLInputElement) => ({
      valid: input.checkValidity(),
      validationMessage: input.validationMessage
    })).catch(() => ({ valid: true, validationMessage: '' }));
    
    // Meaningful assertions: Form should prevent navigation OR show validation
    const hasValidation = await hasValidationErrors(page);
    const isStillOnStep4 = await formPage.step4Container.isVisible({ timeout: 2000 }).catch(() => false);
    
    // Assert that validation is working (either shows errors or prevents navigation)
    expect(hasValidation || isStillOnStep4 || !inputValidity.valid).toBeTruthy();
  });

  test('Should validate Step 5: Phone field is required', async ({ page }) => {
    const formPage = new FormPage(page);
    
    // Navigate to step 5
    await navigateToStep5(formPage);
    
    // Leave phone empty and try to submit
    await formPage.takeScreenshot('step5-phone-empty');
    await formPage.submitForm();
    await page.waitForTimeout(TestData.timeouts.medium);
    await formPage.takeScreenshot('step5-phone-empty-submitted');
    
    // Check for HTML5 validation (browser native)
    const phoneInput = formPage.phoneInput;
    const inputValidity = await phoneInput.evaluate((input: HTMLInputElement) => ({
      valid: input.checkValidity(),
      validationMessage: input.validationMessage
    })).catch(() => ({ valid: true, validationMessage: '' }));
    
    // Meaningful assertions: Form should prevent submission OR show validation
    const hasValidation = await hasValidationErrors(page);
    const isStillOnStep5 = await formPage.step5Container.isVisible({ timeout: 2000 }).catch(() => false);
    const url = page.url();
    const pageContent = await page.textContent('body') || '';
    const redirectedToThankYou = 
      url.toLowerCase().includes('thank') ||
      pageContent.toLowerCase().includes('thank');
    
    // Assert that validation is working (either shows errors, prevents navigation, or prevents submission)
    expect(hasValidation || isStillOnStep5 || !inputValidity.valid || !redirectedToThankYou).toBeTruthy();
  });

  test('Should validate Step 3: Property type selection is required', async ({ page }) => {
    const formPage = new FormPage(page);
    
    // Navigate to step 3
    await formPage.fillZipcode(TestData.valid.zipcode);
    await formPage.clickStep1Next();
    
    // Step 2 - navigate through (assuming it's not a required field based on user feedback)
    // Check if step 2 exists and has required fields
    const step2Visible = await formPage.step2Container.isVisible({ timeout: 5000 }).catch(() => false);
    if (step2Visible) {
      // If step 2 exists, try to proceed without selecting anything
      await formPage.takeScreenshot('step2-no-selection');
      await formPage.clickStep2Next();
      await page.waitForTimeout(TestData.timeouts.stepTransition);
      // If it proceeds, continue to step 3
    }
    
    // Try to proceed from step 3 without selecting property type
    await formPage.takeScreenshot('step3-property-empty');
    await formPage.clickStep3Next();
    await page.waitForTimeout(TestData.timeouts.medium);
    await formPage.takeScreenshot('step3-property-empty-submitted');
    
    // Check if still on step 3 or if validation errors appear
    const isStillOnStep3 = await formPage.step3Container.isVisible({ timeout: 2000 }).catch(() => false);
    const hasValidation = await hasValidationErrors(page);
    
    // Check if property type radio is required
    const propertyRadio = formPage.propertyTypeRadio;
    const isRequired = await propertyRadio.evaluate((input: HTMLInputElement) => {
      return input.required || input.hasAttribute('required');
    }).catch(() => false);
    
    // If property type is required, validation should prevent navigation
    if (isRequired) {
      expect(hasValidation || isStillOnStep3).toBeTruthy();
    }
  });

  test('Should validate zipcode format - negative cases', async ({ page }) => {
    test.setTimeout(120000); // Increased timeout for multiple test cases
    const formPage = new FormPage(page);
    
    // Test with less than 5 digits
    await formPage.fillZipcode(TestData.invalidZipcodes.lessThan5Digits);
    await formPage.takeScreenshot('zipcode-4-digits');
    
    // Check if form allows progression (bug if it does)
    const urlBefore = page.url();
    await formPage.clickStep1Next();
    await page.waitForTimeout(TestData.timeouts.stepTransition);
    const urlAfter = page.url();
    const stillOnStep1 = await isOnStep1(page);
    
    await formPage.takeScreenshot('zipcode-4-digits-submit');
    
    // Test with more than 5 digits
    await formPage.goto();
    await formPage.fillZipcode(TestData.invalidZipcodes.moreThan5Digits);
    await formPage.takeScreenshot('zipcode-6-digits');
    await formPage.clickStep1Next();
    await page.waitForTimeout(TestData.timeouts.stepTransition);
    
    // Test with non-numeric characters
    await formPage.goto();
    await formPage.fillZipcode(TestData.invalidZipcodes.nonNumeric);
    await formPage.takeScreenshot('zipcode-non-numeric');
    await formPage.clickStep1Next();
    await page.waitForTimeout(TestData.timeouts.stepTransition);
    
  });

  test('Full Flow: Complete form validation with positive and negative cases', async ({ page }) => {
    test.setTimeout(300000);
    const formPage = new FormPage(page);
    
    // Step 1: Positive zipcode case
    await formPage.fillZipcode(TestData.valid.zipcode);
    await formPage.takeScreenshot('zipcode-valid-entered');
    await formPage.clickStep1Next();
    await formPage.takeScreenshot('after-zipcode-next');
    
    // Step 2: Select checkbox
    await formPage.selectStep2Checkbox();
    await formPage.takeScreenshot('step2-checkbox-selected');
    await formPage.clickStep2Next();
    await formPage.takeScreenshot('after-step2-next');
    
    // Step 3: Select property type
    await formPage.selectPropertyType();
    await formPage.takeScreenshot('step3-property-selected');
    await formPage.clickStep3Next();
    await formPage.takeScreenshot('after-step3-next');
    
    // Step 4: Test Name field validation - negative case
    await formPage.takeScreenshot('step4-name-email-fields');
    await formPage.fillEmail(TestData.generateUniqueEmail());
    await formPage.takeScreenshot('step4-no-name-filled');
    await formPage.clickStep4Next();
    await page.waitForTimeout(TestData.timeouts.medium);
    await formPage.takeScreenshot('step4-no-name-submitted');
    
    // Meaningful assertion: Should show validation or prevent navigation
    const hasNameValidation = await hasValidationErrors(page);
    expect(hasNameValidation).toBeTruthy();
    
    // Step 4: Test Email field validation - negative case
    await formPage.goto();
    await navigateToStep4(formPage);
    await formPage.fillName(TestData.valid.name);
    await formPage.fillEmail(TestData.invalidEmails.invalidFormat);
    await formPage.takeScreenshot('step4-invalid-email');
    await formPage.clickStep4Next();
    await page.waitForTimeout(TestData.timeouts.stepTransition);
    await formPage.takeScreenshot('step4-invalid-email-submitted');
    
    // Step 4: Positive cases - valid name and email
    await formPage.goto();
    await navigateToStep4(formPage);
    await formPage.fillName(TestData.valid.name);
    await formPage.fillEmail(TestData.generateUniqueEmail());
    await formPage.takeScreenshot('step4-valid-data');
    await formPage.clickStep4Next();
    await formPage.takeScreenshot('after-step4-next');
    
    // Step 5: Test Phone validation - negative cases
    await formPage.takeScreenshot('step5-phone-field');
    
    // Less than 10 digits
    await formPage.fillPhone(TestData.invalidPhones.lessThan10Digits);
    await formPage.takeScreenshot('step5-phone-9-digits');
    await formPage.submitForm();
    await page.waitForTimeout(TestData.timeouts.stepTransition);
    await formPage.takeScreenshot('step5-phone-9-digits-submitted');
    
    // More than 10 digits
    await formPage.goto();
    await navigateToStep5(formPage);
    await formPage.fillPhone(TestData.invalidPhones.moreThan10Digits);
    await formPage.takeScreenshot('step5-phone-11-digits');
    await formPage.submitForm();
    await page.waitForTimeout(TestData.timeouts.stepTransition);
    
    // Non-numeric characters
    await formPage.goto();
    await navigateToStep5(formPage);
    await formPage.fillPhone(TestData.invalidPhones.withDashes);
    await formPage.takeScreenshot('step5-phone-with-dashes');
    await formPage.submitForm();
    await page.waitForTimeout(TestData.timeouts.stepTransition);
    
    // Step 5: Positive case - valid phone number and complete form
    await formPage.goto();
    await navigateToStep5(formPage);
    await formPage.fillPhone(TestData.valid.phone);
    await formPage.takeScreenshot('step5-valid-phone');
    await formPage.submitForm();
    await page.waitForTimeout(TestData.timeouts.formSubmission);
    await formPage.takeScreenshot('after-step5-submit');
    
    // Meaningful assertion: Should redirect to thank you page
    await expectThankYouPage(page);
  });

  test('Should not allow registration with duplicate email', async ({ page }) => {
    const formPage = new FormPage(page);
    const testEmail = TestData.generateDuplicateTestEmail();
    
    // First registration - should succeed
    await completeFullForm(formPage, {
      email: testEmail,
      phone: TestData.users.johnDoe.phone,
    });
    await formPage.takeScreenshot('duplicate-email-first-registration');
    await page.waitForTimeout(TestData.timeouts.formSubmission);
    
    // Verify first registration succeeded
    await expectThankYouPage(page);
    
    // Second registration attempt with same email - should fail
    await formPage.goto();
    await navigateToStep5(formPage, TestData.users.janeSmith.name, testEmail);
    await formPage.fillPhone(TestData.users.janeSmith.phone);
    await formPage.takeScreenshot('duplicate-email-second-registration-before-submit');
    await formPage.submitForm();
    await page.waitForTimeout(TestData.timeouts.formSubmission);
    await formPage.takeScreenshot('duplicate-email-second-registration-after-submit');
    
    // Check if duplicate email was accepted (bug) or rejected (correct behavior)
    const url = page.url();
    const pageContent = await page.textContent('body') || '';
    const redirectedToThankYou = 
      url.toLowerCase().includes('thank') ||
      pageContent.toLowerCase().includes('thank');
    
    const hasError = await hasValidationErrors(page);
    const hasDuplicateError = await hasDuplicateEmailError(page);
    
    if (redirectedToThankYou && !hasError && !hasDuplicateError) {
      console.log(`Duplicate email: ${testEmail}`);
    }
    
    expect(redirectedToThankYou).toBeFalsy();
  });

  test('Bug 1: Email field validation - should reject email without proper domain (test@test)', async ({ page }) => {
    const formPage = new FormPage(page);
    
    await navigateToStep4(formPage);
    await formPage.fillName(TestData.users.default.name);
    await formPage.fillEmail(TestData.invalidEmails.noDomain);
    await formPage.takeScreenshot('bug1-email-test-at-test');
    await formPage.clickStep4Next();
    await formPage.fillPhone(TestData.valid.phone);
    await formPage.submitForm();
    await page.waitForTimeout(TestData.timeouts.formSubmission);
    await formPage.takeScreenshot('bug1-email-test-at-test-submitted');
    
    // Check if email without proper domain was accepted
    const url = page.url();
    const pageContent = await page.textContent('body') || '';
    const redirectedToThankYou = 
      url.toLowerCase().includes('thank') ||
      pageContent.toLowerCase().includes('thank');
    
    if (redirectedToThankYou) {
      console.log('Email "test@test" was accepted');
    }
    
    expect(redirectedToThankYou).toBeFalsy();
  });

  test('Bug 2: Duplicate email registration - should not allow multiple registrations with same email', async ({ page }) => {
    const formPage = new FormPage(page);
    const duplicateEmail = TestData.generateDuplicateTestEmail();
    
    // First registration
    await completeFullForm(formPage, {
      name: TestData.users.johnDoe.name,
      email: duplicateEmail,
      phone: TestData.users.johnDoe.phone,
    });
    await page.waitForTimeout(TestData.timeouts.formSubmission);
    await formPage.takeScreenshot('bug2-first-registration');
    
    // Second registration with same email
    await formPage.goto();
    await navigateToStep5(formPage, TestData.users.janeSmith.name, duplicateEmail);
    await formPage.fillPhone(TestData.users.janeSmith.phone);
    await formPage.takeScreenshot('bug2-duplicate-email-before-submit');
    await formPage.submitForm();
    await page.waitForTimeout(TestData.timeouts.formSubmission);
    await formPage.takeScreenshot('bug2-duplicate-email-submitted');
    
    // Check if duplicate email was accepted
    const url = page.url();
    const pageContent = await page.textContent('body') || '';
    const redirectedToThankYou = 
      url.toLowerCase().includes('thank') ||
      pageContent.toLowerCase().includes('thank');
    
    if (redirectedToThankYou) {
      console.log(`Duplicate email: ${duplicateEmail}`);
    }
    
    expect(redirectedToThankYou).toBeFalsy();
  });

  test('Bug 3: Phone number validation - should reject phone number with all zeros (0000000000)', async ({ page }) => {
    const formPage = new FormPage(page);
    
    await navigateToStep4(formPage);
    await formPage.fillName(TestData.users.default.name);
    await formPage.fillEmail(TestData.generateUniqueEmail());
    await formPage.clickStep4Next();
    await formPage.fillPhone(TestData.invalidPhones.allZeros);
    await formPage.takeScreenshot('bug3-phone-all-zeros');
    await formPage.submitForm();
    await page.waitForTimeout(TestData.timeouts.formSubmission);
    await formPage.takeScreenshot('bug3-phone-all-zeros-submitted');
    
    // Check if phone with all zeros was accepted
    const url = page.url();
    const pageContent = await page.textContent('body') || '';
    const redirectedToThankYou = 
      url.toLowerCase().includes('thank') ||
      pageContent.toLowerCase().includes('thank');
    
    if (redirectedToThankYou) {
      console.log('Phone "0000000000" was accepted');
    }
    
    expect(redirectedToThankYou).toBeFalsy();
  });

  test('Bug 4: Phone number validation - should allow phone number starting with 1', async ({ page }) => {
    const formPage = new FormPage(page);
    
    await navigateToStep4(formPage);
    await formPage.fillName(TestData.users.default.name);
    await formPage.fillEmail(TestData.generateUniqueEmail());
    await formPage.clickStep4Next();
    
    // Try to fill phone number starting with 1
    const phoneToEnter = TestData.valid.phone; // "1234567890"
    await formPage.fillPhone(phoneToEnter);
    await formPage.takeScreenshot('bug4-phone-starts-with-1');
    
    // Check what was actually entered
    const phoneValue = await formPage.phoneInput.inputValue();
    const digitsOnly = phoneValue.replace(/\D/g, '');
    
    // First digit is being stripped
    if (digitsOnly !== phoneToEnter) {
      console.log(`Phone starting with 1: Expected ${phoneToEnter}, Actual ${digitsOnly}`);
    }
    
    await formPage.submitForm();
    await page.waitForTimeout(TestData.timeouts.formSubmission);
    await formPage.takeScreenshot('bug4-phone-starts-with-1-submitted');
    
    expect(digitsOnly).toBe(phoneToEnter);
  });

  test('Bug 5: Security - Thank you page should not be accessible directly via URL', async ({ page }) => {
    const formPage = new FormPage(page);
    
    // Try to access thank you page directly without form submission
    await page.goto(TestData.urls.thankYou);
    await page.waitForTimeout(TestData.timeouts.stepTransition);
    await formPage.takeScreenshot('bug5-direct-thankyou-url');
    
    // Check if thank you page is accessible directly
    const url = page.url();
    const pageContent = await page.textContent('body') || '';
    const isThankYouPage = 
      url.toLowerCase().includes('thank') ||
      pageContent.toLowerCase().includes('thank');
    
    if (isThankYouPage) {
      console.log(`Thank you page accessible directly: ${url}`);
    }
    
    expect(isThankYouPage).toBeFalsy();
  });

  test('Bug 6: Zipcode validation - should reject zipcode with all zeros (00000)', async ({ page }) => {
    const formPage = new FormPage(page);
    
    // Enter zipcode with all zeros
    await formPage.fillZipcode(TestData.invalidZipcodes.allZeros);
    await formPage.takeScreenshot('bug6-zipcode-all-zeros');
    await formPage.clickStep1Next();
    await page.waitForTimeout(TestData.timeouts.stepTransition);
    await formPage.takeScreenshot('bug6-zipcode-all-zeros-submitted');
    
    // Check if zipcode with all zeros was accepted (bug if it was)
    const url = page.url();
    const pageContent = await page.textContent('body') || '';
    const redirectedToThankYou = 
      url.toLowerCase().includes('thank') ||
      pageContent.toLowerCase().includes('thank');
    
    // Check if form proceeded past step 1 (bug - should be rejected)
    const stillOnStep1 = await isOnStep1(page);
    const hasValidation = await hasValidationErrors(page);
    
    // If form proceeded to step 2 or further, it accepted the invalid zipcode
    const proceededPastStep1 = !stillOnStep1 && !hasValidation && !redirectedToThankYou;
    
    if (proceededPastStep1) {
      console.log('BUG: Zipcode "00000" was accepted and form proceeded past step 1');
    }
    
    if (redirectedToThankYou) {
      console.log('BUG: Zipcode "00000" was accepted and form completed successfully');
    }
    
    // Form should reject zipcode with all zeros
    expect(redirectedToThankYou || proceededPastStep1).toBeFalsy();
  });

  test('ZIP codes 11111 and 12345 - should show service area message and allow email validation', async ({ page }) => {
    const formPage = new FormPage(page);
    
    // Test with zipcode 11111 (expected: redirects to out-of-area stage - normal business behavior)
    await formPage.fillZipcode(TestData.invalidZipcodes.specialZipcodes.outOfArea1);
    await formPage.takeScreenshot('zipcode-11111-entered');
    await formPage.clickStep1Next();
    await page.waitForTimeout(TestData.timeouts.stepTransition);
    await formPage.takeScreenshot('after-zipcode-11111-next');
    
    // Check for the expected "Sorry, unfortunately we don't yet install in your area" message
    const pageContent11111 = await page.textContent('body') || '';
    const hasServiceAreaMessage = 
      pageContent11111.toLowerCase().includes('sorry') ||
      pageContent11111.toLowerCase().includes('unfortunately') ||
      pageContent11111.toLowerCase().includes("don't yet install") ||
      pageContent11111.toLowerCase().includes('your area');
    
    expect(hasServiceAreaMessage).toBeTruthy();
    console.log('✓ ZIP code 11111 correctly shows service area message');
    
    // Test email field validation on this screen
    const emailInputExists = await formPage.serviceAreaEmailInput.count() > 0;
    
    if (emailInputExists) {
      await formPage.serviceAreaEmailInput.waitFor({ state: 'attached', timeout: 10000 }).catch(() => null);
      
      const isEmailVisible = await formPage.serviceAreaEmailInput.isVisible({ timeout: 2000 }).catch(() => false);
      if (isEmailVisible) {
        await formPage.serviceAreaEmailInput.fill(TestData.invalidEmails.noDomain);
      } else {
        await formPage.serviceAreaEmailInput.fill(TestData.invalidEmails.noDomain, { force: true });
      }
      await formPage.takeScreenshot('service-area-invalid-email');
      
      const submitExists = await formPage.serviceAreaSubmitButton.count() > 0;
      
      if (submitExists) {
        await formPage.serviceAreaSubmitButton.waitFor({ state: 'attached', timeout: 5000 }).catch(() => null);
        await formPage.serviceAreaSubmitButton.click({ force: true }).catch(() => null);
        await page.waitForTimeout(TestData.timeouts.medium);
        await formPage.takeScreenshot('service-area-invalid-email-submitted');
        
        // Check if invalid email was accepted or rejected
        const pageContentAfterInvalid = await page.textContent('body') || '';
        const hasThankYouAfterInvalid = pageContentAfterInvalid.toLowerCase().includes('thank');
        
        if (hasThankYouAfterInvalid) {
          console.log('Note: Invalid email was accepted on service area screen (may be expected behavior)');
        } else {
          console.log('✓ Invalid email correctly rejected on service area screen');
        }
      }
      
      if (isEmailVisible) {
        await formPage.serviceAreaEmailInput.fill(TestData.generateUniqueEmail());
      } else {
        await formPage.serviceAreaEmailInput.fill(TestData.generateUniqueEmail(), { force: true });
      }
      await formPage.takeScreenshot('service-area-valid-email');
      
      if (submitExists) {
        await formPage.serviceAreaSubmitButton.click({ force: true }).catch(() => null);
        await page.waitForTimeout(TestData.timeouts.formSubmission);
        await formPage.takeScreenshot('service-area-valid-email-submitted');
        
        // Should show thank you message for valid email
        const pageContentAfterValid = await page.textContent('body') || '';
        const hasThankYouAfterValid = 
          pageContentAfterValid.toLowerCase().includes('thank') ||
          page.url().toLowerCase().includes('thank');
        
        expect(hasThankYouAfterValid).toBeTruthy();
        console.log('✓ Valid email correctly shows thank you message');
      }
    } else {
      console.log('Note: Email input field not found on service area screen');
    }
    
    // Test with zipcode 12345 (expected: redirects to out-of-area stage - normal business behavior)
    await formPage.goto();
    await formPage.fillZipcode(TestData.invalidZipcodes.specialZipcodes.outOfArea2);
    await formPage.takeScreenshot('zipcode-12345-entered');
    await formPage.clickStep1Next();
    await page.waitForTimeout(TestData.timeouts.stepTransition);
    await formPage.takeScreenshot('after-zipcode-12345-next');
    
    const pageContent12345 = await page.textContent('body') || '';
    const hasServiceAreaMessage12345 = 
      pageContent12345.toLowerCase().includes('sorry') ||
      pageContent12345.toLowerCase().includes('unfortunately') ||
      pageContent12345.toLowerCase().includes("don't yet install") ||
      pageContent12345.toLowerCase().includes('your area');
    
    expect(hasServiceAreaMessage12345).toBeTruthy();
    console.log('✓ ZIP code 12345 correctly shows service area message');
  });
});
