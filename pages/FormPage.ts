import { Page, Locator } from '@playwright/test';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

export class FormPage {
  readonly page: Page;

  // Step 1 - Zipcode
  readonly zipcodeInput: Locator;
  readonly step1NextButton: Locator;
  readonly step1Container: Locator;

  // Step 2 - Why Interested (Checkboxes)
  readonly step2CheckboxLabel: Locator;
  readonly step2NextButton: Locator;
  readonly step2Container: Locator;

  // Step 3 - Property Type (Radio buttons)
  readonly propertyTypeLabel: Locator;
  readonly propertyTypeRadio: Locator;
  readonly step3NextButton: Locator;
  readonly step3Container: Locator;

  // Step 4 - Personal Information (Name and Email)
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly step4NextButton: Locator;
  readonly step4Container: Locator;

  // Step 5 - Phone Number
  readonly phoneInput: Locator;
  readonly step5SubmitButton: Locator;
  readonly step5Container: Locator;

  // Form containers
  readonly formContainer1: Locator;

  constructor(page: Page) {
    this.page = page;

    // Form containers
    this.formContainer1 = page.locator('#form-container-1');

    // Step containers - use for waiting for step visibility
    this.step1Container = page.locator('#form-container-1 > div.steps.step-1');
    this.step2Container = page.locator('#form-container-1 > div.steps.step-2');
    this.step3Container = page.locator('#form-container-1 > div.steps.step-3');
    this.step4Container = page.locator('#form-container-1 > div.steps.step-4');
    this.step5Container = page.locator('#form-container-1 > div.steps.step-5');

    // Step 1 - Zipcode - Use data attributes as primary, fallback to name
    this.zipcodeInput = page.locator('input[data-zip-code-input]').or(page.locator('input[name="zipCode"]')).first();
    this.step1NextButton = page.locator('button[data-tracking="btn-step-1"]').first();

    // Step 2 - Why Interested - Use data attributes and for attribute
    this.step2CheckboxLabel = page.locator('label[for="why-interested-independence-1"]').first();
    this.step2NextButton = page.locator('button[data-tracking="btn-step-2"]').first();

    // Step 3 - Property Type - Use data attributes and for attribute
    this.propertyTypeLabel = page.locator('label[for="homeowner-owned-1"]').first();
    this.propertyTypeRadio = page.locator('input[type="radio"][name="typeOfProperty"][id="homeowner-owned-1"]').first();
    this.step3NextButton = page.locator('button[data-tracking="btn-step-3"]').first();

    // Step 4 - Personal Information - Use data attributes as primary
    this.nameInput = page.locator('input[data-name-input]').or(page.locator('input[name="name"]')).first();
    this.emailInput = page.locator('input[type="email"][name="email"][required]').first();
    this.step4NextButton = page.locator('button[data-tracking="btn-step-4"]').first();

    // Step 5 - Phone Number - Use data attributes as primary
    this.phoneInput = page.locator('input[data-phone-input]').or(page.locator('input[name="phone"]')).first();
    this.step5SubmitButton = page.locator('button[data-tracking="btn-step-5"]').first();
  }

  async goto() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    // Wait for form container to be visible (meaningful UI state)
    await this.formContainer1.waitFor({ state: 'visible', timeout: 15000 });
  }

  async fillZipcode(zipcode: string) {
    // Wait for input to be ready (visible and enabled)
    await this.zipcodeInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.zipcodeInput.fill(zipcode);
    // Wait for input value to be set (meaningful state)
    await this.page.waitForFunction(
      (selector: string) => {
        const input = document.querySelector(selector) as HTMLInputElement;
        return input && input.value.length > 0;
      },
      `input[data-zip-code-input], input[name="zipCode"]`,
      { timeout: 5000 }
    ).catch(() => null); // Don't fail if already filled
  }

  async clickStep1Next() {
    // Wait for button to be visible and enabled
    await this.step1NextButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.step1NextButton.waitFor({ state: 'attached', timeout: 10000 });
    
    const currentUrl = this.page.url();
    
    // Start waiting for meaningful UI states before clicking
    const urlChangePromise = this.page.waitForURL((url) => url.toString() !== currentUrl, { 
      waitUntil: 'domcontentloaded', 
      timeout: 20000 
    }).catch(() => null);
    
    // Wait for step 2 container to appear (meaningful UI state)
    const step2AppearPromise = this.step2Container.waitFor({ 
      state: 'visible', 
      timeout: 20000 
    }).catch(() => null);
    
    await this.step1NextButton.click();
    
    // Wait for either navigation or step 2 to appear (meaningful states)
    await Promise.race([
      urlChangePromise.then(async () => {
        // Navigation occurred - wait for page to be ready
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
        // Wait for form container to be visible after navigation
        await this.formContainer1.waitFor({ state: 'visible', timeout: 10000 });
      }),
      step2AppearPromise.then(async () => {
        // Step 2 appeared - wait for it to be fully visible and interactive
        await this.step2Container.waitFor({ state: 'visible', timeout: 5000 });
        await this.step2CheckboxLabel.waitFor({ state: 'visible', timeout: 5000 });
      })
    ]);
  }

  async selectStep2Checkbox() {
    // Wait for step 2 container to be visible (meaningful UI state)
    await this.step2Container.waitFor({ state: 'visible', timeout: 15000 });
    
    // Wait for checkbox label to be visible and enabled
    await this.step2CheckboxLabel.waitFor({ state: 'visible', timeout: 10000 });
    
    // Check if already selected before clicking
    const isSelected = await this.step2CheckboxLabel.evaluate((el: HTMLLabelElement) => {
      const input = document.querySelector(`input[id="${el.getAttribute('for')}"]`) as HTMLInputElement;
      return input?.checked || false;
    }).catch(() => false);
    
    if (!isSelected) {
      await this.step2CheckboxLabel.click();
      // Wait for selection to be registered (meaningful state)
      await this.page.waitForFunction(
        (forAttr: string) => {
          const input = document.querySelector(`input[id="${forAttr}"]`) as HTMLInputElement;
          return input?.checked === true;
        },
        await this.step2CheckboxLabel.getAttribute('for') || 'why-interested-independence-1',
        { timeout: 5000 }
      ).catch(() => null);
    }
  }

  async clickStep2Next() {
    // Wait for button to be visible and enabled
    await this.step2NextButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.step2NextButton.waitFor({ state: 'attached', timeout: 10000 });
    
    // Wait for step 3 container to appear (meaningful UI state)
    const step3AppearPromise = this.step3Container.waitFor({ 
      state: 'visible', 
      timeout: 20000 
    }).catch(() => null);
    
    await this.step2NextButton.click();
    
    // Wait for step 3 to appear
    await step3AppearPromise;
    await this.step3Container.waitFor({ state: 'visible', timeout: 10000 });
  }

  async selectPropertyType() {
    // Wait for step 3 container to be visible
    await this.step3Container.waitFor({ state: 'visible', timeout: 15000 });
    
    // Wait for radio button to be attached
    await this.propertyTypeRadio.waitFor({ state: 'attached', timeout: 10000 });
    
    // Check if already selected
    const isSelected = await this.propertyTypeRadio.isChecked().catch(() => false);
    
    if (!isSelected) {
      // Use JavaScript click for reliability
      await this.propertyTypeRadio.evaluate((el: HTMLInputElement) => {
        el.click();
      });
      
      // Wait for selection to be registered (meaningful state)
      await this.page.waitForFunction(
        (radioId: string) => {
          const input = document.querySelector(`input[id="${radioId}"]`) as HTMLInputElement;
          return input?.checked === true;
        },
        await this.propertyTypeRadio.getAttribute('id') || 'homeowner-owned-1',
        { timeout: 5000 }
      ).catch(() => null);
    }
  }

  async clickStep3Next() {
    // Wait for button to be visible and enabled
    await this.step3NextButton.waitFor({ state: 'visible', timeout: 10000 });
    
    // Wait for step 4 container to appear (meaningful UI state)
    const step4AppearPromise = this.step4Container.waitFor({ 
      state: 'visible', 
      timeout: 20000 
    }).catch(() => null);
    
    await this.step3NextButton.click();
    
    // Wait for step 4 to appear
    await step4AppearPromise;
    await this.step4Container.waitFor({ state: 'visible', timeout: 10000 });
  }

  async clickStep4Next() {
    // Wait for step 4 container to be visible
    await this.step4Container.waitFor({ state: 'visible', timeout: 15000 });
    
    // Wait for inputs to be ready
    await this.nameInput.waitFor({ state: 'attached', timeout: 15000 });
    await this.emailInput.waitFor({ state: 'attached', timeout: 15000 });
    
    // Wait for button to be visible and enabled
    await this.step4NextButton.waitFor({ state: 'visible', timeout: 15000 });
    
    // Wait for step 5 container to appear (meaningful UI state)
    // Step 5 might be attached but not visible initially, so check for attached first
    const step5AppearPromise = this.step5Container.waitFor({ 
      state: 'attached', 
      timeout: 20000 
    }).catch(() => null);
    
    await this.step4NextButton.click();
    
    // Wait for step 5 to appear (attached is sufficient, then wait for phone input)
    await step5AppearPromise;
    await this.step5Container.waitFor({ state: 'attached', timeout: 10000 });
    // Wait for phone input to be ready instead of container visibility
    await this.phoneInput.waitFor({ state: 'attached', timeout: 10000 });
  }

  async fillName(name: string) {
    // Wait for step 4 container and input to be visible
    await this.step4Container.waitFor({ state: 'visible', timeout: 15000 });
    await this.nameInput.waitFor({ state: 'visible', timeout: 10000 });
    
    await this.nameInput.fill(name);
    
    // Wait for value to be set (meaningful state)
    await this.page.waitForFunction(
      (expectedName: string) => {
        const input = document.querySelector('input[data-name-input], input[name="name"]') as HTMLInputElement;
        return input?.value === expectedName;
      },
      name,
      { timeout: 5000 }
    ).catch(() => null);
  }

  async fillEmail(email: string) {
    // Wait for step 4 container and input to be visible
    await this.step4Container.waitFor({ state: 'visible', timeout: 15000 });
    await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
    
    await this.emailInput.fill(email);
    
    // Wait for value to be set (meaningful state)
    await this.page.waitForFunction(
      (expectedEmail: string) => {
        const input = document.querySelector('input[type="email"][name="email"]') as HTMLInputElement;
        return input?.value === expectedEmail;
      },
      email,
      { timeout: 5000 }
    ).catch(() => null);
  }

  async fillPhone(phone: string) {
    // Wait for step 5 container and input to be visible
    await this.step5Container.waitFor({ state: 'visible', timeout: 15000 });
    await this.phoneInput.waitFor({ state: 'visible', timeout: 10000 });
    
    await this.phoneInput.fill(phone);
    
    // Wait for value to be set (meaningful state)
    // Note: Phone input may format the value, so check if it contains the digits
    await this.page.waitForFunction(
      (expectedDigits: string) => {
        const input = document.querySelector('input[data-phone-input], input[name="phone"]') as HTMLInputElement;
        const value = input?.value || '';
        // Check if all digits are present (ignoring formatting)
        const digitsOnly = value.replace(/\D/g, '');
        return digitsOnly.length >= expectedDigits.replace(/\D/g, '').length;
      },
      phone,
      { timeout: 5000 }
    ).catch(() => null);
  }

  async submitForm() {
    // Wait for step 5 container and button to be visible
    await this.step5Container.waitFor({ state: 'visible', timeout: 15000 });
    await this.step5SubmitButton.waitFor({ state: 'visible', timeout: 10000 });
    
    // Wait for thank you page or error (meaningful UI state)
    const thankYouPromise = this.page.waitForURL((url) => 
      url.toString().toLowerCase().includes('thank') || 
      url.toString().toLowerCase().includes('thankyou'),
      { timeout: 30000 }
    ).catch(() => null);
    
    const thankYouContentPromise = this.page.waitForSelector('h1:has-text("Thank"), h1:has-text("thank")', { 
      timeout: 30000 
    }).catch(() => null);
    
    await this.step5SubmitButton.click();
    
    // Wait for either URL change or thank you content
    await Promise.race([
      thankYouPromise,
      thankYouContentPromise,
      this.page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => null)
    ]);
  }

  async completeFormWithValidData(email?: string) {
    const uniqueEmail = email || `test-${Date.now()}@test.test`;
    
    // Step 1: Zipcode
    await this.fillZipcode('23451');
    await this.clickStep1Next();

    // Step 2: Why Interested - select checkbox
    await this.selectStep2Checkbox();
    await this.clickStep2Next();

    // Step 3: Property Type
    await this.selectPropertyType();
    await this.clickStep3Next();

    // Step 4: Personal Information (Name and Email)
    await this.fillName('Test User');
    await this.fillEmail(uniqueEmail);
    await this.clickStep4Next();

    // Step 5: Phone Number
    await this.fillPhone('1234567890');
  }

  async takeScreenshot(name: string) {
    const screenshotsDir = 'screenshots';
    
    // Ensure screenshots directory exists
    if (!existsSync(screenshotsDir)) {
      await mkdir(screenshotsDir, { recursive: true });
    }
    
    const screenshotPath = join(screenshotsDir, `${name}-${Date.now()}.png`);
    await this.page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
  }
}
