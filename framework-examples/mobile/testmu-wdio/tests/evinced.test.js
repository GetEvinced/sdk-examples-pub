require('dotenv').config({ path: '.env.local' });
const { EvincedWdioMobileSdk } = require('@evinced/wdio-mobile-sdk');

describe('Evinced Accessibility Scan', () => {
  let evincedSdk;

  before(() => {
    evincedSdk = new EvincedWdioMobileSdk({ outputDir: './reports' });
    evincedSdk.setupCredentials(
      process.env.EVINCED_SERVICE_ACCOUNT_ID,
      process.env.EVINCED_API_KEY
    );
  });

  // Pattern 1: single state scan
  // Scans whatever is on screen at the moment report() is called.
  // Generates an HTML + JSON report in ./reports.
  it('single-state scan: home screen', async () => {
    const report = await evincedSdk.report();
    console.log(`[Evinced] Found ${report.total} issue(s) on the home screen`);
  });

  // Pattern 2: multi-state scan
  // Call analyze() once per screen state, then reportStored() at the end.
  // Produces a single combined report covering all captured states.
  it('multi-state scan: home screen + one interaction', async () => {
    await evincedSdk.analyze();

    // Replace the pause below with real navigation for your app, e.g.:
    //   await $('~someButton').click();
    //   await browser.pause(1000);
    await browser.pause(2000);

    await evincedSdk.analyze();

    const reports = await evincedSdk.reportStored();
    const totalIssues = reports.reduce((sum, r) => sum + r.total, 0);
    console.log(`[Evinced] Found ${totalIssues} issue(s) across ${reports.length} screen state(s)`);
  });

  // Pattern 3: continuous mode
  // The SDK automatically captures a new snapshot whenever the screen changes.
  // Best for tests that involve lots of interactions across many screens.
  it('continuous mode: captures all interactions automatically', async () => {
    await evincedSdk.startAnalyze();

    // Interact with the app here — every screen change is captured automatically.
    // For this demo we just wait briefly.
    await browser.pause(3000);

    const reports = await evincedSdk.stopAnalyze();
    const totalIssues = reports.reduce((sum, r) => sum + r.total, 0);
    console.log(`[Evinced] Continuous scan: ${totalIssues} issue(s) across ${reports.length} snapshot(s)`);
  });
});
