require('dotenv').config({ path: '.env.local' });
const path = require('path');

exports.config = {
  hostname: '127.0.0.1',
  port: 4723,
  path: '/',

  specs: ['../tests/evinced.test.js'],

  capabilities: [{
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:deviceName': 'iPhone 16',
    'appium:platformVersion': '18.3',
    'appium:udid': '4292879E-374B-4D1E-8865-77F252BBEA97',
    'appium:app': path.resolve('./MyRNDemoApp.simulator/MyRNDemoApp.app'),
    'appium:autoAcceptAlerts': true,
    'appium:usePrebuiltWDA': true,
    'appium:derivedDataPath': '/Users/shane/Library/Developer/Xcode/DerivedData/WebDriverAgent-cndckppztwhgqkdtzwagfqcktxdb',
  }],

  services: [['appium', { command: 'appium' }]],

  logLevel: 'warn',
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: { timeout: 180000 },
};
