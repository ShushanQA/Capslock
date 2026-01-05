import { Page, Locator } from '@playwright/test';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

export class FormPage {
  readonly page: Page;

  readonly zipcodeInput: Locator;
  readonly step1NextButton: Locator;
  readonly step1Container: Locator;

  readonly step2CheckboxLabel: Locator;
  readonly step2NextButton: Locator;
  readonly step2Container: Locator;

  readonly propertyTypeRadio: Locator;
  readonly step3NextButton: Locator;
  readonly step3Container: Locator;

  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly step4NextButton: Locator;
  readonly step4Container: Locator;

  readonly phoneInput: Locator;
  readonly step5SubmitButton: Locator;
  readonly step5Container: Locator;

  readonly formContainer1: Locator;
  readonly serviceAreaEmailInput: Locator;
  readonly serviceAreaSubmitButton: Locator;
  readonly serviceAreaMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.formContainer1 = page.locator('#form-container-1');

    this.step1Container = page.locator('#form-container-1 > div.steps.step-1');
    this.step2Container = page.locator('#form-container-1 > div.steps.step-2');
    this.step3Container = page.locator('#form-container-1 > div.steps.step-3');
    this.step4Container = page.locator('#form-container-1 > div.steps.step-4');
    this.step5Container = page.locator('#form-container-1 > div.steps.step-5');

    this.zipcodeInput = this.step1Container.locator('input[data-zip-code-input], input[name="zipCode"]');
    this.step1NextButton = this.step1Container.locator('button[data-tracking="btn-step-1"]');

    this.step2CheckboxLabel = this.step2Container.locator('label[for="why-interested-independence-1"]');
    this.step2NextButton = this.step2Container.locator('button[data-tracking="btn-step-2"]');

    this.propertyTypeRadio = this.step3Container.locator('input[type="radio"][name="typeOfProperty"][id="homeowner-owned-1"]');
    this.step3NextButton = this.step3Container.locator('button[data-tracking="btn-step-3"]');

    this.nameInput = this.step4Container.locator('input[data-name-input], input[name="name"]');
    this.emailInput = this.step4Container.locator('input[type="email"][name="email"][required]');
    this.step4NextButton = this.step4Container.locator('button[data-tracking="btn-step-4"]');

    this.phoneInput = this.step5Container.locator('input[data-phone-input], input[name="phone"]');
    this.step5SubmitButton = this.step5Container.locator('button[data-tracking="btn-step-5"]');

    this.serviceAreaEmailInput = page.locator('input[type="email"], input[name="email"]').first();
    this.serviceAreaSubmitButton = page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Continue"), button:has-text("Notify")').first();
    this.serviceAreaMessage = page.locator('text=/Sorry, unfortunately we don\'t yet install in your area/i');
  }

  async goto() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await this.formContainer1.waitFor({ state: 'visible', timeout: 15000 });
  }

  async fillZipcode(zipcode: string) {
    await this.zipcodeInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.zipcodeInput.fill(zipcode);
    await this.page.waitForFunction(
      (selector: string) => {
        const input = document.querySelector(selector) as HTMLInputElement;
        return input && input.value.length > 0;
      },
      `input[data-zip-code-input], input[name="zipCode"]`,
      { timeout: 5000 }
    ).catch(() => null);
  }

  async clickStep1Next() {
    await this.step1NextButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.step1NextButton.waitFor({ state: 'attached', timeout: 10000 });
    
    const currentUrl = this.page.url();
    
    const urlChangePromise = this.page.waitForURL((url) => url.toString() !== currentUrl, { 
      waitUntil: 'domcontentloaded', 
      timeout: 20000 
    }).catch(() => null);
    
    const step2AppearPromise = this.step2Container.waitFor({ 
      state: 'visible', 
      timeout: 20000 
    }).catch(() => null);
    
    await this.step1NextButton.click();
    
    await Promise.race([
      urlChangePromise.then(async () => {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
        await this.formContainer1.waitFor({ state: 'visible', timeout: 10000 });
      }),
      step2AppearPromise.then(async () => {
        await this.step2Container.waitFor({ state: 'visible', timeout: 5000 });
        await this.step2CheckboxLabel.waitFor({ state: 'visible', timeout: 5000 });
      })
    ]);
  }

  async selectStep2Checkbox() {
    await this.step2Container.waitFor({ state: 'visible', timeout: 15000 });
    await this.step2CheckboxLabel.waitFor({ state: 'visible', timeout: 10000 });
    
    const isSelected = await this.step2CheckboxLabel.evaluate((el: HTMLLabelElement) => {
      const input = document.querySelector(`input[id="${el.getAttribute('for')}"]`) as HTMLInputElement;
      return input?.checked || false;
    }).catch(() => false);
    
    if (!isSelected) {
      await this.step2CheckboxLabel.click();
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
    await this.step2NextButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.step2NextButton.waitFor({ state: 'attached', timeout: 10000 });
    
    const step3AppearPromise = this.step3Container.waitFor({ 
      state: 'visible', 
      timeout: 20000 
    }).catch(() => null);
    
    await this.step2NextButton.click();
    
    await step3AppearPromise;
    await this.step3Container.waitFor({ state: 'visible', timeout: 10000 });
  }

  async selectPropertyType() {
    await this.step3Container.waitFor({ state: 'visible', timeout: 15000 });
    await this.propertyTypeRadio.waitFor({ state: 'attached', timeout: 10000 });
    
    const isSelected = await this.propertyTypeRadio.isChecked().catch(() => false);
    
    if (!isSelected) {
      await this.propertyTypeRadio.evaluate((el: HTMLInputElement) => {
        el.click();
      });
      
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
    await this.step3NextButton.waitFor({ state: 'visible', timeout: 10000 });
    
    const step4AppearPromise = this.step4Container.waitFor({ 
      state: 'attached', 
      timeout: 20000 
    }).catch(() => null);
    
    await this.step3NextButton.click();
    
    await step4AppearPromise;
    await this.step4Container.waitFor({ state: 'attached', timeout: 10000 });
    await this.nameInput.waitFor({ state: 'attached', timeout: 10000 });
  }

  async clickStep4Next() {
    await this.step4Container.waitFor({ state: 'visible', timeout: 15000 });
    await this.nameInput.waitFor({ state: 'attached', timeout: 15000 });
    await this.emailInput.waitFor({ state: 'attached', timeout: 15000 });
    await this.step4NextButton.waitFor({ state: 'attached', timeout: 15000 });
    
    const step5AppearPromise = this.step5Container.waitFor({ 
      state: 'attached', 
      timeout: 20000 
    }).catch(() => null);
    
    await this.step4NextButton.click();
    
    await step5AppearPromise;
    await this.step5Container.waitFor({ state: 'attached', timeout: 10000 });
    await this.phoneInput.waitFor({ state: 'attached', timeout: 10000 });
  }

  async fillName(name: string) {
    await this.step4Container.waitFor({ state: 'visible', timeout: 15000 });
    await this.nameInput.waitFor({ state: 'visible', timeout: 10000 });
    
    await this.nameInput.fill(name);
    
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
    await this.step4Container.waitFor({ state: 'visible', timeout: 15000 });
    await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
    
    await this.emailInput.fill(email);
    
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
    await this.step5Container.waitFor({ state: 'attached', timeout: 15000 });
    await this.phoneInput.waitFor({ state: 'attached', timeout: 10000 });
    
    const isVisible = await this.phoneInput.isVisible({ timeout: 2000 }).catch(() => false);
    if (isVisible) {
      await this.phoneInput.fill(phone);
    } else {
      await this.phoneInput.fill(phone, { force: true });
    }
    
    await this.page.waitForFunction(
      (expectedDigits: string) => {
        const input = document.querySelector('input[data-phone-input], input[name="phone"]') as HTMLInputElement;
        const value = input?.value || '';
        const digitsOnly = value.replace(/\D/g, '');
        return digitsOnly.length >= expectedDigits.replace(/\D/g, '').length;
      },
      phone,
      { timeout: 5000 }
    ).catch(() => null);
  }

  async submitForm() {
    await this.step5Container.waitFor({ state: 'visible', timeout: 15000 });
    await this.step5SubmitButton.waitFor({ state: 'visible', timeout: 10000 });
    
    const thankYouPromise = this.page.waitForURL((url) => 
      url.toString().toLowerCase().includes('thank') || 
      url.toString().toLowerCase().includes('thankyou'),
      { timeout: 30000 }
    ).catch(() => null);
    
    const thankYouContentPromise = this.page.waitForSelector('h1:has-text("Thank"), h1:has-text("thank")', { 
      timeout: 30000 
    }).catch(() => null);
    
    await this.step5SubmitButton.click();
    
    await Promise.race([
      thankYouPromise,
      thankYouContentPromise,
      this.page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => null)
    ]);
  }

  async completeFormWithValidData(email?: string) {
    const uniqueEmail = email || `test-${Date.now()}@test.test`;
    
    await this.fillZipcode('23451');
    await this.clickStep1Next();

    await this.selectStep2Checkbox();
    await this.clickStep2Next();

    await this.selectPropertyType();
    await this.clickStep3Next();

    await this.fillName('Test User');
    await this.fillEmail(uniqueEmail);
    await this.clickStep4Next();

    await this.fillPhone('1234567890');
  }

  async takeScreenshot(name: string) {
    const screenshotsDir = 'screenshots';
    
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
