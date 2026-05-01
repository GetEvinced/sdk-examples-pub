import assert from 'assert';
import { EvincedWdioMobileSdk } from '@evinced/wdio-mobile-sdk';

describe('Evinced Example - One-shot scan', () => {
  let evincedSdk;

  beforeEach(() => {
    evincedSdk = new EvincedWdioMobileSdk();
    evincedSdk.setupCredentials(
      process.env.EVINCED_SERVICE_ID,
      process.env.EVINCED_API_KEY
    );
  });

  it('scans the launch screen for accessibility issues', async () => {
    await browser.pause(3000);
    const report = await evincedSdk.report();
    assert.ok(report, 'Report should not be null');
    console.log(`Issues found: ${report.elements?.length ?? 0}`);
  });
});
