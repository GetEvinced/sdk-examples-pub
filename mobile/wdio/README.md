# Evinced WDIO Mobile SDK Examples

## Prerequisites

- Node.js 18+
- Evinced service account credentials (`EVINCED_SERVICE_ID` and `EVINCED_API_KEY`) or your own. Feel free to also edit the config or use `wdio.conf.js` to run locally.

**For local runs only:**
- Android Studio with an emulator configured (`Pixel_9_Pro_XL_API_35` AVD by default)
- Appium server installed (`npm install -g appium`)
- Appium UIAutomator2 driver (`appium driver install uiautomator2`)

The `.npmrc` file must contain your Evinced registry credentials to install `@evinced/wdio-mobile-sdk`.

## Setup

```bash
npm install

export EVINCED_SERVICE_ID=your_service_id
export EVINCED_API_KEY=your_api_key
```

## Running the tests

### Locally (against a local Appium server + emulator)

1. Start Appium: `appium`
2. Start your emulator: `~/Library/Android/sdk/emulator/emulator -avd Pixel_9_Pro_XL_API_35`
3. Run all tests:
   ```bash
   npm run wdio
   ```
4. Run a single spec:
   ```bash
   npx wdio run ./wdio.conf.js --spec test/specs/example.spec.js
   ```

### On Sauce Labs

Set your Sauce Labs credentials and run against `wdio.sauce.conf.js`:

```bash
export SAUCE_USER=your_sauce_username
export SAUCE_ACCESS_KEY=your_sauce_access_key

npm run wdio:sauce
```

The Sauce Labs config (`wdio.sauce.conf.js`) uses `storage:filename=com.evinced.demoapp-MK.apk` to reference the demo app, so the APK must be uploaded to Sauce Labs storage before running. In CI this is handled automatically by a pre-test step that calls the Sauce Labs Storage API:

```bash
curl -u "$SAUCE_USER:$SAUCE_ACCESS_KEY" \
  -X POST "https://api.us-west-1.saucelabs.com/v1/storage/upload" \
  -H "Content-Type: multipart/form-data" \
  -F "payload=@com.evinced.demoapp-MK.apk" \
  -F "name=com.evinced.demoapp-MK.apk"
```

For local Sauce Labs runs, upload the APK manually once using the same command (or via the Sauce Labs UI) and the `storage:filename=` reference will resolve on subsequent runs.

## Test files

| File | Pattern | Description |
|------|---------|-------------|
| `example.spec.js` | One-shot scan | Calls `evincedSdk.report()` to scan the launch screen. |
| `multiScreen.spec.js` | Multi-screen | Calls `analyze()` per screen, then `reportStored()` to collect one `Report` per captured screen. |
| `continuous.spec.js` | Continuous | Calls `startAnalyze()` to begin automatic scanning, interacts with the app, then `stopAnalyze()` to collect all reports. |
| `configured.spec.js` | Config + metadata | Uses `Filter` to exclude Minor-severity issues and `addTestCaseMetadata()` to attach custom key/value labels. |
| `platformUpload.spec.js` | Platform upload | Shows `UploadOption.ENABLED_BY_DEFAULT` (all scans upload automatically) and per-call upload via `PlatformUpload.ENABLED`. |

## SDK API summary

| Method | Description |
|--------|-------------|
| `new EvincedWdioMobileSdk()` | Create SDK instance (uses WDIO global `browser`) |
| `evincedSdk.setupCredentials(serviceId, apiKey)` | Authenticate |
| `evincedSdk.setOptions(options)` | Configure SDK (filters, platform upload, etc.) |
| `evincedSdk.report()` | One-shot scan; returns `Report` |
| `evincedSdk.report(false, undefined, PlatformUpload.ENABLED)` | One-shot scan, uploaded to the Evinced Platform |
| `evincedSdk.analyze()` | Capture the current screen without generating a report |
| `evincedSdk.reportStored()` | Generate reports from all stored `analyze()` calls; returns `Report[]` |
| `evincedSdk.startAnalyze()` | Begin continuous automatic scanning |
| `evincedSdk.stopAnalyze()` | End continuous session; returns `Report[]` |
| `evincedSdk.addTestCaseMetadata(key, value)` | Attach custom metadata labels |
| `evincedSdk.clearStored()` | Clear stored scans without generating a report |

## Platform upload

```js
import { EvincedWdioMobileSdk, UploadOption, PlatformUpload } from '@evinced/wdio-mobile-sdk';

// All scans upload automatically
evincedSdk.setOptions({
  platformConfig: { uploadOption: UploadOption.ENABLED_BY_DEFAULT }
});
await evincedSdk.report();

// Or upload only a specific scan
await evincedSdk.report(false, undefined, PlatformUpload.ENABLED);
```

## Docs

[Evinced WebdriverIO Mobile SDK documentation](https://developer.evinced.com/sdks-for-mobile-apps/wdio-mobile-sdk)

## Filtering issues

Severity and issue type filters take an object, not a plain string:

```js
import { Filter } from '@evinced/wdio-mobile-sdk';

evincedSdk.setOptions({
  evincedConfig: {
    excludeFilters: new Filter()
      .withFilterBySeverity({ name: 'Minor' })
      .getFilters(),
  },
});

// Filter by issue type
evincedSdk.setOptions({
  evincedConfig: {
    excludeFilters: new Filter()
      .withFilterByIssueType({ name: 'Color Contrast' })
      .getFilters(),
  },
});
```
