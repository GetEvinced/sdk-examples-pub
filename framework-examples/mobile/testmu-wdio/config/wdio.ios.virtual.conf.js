require('dotenv').config({ path: '.env.local' });

exports.config = {
  user: process.env.LT_USERNAME,
  key: process.env.LT_ACCESS_KEY,
  hostname: 'mobile-hub.lambdatest.com',
  port: 80,
  path: '/wd/hub',

  specs: ['../tests/evinced.test.js'],

  capabilities: [{
    platformName: 'iOS',
    'appium:deviceName': 'iPhone 14',
    'appium:platformVersion': '17',
    'appium:app': process.env.LT_IOS_APP_URL,
    'appium:autoAcceptAlerts': true,
    'LT:Options': {
      build: 'Evinced iOS Demo',
      name: 'Evinced Accessibility Scan - iOS Simulator',
      isRealMobile: false,
      w3c: true,
    },
  }],

  logLevel: 'warn',
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: { timeout: 120000 },
};
