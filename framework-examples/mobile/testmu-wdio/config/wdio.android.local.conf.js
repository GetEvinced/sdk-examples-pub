require('dotenv').config({ path: '.env.local' });
const path = require('path');

// Force the correct SDK root regardless of what the shell environment has set
process.env.ANDROID_HOME = '/Users/shane/Library/Android/sdk';
process.env.ANDROID_SDK_ROOT = '/Users/shane/Library/Android/sdk';

exports.config = {
  hostname: '127.0.0.1',
  port: 4723,
  path: '/',

  specs: ['../tests/evinced.test.js'],

  capabilities: [{
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:app': path.resolve('./proverbial_android.apk'),
    'appium:autoGrantPermissions': true,
  }],

  services: [['appium', { command: 'appium' }]],

  logLevel: 'warn',
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: { timeout: 180000 },
};
