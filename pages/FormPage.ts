import { Page, Locator } from '@playwright/test';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

export class FormPage {
  readonly page: Page;

  // Step 1 - Zipcode
  readonly zipcodeInput: Locator;
  readonly step1NextButton: Locator;

  // Step 2 - Why Interested (Checkboxes)
  readonly step2NextButton: Locator;

  // Step 3 - Property Type (Radio buttons)
  readonly propertyTypeLabel: Locator;
  readonly propertyTypeRadio: Locator;
  readonly step3NextButton: Locator;

  // Step 4 - Personal Information
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly step4SubmitButton: Locator;

  // Form containers
  readonly formContainer1: Locator;
  readonly formContainer2: Locator;

  constructor(page: Page) {
    this.page = page;

    // Form containers
    this.formContainer1 = page.locator('#form-container-1');
    this.formContainer2 = page.locator('#form-container-2');

    // Step 1 - Zipcode
    this.zipcodeInput = page.locator('input[data-zip-code-input], input[name="zipCode"]').first();
    this.step1NextButton = page.locator('#form-container-1 > div.steps.step-2 > div.row > div > div > form > div > div.col-12.mt-4.pt-2 > div > button, button[data-tracking="btn-step-1"], button:has-text("Next")').first();

    // Step 2 - Why Interested
    this.step2NextButton = page.locator('#form-container-1 > div.steps.step-2 > div.row > div > div > form > div > div.col-12.mt-4 > div > button, button[data-tracking="btn-step-2"], button:has-text("Next")').first();

    // Step 3 - Property Type
    this.propertyTypeLabel = page.locator('#form-container-1 > div.steps.step-3 > div.row > div > div > form > div > div:nth-child(1) > div > div:nth-child(1) > div > label').first();
    this.propertyTypeRadio = page.locator('input[type="radio"][name="typeOfProperty"]').first();
    this.step3NextButton = page.locator('#form-container-1 > div.steps.step-3 > div.row > div > div > form > div > div.col-12.mt-4 > div > button, button[data-tracking^="btn-step"], button:has-text("Next")').first();

    // Step 4 - Personal Information
    this.nameInput = page.locator('input[data-name-input], input[name="name"]').first();
    this.emailInput = page.locator('input[type="email"][name="email"][required]').first();
    this.phoneInput = page.locator('input[name="phone"]').first();
    this.step4SubmitButton = page.locator('button[data-tracking="btn-step-4"], button:has-text("Go To Estimate"), button:has-text("Submit"), button[type="submit"]').first();
  }

  async goto() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await this.page.waitForTimeout(2000);
  }

  async fillZipcode(zipcode: string) {
    await this.zipcodeInput.fill(zipcode);
    await this.page.waitForTimeout(500);
  }

  async clickStep1Next() {
    await this.step1NextButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.step1NextButton.click();
    await this.page.waitForTimeout(2000);
  }

  async clickStep2Next() {
    await this.step2NextButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.step2NextButton.click();
    await this.page.waitForTimeout(2000);
  }

  async selectPropertyType() {
    // Wait for step 3 to be visible
    await this.page.waitForTimeout(1500); // Wait for step transition
    
    // Use JavaScript to click the radio button directly (more reliable)
    try {
      await this.propertyTypeRadio.evaluate((el: HTMLInputElement) => {
        el.click();
      });
      await this.page.waitForTimeout(500);
    } catch (e) {
      // Fallback: try clicking via label
      try {
        const radioId = await this.propertyTypeRadio.getAttribute('id');
        if (radioId) {
          await this.page.evaluate((id: string) => {
            const label = document.querySelector(`label[for="${id}"]`) as HTMLLabelElement;
            if (label) label.click();
          }, radioId);
          await this.page.waitForTimeout(500);
        }
      } catch (e2) {
        // Last resort: force click
        await this.propertyTypeRadio.click({ force: true });
        await this.page.waitForTimeout(500);
      }
    }
  }

  async clickStep3Next() {
    await this.step3NextButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.step3NextButton.click();
    await this.page.waitForTimeout(2000);
  }

  async fillName(name: string) {
    await this.nameInput.waitFor({ state: 'attached', timeout: 10000 });
    await this.nameInput.fill(name);
    await this.page.waitForTimeout(500);
  }

  async fillEmail(email: string) {
    await this.emailInput.waitFor({ state: 'attached', timeout: 10000 });
    await this.emailInput.fill(email);
    await this.page.waitForTimeout(500);
  }

  async fillPhone(phone: string) {
    await this.phoneInput.waitFor({ state: 'attached', timeout: 10000 });
    await this.phoneInput.fill(phone);
    await this.page.waitForTimeout(500);
  }

  async submitForm() {
    await this.step4SubmitButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.step4SubmitButton.click();
    await this.page.waitForTimeout(3000);
  }

  async completeFormWithValidData(email?: string) {
    const uniqueEmail = email || `test-${Date.now()}@test.test`;
    
    // Step 1: Zipcode
    await this.fillZipcode('12345');
    await this.clickStep1Next();

    // Step 2: Why Interested (auto-proceed or select option)
    await this.clickStep2Next();

    // Step 3: Property Type
    await this.selectPropertyType();
    await this.clickStep3Next();

    // Step 4: Personal Information
    await this.fillName('Test User');
    await this.fillEmail(uniqueEmail);
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

