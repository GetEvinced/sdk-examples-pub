import assert from 'assert';
import { EvincedWdioMobileSdk, UploadOption, PlatformUpload } from '@evinced/wdio-mobile-sdk';

// Two upload approaches:
//   1. ENABLED_BY_DEFAULT: every report() call uploads automatically.
//   2. Per-call: pass PlatformUpload.ENABLED to a single report() call.
describe('Evinced Platform Upload', () => {
  let evincedSdk;

  beforeEach(() => {
    evincedSdk = new EvincedWdioMobileSdk();
    evincedSdk.setupCredentials(
      process.env.EVINCED_SERVICE_ID,
      process.env.EVINCED_API_KEY
    );
  });

  it('uploads automatically with ENABLED_BY_DEFAULT', async () => {
    evincedSdk.setOptions({
      platformConfig: {
        uploadOption: UploadOption.ENABLED_BY_DEFAULT,
      },
    });

    await browser.pause(3000);
    const report = await evincedSdk.report();
    assert.ok(report, 'Report should not be null');
    console.log(`Issues found (auto-uploaded): ${report.elements?.length ?? 0}`);
  });

  it('uploads a specific scan with PlatformUpload.ENABLED', async () => {
    await browser.pause(1000);
    const report = await evincedSdk.report(false, undefined, PlatformUpload.ENABLED);
    assert.ok(report, 'Report should not be null');
    console.log(`Issues found (per-call upload): ${report.elements?.length ?? 0}`);
  });
});
