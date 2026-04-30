/**
 * Vitest Browser Button Test - HTML inlined in test
 * Runs in real browser (Chromium) via Vitest + @vitest/browser
 */

import EvincedUT, { configure, evincedChaiPlugin } from '@evinced/unit-tester/browser'
import * as chai from 'chai'

const { expect } = chai
chai.use(evincedChaiPlugin)

configure({
  serviceAccountId: globalThis.__VITEST_ENV__?.EVINCED_SERVICE_ID,
  serviceAccountSecret: globalThis.__VITEST_ENV__?.EVINCED_API_KEY,
})

function mountHtml(html) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const el = doc.body.firstElementChild
  document.body.appendChild(el)
  return el
}

const BUTTON_HTML = `
<div>
  <button type="button" aria-label="Click me button" id="accessible-button">Click me</button>
  <button type="button" id="invalid-button"></button>
</div>
`

describe('Button - Browser Vitest Test', () => {
  describe('Button Component', () => {
    let container

    beforeEach(() => {
      container = mountHtml(BUTTON_HTML)
    })

    afterEach(() => {
      container?.remove()
    })

    it('should be accessible', async () => {
      const results = await EvincedUT.analyzeButton('#accessible-button')

      expect(results).to.be.an('array')
      expect(results).to.haveNoWarnings()
      expect(results).to.haveNoFailures()
    })

    it('should detect failures for invalid button', async () => {
      const results = await EvincedUT.analyzeButton('#invalid-button')

      expect(results).to.be.an('array')
      expect(results).to.haveResult({
        test: 'button name',
        pass: false
      })
    })
  })
})
