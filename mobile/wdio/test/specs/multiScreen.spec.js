import assert from 'assert';
import { EvincedWdioMobileSdk } from '@evinced/wdio-mobile-sdk';

// Captures multiple screen states with analyze() then collects all reports
// at once via reportStored(). Use this when you want one Report per screen
// without enabling fully automatic continuous scanning.
describe('Evinced Multi-Screen - analyze + reportStored', () => {
  let evincedSdk;

  beforeEach(() => {
    evincedSdk = new EvincedWdioMobileSdk();
    evincedSdk.setupCredentials(
      process.env.EVINCED_SERVICE_ID,
      process.env.EVINCED_API_KEY
    );
  });

  it('captures multiple screens and reports stored results', async () => {
    // Screen 1: app launch state
    await browser.pause(3000);
    await evincedSdk.analyze();

    // Screen 2: navigate deeper if possible
    try {
      await $('//*[@content-desc="Next"]').click();
      await browser.pause(2000);
    } catch (e) {
      // navigation not available on this screen
    }
    await evincedSdk.analyze();

    const reports = await evincedSdk.reportStored();
    assert.ok(reports && reports.length > 0, 'reportStored should return at least one report');
    reports.forEach((report, i) => {
      console.log(`Screen ${i + 1} issues found: ${report.elements?.length ?? 0}`);
    });
  });
});
