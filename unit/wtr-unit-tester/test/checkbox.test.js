/**
 * WTR Checkbox Test - HTML inlined in test
 * Runs in real browser (Chromium) via Web Test Runner + Mocha
 */

import EvincedUT, { configure, evincedChaiPlugin } from '@evinced/unit-tester/browser'
import * as chai from 'https://esm.sh/chai@4'

const { expect } = chai
chai.use(evincedChaiPlugin)

const { EVINCED_SERVICE_ID, EVINCED_API_KEY } = window.__WTR_ENV__ ?? {}

configure({
  serviceAccountId: EVINCED_SERVICE_ID,
  serviceAccountSecret: EVINCED_API_KEY
})

function mountHtml(html) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const el = doc.body.firstElementChild
  document.body.appendChild(el)
  return el
}

// Accessible checkbox: label explicitly associated via `for`/`id`
const ACCESSIBLE_CHECKBOX_HTML = `
<div>
  <label for="terms">Accept terms and conditions</label>
  <input type="checkbox" id="terms" />
</div>
`

// Inaccessible checkbox: no label
const INACCESSIBLE_CHECKBOX_HTML = `
<div>
  <input type="checkbox" id="no-label-checkbox" />
</div>
`

describe('Checkbox - Browser WTR Test', () => {
  describe('accessible checkbox', () => {
    let container

    beforeEach(() => {
      container = mountHtml(ACCESSIBLE_CHECKBOX_HTML)
    })

    afterEach(() => {
      container?.remove()
    })

    it('should be accessible when label is provided', async function () {
      const results = await EvincedUT.analyzeCheckbox('#terms')

      expect(results).to.be.an('array')
      expect(results).to.haveNoWarnings()
      expect(results).to.haveNoFailures()
    })
  })

  describe('inaccessible checkbox', () => {
    let container

    beforeEach(() => {
      container = mountHtml(INACCESSIBLE_CHECKBOX_HTML)
    })

    afterEach(() => {
      container?.remove()
    })

    it('should detect failures for checkbox without label', async function () {
      const results = await EvincedUT.analyzeCheckbox('#no-label-checkbox')

      expect(results).to.be.an('array')
      expect(results).to.haveResult({
        test: 'checkbox name',
        pass: false
      })
    })
  })
})
