
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log("Navigating to localhost:3000...");
    await page.goto('http://localhost:3000', { timeout: 60000 });

    // Wait for content
    await page.waitForSelector('text=Shipment Tracking', { timeout: 30000 });
    console.log("Main page loaded.");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'verification/home_page_antd.png', fullPage: true });

    // 1. Create Shipment Modal
    console.log("Testing Create Shipment Modal...");
    await page.getByRole('button', { name: 'Add Tracking' }).click();

    // Simple wait for the modal wrapper to appear
    await page.waitForSelector('.ant-modal-content', { state: 'visible', timeout: 10000 });
    console.log("Create Shipment Modal Open.");
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'verification/create_shipment_modal.png' });

    // Close using keyboard
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500); // Wait for animation
    console.log("Create Shipment Modal Closed.");

    // 2. Profile Modal
    console.log("Testing Profile Modal...");
    // Find the card that has "User Profile"
    await page.getByText('User Profile').first().click();

    await page.waitForSelector('.ant-modal-content', { state: 'visible', timeout: 10000 });
    console.log("Profile Modal Open.");
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'verification/profile_modal.png' });

    // Close using keyboard
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    console.log("Profile Modal Closed.");

    // 3. Start Shipment Modal
    console.log("Testing Start Shipment Modal...");
    await page.getByText('Start Shipment').first().click();

    await page.waitForSelector('.ant-modal-content', { state: 'visible', timeout: 10000 });
    console.log("Start Shipment Modal Open.");
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'verification/start_shipment_modal.png' });

    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    console.log("Start Shipment Modal Closed.");

    console.log("All verifications passed.");

  } catch (e) {
      console.error("Verification failed:", e);
      await page.screenshot({ path: 'verification/failure.png' });
      process.exit(1);
  } finally {
      await browser.close();
  }
})();
