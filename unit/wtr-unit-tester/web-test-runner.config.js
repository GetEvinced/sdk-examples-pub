import { playwrightLauncher } from '@web/test-runner-playwright'
import { captureBrowserLog } from '@evinced/unit-tester/bin/browser-log-capture.js'

const isDebug = process.env.DEBUG === 'true'

const envForBrowser = {
  EVINCED_SERVICE_ID: process.env.EVINCED_SERVICE_ID ?? '',
  EVINCED_API_KEY: process.env.EVINCED_API_KEY ?? ''
}

export default {
  files: ['test/**/*.test.js'],
  nodeResolve: true,
  rootDir: './',
  testRunnerHtml: (testFrameworkImport) =>
    `<!DOCTYPE html><html><head></head><body>` +
    `<script>window.__WTR_ENV__ = ${JSON.stringify(envForBrowser)};</script>` +
    `<script type="module" src="${testFrameworkImport}"></script></body></html>`,

  plugins: [],

  browsers: [
    playwrightLauncher({
      product: 'chromium',
      launchOptions: {
        headless: !isDebug,
        slowMo: isDebug ? 500 : 0
      }
    })
  ],

  testFramework: {
    config: {
      ui: 'bdd',
      timeout: 30000
    }
  },

  // browserLogs: true,
  // filterBrowserLogs: captureBrowserLog
}
