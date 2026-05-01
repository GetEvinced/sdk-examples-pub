import assert from 'assert';
import { EvincedWdioMobileSdk, Filter } from '@evinced/wdio-mobile-sdk';

// Demonstrates filtering issues by severity and attaching custom metadata
// to the report for grouping/labelling results in the Evinced Platform.
describe('Evinced Configured - filters and metadata', () => {
  let evincedSdk;

  beforeEach(() => {
    evincedSdk = new EvincedWdioMobileSdk();
    evincedSdk.setupCredentials(
      process.env.EVINCED_SERVICE_ID,
      process.env.EVINCED_API_KEY
    );
    evincedSdk.setOptions({
      evincedConfig: {
        excludeFilters: new Filter()
          .withFilterBySeverity({ name: 'Minor' })
          .getFilters(),
      },
    });
  });

  it('scans with Minor severity excluded and custom metadata attached', async () => {
    evincedSdk.addTestCaseMetadata('team', 'mobile-qa');
    evincedSdk.addTestCaseMetadata('sprint', '2026-Q2');

    await browser.pause(3000);
    const report = await evincedSdk.report();
    assert.ok(report, 'Report should not be null');
    console.log(`Issues found (excluding Minor): ${report.elements?.length ?? 0}`);
  });
});
