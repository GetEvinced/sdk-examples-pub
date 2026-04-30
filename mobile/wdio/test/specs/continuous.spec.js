import assert from 'assert';
import { EvincedWdioMobileSdk } from '@evinced/wdio-mobile-sdk';

// Continuous mode: startAnalyze() begins automatic scanning in the background.
// Every screen transition is captured automatically. stopAnalyze() ends the
// session and returns one Report per captured state.
describe('Evinced Continuous - startAnalyze + stopAnalyze', () => {
  let evincedSdk;

  beforeEach(() => {
    evincedSdk = new EvincedWdioMobileSdk();
    evincedSdk.setupCredentials(
      process.env.EVINCED_SERVICE_ID,
      process.env.EVINCED_API_KEY
    );
  });

  it('automatically captures accessibility state during app interaction', async () => {
    await evincedSdk.startAnalyze();

    try {
      await $('//*[@content-desc="Next"]').click();
    } catch (e) {
      // navigation not available
    }
    await browser.pause(2000);

    const reports = await evincedSdk.stopAnalyze();
    assert.ok(reports, 'stopAnalyze should return reports');
    reports.forEach((report, i) => {
      console.log(`Report ${i + 1} issues found: ${report.elements?.length ?? 0}`);
    });
  });
});
