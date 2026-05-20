require('dotenv').config({ path: '.env.local' });

exports.config = {
  user: process.env.LT_USERNAME,
  key: process.env.LT_ACCESS_KEY,
  hostname: 'mobile-hub.lambdatest.com',
  port: 80,
  path: '/wd/hub',

  specs: ['../tests/evinced.test.js'],

  capabilities: [{
    platformName: 'Android',
    'appium:deviceName': 'Pixel 4',
    'appium:platformVersion': '11',
    'appium:app': process.env.LT_ANDROID_APP_URL,
    'appium:autoGrantPermissions': true,
    'LT:Options': {
      build: 'Evinced Android Demo',
      name: 'Evinced Accessibility Scan - Android Emulator',
      isRealMobile: false,
      w3c: true,
    },
  }],

  logLevel: 'warn',
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: { timeout: 120000 },
};
