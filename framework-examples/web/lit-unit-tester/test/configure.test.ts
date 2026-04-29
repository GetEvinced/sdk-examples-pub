import { configure } from '@evinced/unit-tester'
import EvincedUT from '@evinced/unit-tester'

import '../src/my-button.js'

// Configure the SDK with service account credentials from environment variables.
// Set EVINCED_SERVICE_ID and EVINCED_API_KEY before running tests, e.g.:
//   EVINCED_SERVICE_ID=your-id EVINCED_API_KEY=your-key npm test
configure({
  serviceAccountId: import.meta.env.EVINCED_SERVICE_ID,
  serviceAccountSecret: import.meta.env.EVINCED_API_KEY,
})

describe('Button with configure()', async () => {
  beforeEach(() => {
    document.body.innerHTML = '<my-button name="World"></my-button>'
  })

  it('should pass evinced unit test with explicit SDK configuration', async () => {
    const results = await EvincedUT.analyzeButton({ role: 'button' })
    expect(results).toHaveNoFailures()
  })
})
