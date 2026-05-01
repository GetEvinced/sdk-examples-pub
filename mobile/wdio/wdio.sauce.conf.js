export const config = {
  runner: 'local',
  user: process.env.SAUCE_USER,
  key: process.env.SAUCE_ACCESS_KEY,
  region: 'us',

  specs: ['./test/specs/**/*.js'],
  exclude: ['test/specs/webTest.js'],
  maxInstances: 10,

  capabilities: [{
    platformName: 'Android',
    'appium:app': 'storage:filename=com.evinced.demoapp-MK.apk',
    'appium:deviceName': 'Android GoogleAPI Emulator',
    'appium:platformVersion': '15.0',
    'appium:automationName': 'UiAutomator2',
    'sauce:options': {
      appiumVersion: '2.11.0',
      build: 'Examples Repository',
      name: 'JS WDIO Evinced Tests',
    },
  }],

  services: [['sauce']],

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
