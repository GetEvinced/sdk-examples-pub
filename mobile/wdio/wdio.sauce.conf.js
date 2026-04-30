import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Sauce Labs configuration for CI.
// The sauce service automatically uploads the APK to Sauce Labs storage and
// replaces the app capability with the resulting storage: URL before the
// session starts.
export const config = {
  runner: 'local',
  user: process.env.SAUCE_USER,
  key: process.env.SAUCE_ACCESS_KEY,
  region: 'us',

  specs: ['./test/specs/**/*.js'],
  exclude: ['test/specs/webTest.js'],
  maxInstances: 1,

  capabilities: [{
    platformName: 'Android',
    'appium:deviceName': 'Android GoogleAPI Emulator',
    'appium:platformVersion': '14',
    'appium:automationName': 'UiAutomator2',
    'appium:app': path.resolve(__dirname, 'com.evinced.demoapp-MK.apk'),
    'appium:noReset': false,
    'appium:uiautomator2ServerLaunchTimeout': 60000,
    'sauce:options': {
      name: 'Evinced Mobile WDIO',
      appiumVersion: 'latest',
    },
  }],

  services: ['sauce'],

  logLevel: 'error',
  bail: 0,
  waitforTimeout: 30000,
  connectionRetryTimeout: 300000,
  connectionRetryCount: 3,
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 180000,
  },
};
