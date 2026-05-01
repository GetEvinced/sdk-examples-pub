import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import { captureBrowserLog } from '@evinced/unit-tester/bin/browser-log-capture.js'

const envForBrowser = {
  EVINCED_SERVICE_ID: process.env.EVINCED_SERVICE_ID ?? '',
  EVINCED_API_KEY: process.env.EVINCED_API_KEY ?? ''
}

export default defineConfig({
  root: './',
  define: {
    __VITEST_ENV__: JSON.stringify(envForBrowser)
  },
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
      headless: process.env.DEBUG !== 'true'
    },
    include: ['test/**/*.test.js'],
    testTimeout: 30000,
    globals: true,
    onConsoleLog(log, type) {
      captureBrowserLog({ type: type === 'stderr' ? 'error' : 'log', args: [log] })
      return true
    }
  }
})
