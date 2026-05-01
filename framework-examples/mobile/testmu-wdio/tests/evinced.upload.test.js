require('dotenv').config({ path: '.env.local' });
const { EvincedWdioMobileSdk, PlatformUpload } = require('@evinced/wdio-mobile-sdk');

// This test is identical to the single-state scan in evinced.test.js,
// except results are also uploaded to the Evinced platform dashboard.
// Run with:
//   npm run test:upload:ios
//   npm run test:upload:android

describe('Evinced Accessibility Scan with Dashboard Upload', () => {
  let evincedSdk;

  before(() => {
    evincedSdk = new EvincedWdioMobileSdk({ outputDir: './reports' });
    evincedSdk.setupCredentials(
      process.env.EVINCED_SERVICE_ACCOUNT_ID,
      process.env.EVINCED_API_KEY
    );
  });

  it('single-state scan: home screen (uploaded to dashboard)', async () => {
    const report = await evincedSdk.report({ upload: PlatformUpload.ENABLED });
    console.log(`[Evinced] Found ${report.total} issue(s) — results uploaded to the Evinced dashboard`);
  });

  it('multi-state scan: home screen + one interaction (uploaded to dashboard)', async () => {
    await evincedSdk.analyze();

    // Replace the pause below with real navigation for your app.
    await browser.pause(2000);

    await evincedSdk.analyze();

    const reports = await evincedSdk.reportStored({ upload: PlatformUpload.ENABLED });
    const totalIssues = reports.reduce((sum, r) => sum + r.total, 0);
    console.log(`[Evinced] Found ${totalIssues} issue(s) — results uploaded to the Evinced dashboard`);
  });
});
