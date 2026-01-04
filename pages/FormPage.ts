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
  readonly step2CheckboxLabel: Locator;
  readonly step2NextButton: Locator;

  // Step 3 - Property Type (Radio buttons)
  readonly propertyTypeLabel: Locator;
  readonly propertyTypeRadio: Locator;
  readonly step3NextButton: Locator;

  // Step 4 - Personal Information (Name and Email)
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly step4NextButton: Locator;

  // Step 5 - Phone Number
  readonly phoneInput: Locator;
  readonly step5SubmitButton: Locator;

  // Form containers
  readonly formContainer1: Locator;
  readonly formContainer2: Locator;

  constructor(page: Page) {
    this.page = page;

    // Form containers
    this.formContainer1 = page.locator('#form-container-1');
    this.formContainer2 = page.locator('#form-container-2');

    // Step 1 - Zipcode
    this.zipcodeInput = page.locator('#form-container-1 > div.steps.step-1 > form > div.row > div.col-12.pt-4 > div.formSide > div.inputBlock.inputBlock_type1.mx-auto.px-2 > div.inputBlock__wrap > input.inputBlock__input[data-zip-code-input], input[data-zip-code-input], input[name="zipCode"]').first();
    this.step1NextButton = page.locator('button[data-tracking="btn-step-1"]').first();

    // Step 2 - Why Interested
    this.step2CheckboxLabel = page.locator('#form-container-1 > div.steps.step-2 > div.row > div.col-12 > div.formSide.formSide_left > form > div.row.no-gutter > div.col-12 > div.row.no-gutter.justify-content-center > div.col.px-2.mb-3.mb-md-0 > div.quizCard.quizCard_type2.quizCard_size-full > label.flex-md-column[for="why-interested-independence-1"], label[for="why-interested-independence-1"]').first();
    this.step2NextButton = page.locator('#form-container-1 > div.steps.step-2 button[data-tracking="btn-step-2"]').first();

    // Step 3 - Property Type
    this.propertyTypeLabel = page.locator('#form-container-1 > div.steps.step-3 > div.row > div.col-12 > div.formSide > form > div.row.no-gutter > div.col-12 > div.row.no-gutter.justify-content-center > div.col-12.col-md-4.col-xl-3.px-2.mb-3.mb-md-0 > div.quizCard.quizCard_type2.quizCard_size-full > label.flex-md-column[for="homeowner-owned-1"], label[for="homeowner-owned-1"]').first();
    this.propertyTypeRadio = page.locator('input[type="radio"][name="typeOfProperty"][id="homeowner-owned-1"], input[type="radio"][name="typeOfProperty"]').first();
    this.step3NextButton = page.locator('#form-container-1 > div.steps.step-3 button[data-tracking="btn-step-3"]').first();

    // Step 4 - Personal Information (Name and Email)
    this.nameInput = page.locator('#form-container-1 > div.steps.step-4 > form > div.row.pt-2 > div.col-12.py-3.py-md-4 > div.formSide > div.inputBlock.inputBlock_type1.text-left.mx-auto.px-2 > div.row.no-gutter.justify-content-center > div.col-12.col-sm-8.col-md-12.col-lg-7 > div.inputBlock__wrap > input.inputBlock__input[data-name-input], input[data-name-input], input[name="name"]').first();
    this.emailInput = page.locator('#form-container-1 > div.steps.step-4 > form > div.row.pt-2 > div.col-12.py-3.py-md-4 > div.formSide > div.inputBlock.inputBlock_type1.text-left.mx-auto.px-2 input[type="email"][name="email"][required].inputBlock__input, input[type="email"][name="email"][required]').first();
    this.step4NextButton = page.locator('#form-container-1 > div.steps.step-4 button[data-tracking="btn-step-4"]').first();

    // Step 5 - Phone Number
    this.phoneInput = page.locator('#form-container-1 > div.steps.step-5 > div.row.no-gutter.pt-2 > div.col-12.col-md-6 > div.formSide.formSide_left > form > div.inputBlock.inputBlock_type1.text-left.mx-auto.px-2 > div.row.no-gutter.justify-content-center > div.col-12.col-sm-7.col-md-12.col-xl-7 > div.inputBlock__wrap > input.inputBlock__input[data-phone-input], input[data-phone-input], input[name="phone"]').first();
    this.step5SubmitButton = page.locator('#form-container-1 > div.steps.step-5 button[data-tracking="btn-step-5"]').first();
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
    
    // Valid zipcode submission may trigger navigation to a new page
    // Wait for either URL change or step 2 to appear
    const currentUrl = this.page.url();
    
    // Start waiting for navigation before clicking
    const urlChangePromise = this.page.waitForURL((url) => url.toString() !== currentUrl, { 
      waitUntil: 'domcontentloaded', 
      timeout: 20000 
    }).catch(() => null);
    
    const step2AppearPromise = this.step2CheckboxLabel.waitFor({ 
      state: 'attached', 
      timeout: 20000 
    }).catch(() => null);
    
    // Click the Next button
    await this.step1NextButton.click();
    
    // Wait for either navigation (URL change) or step 2 to appear
    await Promise.race([
      urlChangePromise.then(async () => {
        // If navigation occurred, wait for page to fully load
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(3000);
      }),
      step2AppearPromise.then(async () => {
        // Step 2 appeared on same page - wait for it to be fully visible
        await this.step2CheckboxLabel.waitFor({ state: 'visible', timeout: 5000 }).catch(() => null);
        await this.page.waitForTimeout(2000);
      }),
      this.page.waitForTimeout(8000)
    ]);
    
    // Additional wait for page to stabilize after navigation or step transition
    // This ensures the page is ready before selecting the label
    await this.page.waitForTimeout(3000);
  }

  async selectStep2Checkbox() {
    // Select first checkbox option (Independence)
    // Wait for element to be attached and visible after page navigation/transition
    await this.step2CheckboxLabel.waitFor({ state: 'attached', timeout: 15000 });
    
    // Wait for the label to be visible (may take time after page load)
    await this.step2CheckboxLabel.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
      // If not visible, continue anyway - will use force/JS click
    });
    
    // Additional wait to ensure page is fully ready
    await this.page.waitForTimeout(1000);
    
    // Try visible first, fallback to JavaScript click if hidden
    const isVisible = await this.step2CheckboxLabel.isVisible({ timeout: 2000 }).catch(() => false);
    if (isVisible) {
      await this.step2CheckboxLabel.click();
    } else {
      // Element is attached but hidden, use JavaScript evaluation to click
      await this.step2CheckboxLabel.evaluate((el: HTMLLabelElement) => {
        el.click();
      });
    }
    
    // Wait after selecting to ensure selection is registered
    await this.page.waitForTimeout(1000);
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

  async clickStep4Next() {
    // Wait for step 4 to be visible first
    await this.nameInput.waitFor({ state: 'attached', timeout: 15000 });
    await this.emailInput.waitFor({ state: 'attached', timeout: 15000 });
    
    // Wait for the button to be attached, then try visible
    await this.step4NextButton.waitFor({ state: 'attached', timeout: 15000 });
    
    const isVisible = await this.step4NextButton.isVisible({ timeout: 5000 }).catch(() => false);
    if (isVisible) {
      await this.step4NextButton.click();
    } else {
      // If not visible, wait a bit more and try force click
      await this.page.waitForTimeout(2000);
      await this.step4NextButton.click({ force: true });
    }
    await this.page.waitForTimeout(2000);
  }

  async fillName(name: string) {
    await this.nameInput.waitFor({ state: 'attached', timeout: 10000 });
    // Try visible first, fallback to force fill if hidden
    const isVisible = await this.nameInput.isVisible({ timeout: 2000 }).catch(() => false);
    if (isVisible) {
      await this.nameInput.fill(name);
    } else {
      await this.nameInput.fill(name, { force: true });
    }
    await this.page.waitForTimeout(500);
  }

  async fillEmail(email: string) {
    await this.emailInput.waitFor({ state: 'attached', timeout: 10000 });
    // Try visible first, fallback to force fill if hidden
    const isVisible = await this.emailInput.isVisible({ timeout: 2000 }).catch(() => false);
    if (isVisible) {
      await this.emailInput.fill(email);
    } else {
      await this.emailInput.fill(email, { force: true });
    }
    await this.page.waitForTimeout(500);
  }

  async fillPhone(phone: string) {
    await this.phoneInput.waitFor({ state: 'attached', timeout: 10000 });
    // Try visible first, fallback to force fill if hidden
    const isVisible = await this.phoneInput.isVisible({ timeout: 2000 }).catch(() => false);
    if (isVisible) {
      await this.phoneInput.fill(phone);
    } else {
      await this.phoneInput.fill(phone, { force: true });
    }
    await this.page.waitForTimeout(500);
  }

  async submitForm() {
    await this.step5SubmitButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.step5SubmitButton.click();
    await this.page.waitForTimeout(3000);
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

