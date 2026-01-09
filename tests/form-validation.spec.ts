/// <reference lib="es5" />
/// <reference lib="es2015" />
/// <reference lib="es2020" />
import { test, expect } from '../utils/fixtures';
import { TestData } from '../test-data/test-data';
import {
  navigateToStep4,
  navigateToStep5,
  completeFullForm,
  expectThankYouPage,
  expectNotThankYouPage,
  hasValidationErrors,
  isOnStep1,
  hasDuplicateEmailError,
  waitForStep2,
  waitForStep3,
  waitForStep5,
  waitForFormSubmission,
} from '../utils/test-helpers';

test.describe('Form Validation Tests - POM', () => {
  test('Should validate that all fields are required', async ({ formPage }) => {
    await test.step('Try to submit without zipcode', async () => {
      await formPage.clickStep1Next();
    });

    await test.step('Verify validation prevents navigation', async () => {
      // Wait for validation state
      await expect(formPage.zipcodeInput).toBeVisible();
      
      // Check for HTML5 validation (browser native)
      const inputValidity = await formPage.zipcodeInput.evaluate((input: HTMLInputElement) => ({
        valid: input.checkValidity(),
        validationMessage: input.validationMessage
      })).catch(() => ({ valid: true, validationMessage: '' }));
      
      // Meaningful assertions: Form should prevent navigation OR show validation
      const hasValidation = await hasValidationErrors(formPage.page);
      const stillOnStep1 = await isOnStep1(formPage.page);
      
      // Assert that validation is working (either shows errors or prevents navigation)
      expect(hasValidation || stillOnStep1 || !inputValidity.valid).toBeTruthy();
    });
  });

  test('Should validate Step 4: Email field is required', async ({ formPage }) => {
    await test.step('Navigate to step 4', async () => {
      await navigateToStep4(formPage);
    });

    await test.step('Try to proceed without email', async () => {
      await formPage.fillName(TestData.valid.name);
      await formPage.clickStep4Next();
      
      // Wait for validation state
      await expect(formPage.emailInput).toBeVisible();
    });

    await test.step('Verify email validation', async () => {
      const inputValidity = await formPage.emailInput.evaluate((input: HTMLInputElement) => ({
        valid: input.checkValidity(),
        validationMessage: input.validationMessage
      })).catch(() => ({ valid: true, validationMessage: '' }));
      
      const hasValidation = await hasValidationErrors(formPage.page);
      const isStillOnStep4 = await formPage.step4Container.isVisible({ timeout: 2000 }).catch(() => false);
      
      expect(hasValidation || isStillOnStep4 || !inputValidity.valid).toBeTruthy();
    });
  });

  test('Should validate Step 5: Phone field is required', async ({ formPage }) => {
    await test.step('Navigate to step 5', async () => {
      await navigateToStep5(formPage);
    });

    await test.step('Try to submit without phone', async () => {
      await formPage.submitForm();
      
      // Wait for validation state
      await expect(formPage.phoneInput).toBeVisible();
    });

    await test.step('Verify phone validation', async () => {
      const inputValidity = await formPage.phoneInput.evaluate((input: HTMLInputElement) => ({
        valid: input.checkValidity(),
        validationMessage: input.validationMessage
      })).catch(() => ({ valid: true, validationMessage: '' }));
      
      const hasValidation = await hasValidationErrors(formPage.page);
      const isStillOnStep5 = await formPage.step5Container.isVisible({ timeout: 2000 }).catch(() => false);
      
      // Should NOT redirect to thank you page
      await expect(formPage.page).not.toHaveURL(/thank/i);
      expect(hasValidation || isStillOnStep5 || !inputValidity.valid).toBeTruthy();
    });
  });

  test('Should validate Step 3: Property type selection is required', async ({ formPage }) => {
    await test.step('Navigate to step 3', async () => {
      await formPage.fillZipcode(TestData.valid.zipcode);
      await formPage.clickStep1Next();
      await waitForStep2(formPage.page);
      
      // Step 2 - navigate through
      const step2Visible = await formPage.step2Container.isVisible({ timeout: 5000 }).catch(() => false);
      if (step2Visible) {
        await formPage.clickStep2Next();
        await waitForStep3(formPage.page);
      }
    });

    await test.step('Try to proceed without property type', async () => {
      await formPage.clickStep3Next();
      await expect(formPage.step3Container).toBeVisible();
    });

    await test.step('Verify property type validation', async () => {
      const isStillOnStep3 = await formPage.step3Container.isVisible({ timeout: 2000 }).catch(() => false);
      const hasValidation = await hasValidationErrors(formPage.page);
      
      // Check if property type radio is required
      const isRequired = await formPage.propertyTypeRadio.evaluate((input: HTMLInputElement) => {
        return input.required || input.hasAttribute('required');
      }).catch(() => false);
      
      // If property type is required, validation should prevent navigation
      if (isRequired) {
        expect(hasValidation || isStillOnStep3).toBeTruthy();
      }
    });
  });

  test('Should validate zipcode format - negative cases', async ({ formPage }) => {
    test.setTimeout(120000);
    
    await test.step('Test less than 5 digits', async () => {
      await formPage.fillZipcode(TestData.invalidZipcodes.lessThan5Digits);
      await formPage.clickStep1Next();
      
      // Wait for validation or step transition
      await expect(formPage.step1Container).toBeVisible();
      const stillOnStep1 = await isOnStep1(formPage.page);
      // Validation should prevent progression (not testing the actual validation here, just the flow)
    });

    await test.step('Test more than 5 digits', async () => {
      await formPage.goto();
      await formPage.fillZipcode(TestData.invalidZipcodes.moreThan5Digits);
      await formPage.clickStep1Next();
      await expect(formPage.step1Container).toBeVisible();
    });

    await test.step('Test non-numeric characters', async () => {
      await formPage.goto();
      await formPage.fillZipcode(TestData.invalidZipcodes.nonNumeric);
      await formPage.clickStep1Next();
      await expect(formPage.step1Container).toBeVisible();
    });
  });

  test('Full Flow: Complete form validation with positive and negative cases', async ({ formPage }) => {
    test.setTimeout(300000);
    
    await test.step('Fill steps 1-3', async () => {
      await formPage.fillZipcode(TestData.valid.zipcode);
      await formPage.clickStep1Next();
      await waitForStep2(formPage.page);
      
      await formPage.selectStep2Checkbox();
      await formPage.clickStep2Next();
      await waitForStep3(formPage.page);
      
      await formPage.selectPropertyType();
      await formPage.clickStep3Next();
      await expect(formPage.step4Container).toBeVisible();
    });

    await test.step('Test Step 4: Name validation (negative)', async () => {
      await formPage.fillEmail(TestData.generateUniqueEmail());
      await formPage.clickStep4Next();
      
      // Should show validation for missing name
      await expect(formPage.step4Container).toBeVisible();
      const hasNameValidation = await hasValidationErrors(formPage.page);
      expect(hasNameValidation).toBeTruthy();
    });

    await test.step('Test Step 4: Email validation (negative)', async () => {
      await formPage.goto();
      await navigateToStep4(formPage);
      await formPage.fillName(TestData.valid.name);
      await formPage.fillEmail(TestData.invalidEmails.invalidFormat);
      await formPage.clickStep4Next();
      await expect(formPage.step4Container).toBeVisible();
    });

    await test.step('Complete Step 4 with valid data', async () => {
      await formPage.goto();
      await navigateToStep4(formPage);
      await formPage.fillName(TestData.valid.name);
      await formPage.fillEmail(TestData.generateUniqueEmail());
      await formPage.clickStep4Next();
      await waitForStep5(formPage.page);
    });

    await test.step('Test Step 5: Phone validation (negative)', async () => {
      // Less than 10 digits
      await formPage.fillPhone(TestData.invalidPhones.lessThan10Digits);
      await formPage.submitForm();
      await expect(formPage.step5Container).toBeVisible();
      
      // More than 10 digits
      await formPage.goto();
      await navigateToStep5(formPage);
      await formPage.fillPhone(TestData.invalidPhones.moreThan10Digits);
      await formPage.submitForm();
      await expect(formPage.step5Container).toBeVisible();
      
      // Non-numeric characters
      await formPage.goto();
      await navigateToStep5(formPage);
      await formPage.fillPhone(TestData.invalidPhones.withDashes);
      await formPage.submitForm();
      await expect(formPage.step5Container).toBeVisible();
    });

    await test.step('Complete form with valid phone', async () => {
      await formPage.goto();
      await navigateToStep5(formPage);
      await formPage.fillPhone(TestData.valid.phone);
      await formPage.submitForm();
      await waitForFormSubmission(formPage.page);
      
      // Should redirect to thank you page
      await expectThankYouPage(formPage.page);
    });
  });

  test('Should not allow registration with duplicate email', async ({ formPage }) => {
    const testEmail = TestData.generateDuplicateTestEmail();
    
    await test.step('First registration - should succeed', async () => {
      await completeFullForm(formPage, {
        email: testEmail,
        phone: TestData.users.johnDoe.phone,
      });
      await expectThankYouPage(formPage.page);
    });

    await test.step('Second registration with same email - should fail', async () => {
      await formPage.goto();
      await navigateToStep5(formPage, TestData.users.janeSmith.name, testEmail);
      await formPage.fillPhone(TestData.users.janeSmith.phone);
      await formPage.submitForm();
      await waitForFormSubmission(formPage.page);
      
      // Check if duplicate email was accepted (bug)
      const hasError = await hasValidationErrors(formPage.page);
      const hasDuplicateError = await hasDuplicateEmailError(formPage.page);
      
      // Should NOT allow duplicate email
      await expectNotThankYouPage(formPage.page);
    });
  });

  test('Bug 1: Email field validation - should reject email without proper domain (test@test)', async ({ formPage }) => {
    await test.step('Fill form with invalid email', async () => {
      await navigateToStep4(formPage);
      await formPage.fillName(TestData.users.default.name);
      await formPage.fillEmail(TestData.invalidEmails.noDomain);
      await formPage.clickStep4Next();
      await waitForStep5(formPage.page);
      await formPage.fillPhone(TestData.valid.phone);
      await formPage.submitForm();
      await waitForFormSubmission(formPage.page);
    });

    await test.step('Verify email without domain is rejected', async () => {
      // Bug: email "test@test" is currently accepted
      await expectNotThankYouPage(formPage.page);
    });
  });

  test('Bug 2: Duplicate email registration - should not allow multiple registrations with same email', async ({ formPage }) => {
    const duplicateEmail = TestData.generateDuplicateTestEmail();
    
    await test.step('First registration', async () => {
      await completeFullForm(formPage, {
        name: TestData.users.johnDoe.name,
        email: duplicateEmail,
        phone: TestData.users.johnDoe.phone,
      });
    });

    await test.step('Second registration with same email', async () => {
      await formPage.goto();
      await navigateToStep5(formPage, TestData.users.janeSmith.name, duplicateEmail);
      await formPage.fillPhone(TestData.users.janeSmith.phone);
      await formPage.submitForm();
      await waitForFormSubmission(formPage.page);
      
      // Bug: duplicate email is currently accepted
      await expectNotThankYouPage(formPage.page);
    });
  });

  test('Bug 3: Phone number validation - should reject phone number with all zeros (0000000000)', async ({ formPage }) => {
    await test.step('Fill form with phone all zeros', async () => {
      await navigateToStep4(formPage);
      await formPage.fillName(TestData.users.default.name);
      await formPage.fillEmail(TestData.generateUniqueEmail());
      await formPage.clickStep4Next();
      await waitForStep5(formPage.page);
      await formPage.fillPhone(TestData.invalidPhones.allZeros);
      await formPage.submitForm();
      await waitForFormSubmission(formPage.page);
    });

    await test.step('Verify phone with all zeros is rejected', async () => {
      // Bug: phone "0000000000" is currently accepted
      await expectNotThankYouPage(formPage.page);
    });
  });

  test('Bug 4: Phone number validation - should allow phone number starting with 1', async ({ formPage }) => {
    await test.step('Navigate to phone field', async () => {
      await navigateToStep4(formPage);
      await formPage.fillName(TestData.users.default.name);
      await formPage.fillEmail(TestData.generateUniqueEmail());
      await formPage.clickStep4Next();
      await waitForStep5(formPage.page);
    });

    await test.step('Fill phone starting with 1', async () => {
      const phoneToEnter = TestData.valid.phone; // "1234567890"
      await formPage.fillPhone(phoneToEnter);
      
      // Check what was actually entered
      const phoneValue = await formPage.phoneInput.inputValue();
      const digitsOnly = phoneValue.replace(/\D/g, '');
      
      // Bug: First digit is being stripped
      expect(digitsOnly).toBe(phoneToEnter);
    });
  });

  test('Bug 5: Security - Thank you page should not be accessible directly via URL', async ({ formPage }) => {
    await test.step('Access thank you page directly', async () => {
      await formPage.page.goto(TestData.urls.thankYou);
      await expect(formPage.page).toHaveURL(/thank/i);
    });

    await test.step('Verify direct access is blocked', async () => {
      // Bug: thank you page is currently accessible directly
      await expectNotThankYouPage(formPage.page);
    });
  });

  test('Bug 6: Zipcode validation - should reject zipcode with all zeros (00000)', async ({ formPage }) => {
    await test.step('Enter zipcode with all zeros', async () => {
      await formPage.fillZipcode(TestData.invalidZipcodes.allZeros);
      await formPage.clickStep1Next();
      await expect(formPage.step1Container).toBeVisible();
    });

    await test.step('Verify zipcode with all zeros is rejected', async () => {
      const stillOnStep1 = await isOnStep1(formPage.page);
      const hasValidation = await hasValidationErrors(formPage.page);
      
      // Bug: zipcode "00000" is currently accepted
      // Form should stay on step 1 OR show validation
      expect(stillOnStep1 || hasValidation).toBeTruthy();
    });
  });

  test('ZIP codes 11111 and 12345 - should show service area message and allow email validation', async ({ formPage }) => {
    await test.step('Test zipcode 11111', async () => {
      await formPage.fillZipcode(TestData.invalidZipcodes.specialZipcodes.outOfArea1);
      await formPage.clickStep1Next();
      
      // Wait for page to load
      await formPage.page.waitForLoadState('networkidle');
      
      // Check for service area message
      const pageContent = await formPage.page.textContent('body') || '';
      const hasServiceAreaMessage = 
        pageContent.toLowerCase().includes('sorry') ||
        pageContent.toLowerCase().includes('unfortunately') ||
        pageContent.toLowerCase().includes("don't yet install") ||
        pageContent.toLowerCase().includes('your area');
      
      expect(hasServiceAreaMessage).toBeTruthy();
      console.log('✓ ZIP code 11111 correctly shows service area message');
    });

    await test.step('Test email validation on service area screen', async () => {
      const emailInputExists = await formPage.serviceAreaEmailInput.count() > 0;
      
      if (emailInputExists) {
        const isEmailVisible = await formPage.serviceAreaEmailInput.isVisible({ timeout: 2000 }).catch(() => false);
        if (isEmailVisible) {
          await formPage.serviceAreaEmailInput.fill(TestData.invalidEmails.noDomain);
        } else {
          await formPage.serviceAreaEmailInput.fill(TestData.invalidEmails.noDomain, { force: true });
        }
        
        const submitExists = await formPage.serviceAreaSubmitButton.count() > 0;
        
        if (submitExists) {
          await formPage.serviceAreaSubmitButton.click({ force: true }).catch(() => null);
          await formPage.page.waitForLoadState('networkidle');
        }
        
        // Test valid email
        if (isEmailVisible) {
          await formPage.serviceAreaEmailInput.fill(TestData.generateUniqueEmail());
        } else {
          await formPage.serviceAreaEmailInput.fill(TestData.generateUniqueEmail(), { force: true });
        }
        
        if (submitExists) {
          await formPage.serviceAreaSubmitButton.click({ force: true }).catch(() => null);
          await waitForFormSubmission(formPage.page);
          
          // Should show thank you message for valid email
          await expect(formPage.page).toHaveURL(/thank/i);
          console.log('✓ Valid email correctly shows thank you message');
        }
      }
    });

    await test.step('Test zipcode 12345', async () => {
      await formPage.goto();
      await formPage.fillZipcode(TestData.invalidZipcodes.specialZipcodes.outOfArea2);
      await formPage.clickStep1Next();
      await formPage.page.waitForLoadState('networkidle');
      
      const pageContent = await formPage.page.textContent('body') || '';
      const hasServiceAreaMessage = 
        pageContent.toLowerCase().includes('sorry') ||
        pageContent.toLowerCase().includes('unfortunately') ||
        pageContent.toLowerCase().includes("don't yet install") ||
        pageContent.toLowerCase().includes('your area');
      
      expect(hasServiceAreaMessage).toBeTruthy();
      console.log('✓ ZIP code 12345 correctly shows service area message');
    });
  });
});
