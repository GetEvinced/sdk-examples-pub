import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const config = {
  runner: 'local',
  port: 4723,
  specs: ['./test/specs/**/*.js'],
  exclude: ['test/specs/webTest.js'],
  maxInstances: 1,
  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': 'Pixel_9_Pro_XL_API_35',
      'appium:app': path.resolve(__dirname, 'com.evinced.demoapp-MK.apk'),
      'appium:noReset': true,
      'appium:uiautomator2ServerLaunchTimeout': 60000,
    },
  ],
  logLevel: 'error',
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 200000,
  connectionRetryCount: 3,
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
};
