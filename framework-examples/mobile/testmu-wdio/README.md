# Evinced Accessibility Tests — WebdriverIO + TestMu

This repo runs accessibility scans on mobile apps using the [Evinced SDK](https://developer.evinced.com/sdks-for-mobile-apps/wdio-mobile-sdk).
It works on your computer (local) and in the cloud (TestMu).

---

## What you need

- [Node.js 20+](https://nodejs.org)
- [Appium](https://appium.io) — `npm install -g appium`
- An [Evinced](https://evinced.com) account (for credentials)
- A [TestMu](https://www.testmuai.com) account (for cloud runs only)
- Android Studio (for Android local runs)
- Xcode (for iOS local runs, Mac only)

---

## Step 1 — Install

```bash
npm install
```

---

## Step 2 — Add your credentials

Copy the example file:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your values:

```
LT_USERNAME=        # your TestMu username
LT_ACCESS_KEY=      # your TestMu access key (from https://accounts.lambdatest.com/security)

EVINCED_SERVICE_ACCOUNT_ID=   # from the Evinced dashboard
EVINCED_API_KEY=              # from the Evinced dashboard
```

---

## Step 3 — Get the demo apps

Download these two files and put them in the root of this repo:

| Platform | Download |
|----------|----------|
| Android  | https://prod-mobile-artefacts.lambdatest.com/assets/docs/proverbial_android.apk |
| iOS (cloud) | https://prod-mobile-artefacts.lambdatest.com/assets/docs/proverbial_ios.ipa |
| iOS (local simulator) | https://github.com/saucelabs/my-demo-app-rn/releases/download/v1.3.0/iOS-Simulator-MyRNDemoApp.1.3.0-162.zip |

Unzip the iOS simulator file:

```bash
unzip iOS-Simulator-MyRNDemoApp.1.3.0-162.zip -d MyRNDemoApp.simulator
```

---

## Running locally

### Android

1. Open Android Studio and start an emulator (any API 30+ device works)
2. Wait until the emulator home screen is visible, then run:

```bash
npm run test:android:local
```

### iOS (Mac only)

```bash
npm run test:ios:local
```

The iPhone 16 simulator boots automatically.

---

## Running on TestMu (cloud)

First, upload your apps. This only needs to be done once — the script saves the app URLs into `.env.local` automatically:

```bash
npm run upload:apps
```

Then run on a real device or virtual device:

```bash
# Android
npm run test:android:real
npm run test:android:virtual

# iOS
npm run test:ios:real
npm run test:ios:virtual
```

> Cloud runs require a TestMu plan that includes Native App Automation.

---

## What the tests do

All tests run against `tests/evinced.test.js` and generate reports in the `./reports` folder.

| Test | What it does |
|------|-------------|
| single-state scan | Scans the app's home screen once |
| multi-state scan | Scans two states and combines the results |
| continuous mode | Automatically captures every screen change |

To run just one test at a time, add `--mochaOpts.grep` with the test name:

```bash
npm run test:android:local -- --mochaOpts.grep "single-state"
```

---

## Uploading results to the Evinced dashboard

Use the upload test instead of the default one:

```bash
npm run test:upload:android
npm run test:upload:ios
```

Reports appear at https://platform.evinced.com/mobile-sdk

---

## All commands

| Command | What it does |
|---------|-------------|
| `npm run upload:apps` | Upload apps to TestMu and save URLs |
| `npm run test:android:local` | Run on local Android emulator |
| `npm run test:ios:local` | Run on local iOS simulator |
| `npm run test:android:real` | Run on TestMu real Android device |
| `npm run test:android:virtual` | Run on TestMu Android emulator |
| `npm run test:ios:real` | Run on TestMu real iPhone |
| `npm run test:ios:virtual` | Run on TestMu iOS simulator |
| `npm run test:upload:android` | Run + upload results to Evinced dashboard |
| `npm run test:upload:ios` | Run + upload results to Evinced dashboard |
