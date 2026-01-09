import { Page, Locator } from '@playwright/test';

export class FormPage {
  readonly page: Page;

  readonly zipcodeInput: Locator;
  readonly step1NextButton: Locator;
  readonly step1Container: Locator;

  readonly step2Checkbox: Locator;
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

    this.step2Checkbox = this.step2Container.locator('input[id="why-interested-independence-1"]');
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
    await this.zipcodeInput.fill(zipcode);
  }

  async clickStep1Next() {
    await this.step1NextButton.click();
  }

  async selectStep2Checkbox() {
    await this.step2Checkbox.check();
  }

  async clickStep2Next() {
    await this.step2NextButton.click();
  }

  async selectPropertyType() {
    await this.propertyTypeRadio.check();
  }

  async clickStep3Next() {
    await this.step3NextButton.click();
  }

  async clickStep4Next() {
    await this.step4NextButton.click();
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPhone(phone: string) {
    await this.phoneInput.fill(phone);
  }

  async submitForm() {
    await this.step5SubmitButton.click();
  }

}
