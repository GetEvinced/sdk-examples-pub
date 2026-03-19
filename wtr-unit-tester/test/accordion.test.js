/**
 * WTR Accordion Test - HTML inlined in test (aligned with vitest-react-unit-tester Accordion)
 * Runs in real browser (Chromium) via Web Test Runner + Mocha
 */

import EvincedUT, { configure, evincedChaiPlugin } from '@evinced/unit-tester/browser'
import * as chai from 'https://esm.sh/chai@4'

const { expect } = chai
chai.use(evincedChaiPlugin)

const { AUTH_SERVICE_ID, AUTH_SECRET } = window.__WTR_ENV__ ?? {}

configure({
  serviceAccountId: AUTH_SERVICE_ID,
  serviceAccountSecret: AUTH_SECRET,
})

function mountHtml(html) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const el = doc.body.firstElementChild
  document.body.appendChild(el)
  return el
}

// HTML aligned with vitest-react-unit-tester Accordion.jsx (section id, div.accordion, h3 > button, panels)
const ACCORDION_HTML = `
<div class="accordion" id="my-accordion">
  <button aria-expanded="false" aria-controls="panel1">Section 1</button>
  <div id="panel1" role="region" hidden>Content 1</div>
  <button aria-expanded="false" aria-controls="panel2">Section 2</button>
  <div id="panel2" role="region" hidden>Content 2</div>
</div>
`

describe('Accordion - Browser WTR Test', () => {
  describe('Accordion Component', () => {
    let container

    beforeEach(() => {
      container = mountHtml(ACCORDION_HTML)
    })

    it('should have accessibility failures', async function () {

      const results = await EvincedUT.analyzeAccordion('#my-accordion')

      expect(results).to.be.an('array')
      expect(results.length).to.be.greaterThan(0)
      expect(results).to.haveResult({
        test: 'toggle activation',
        pass: false
      })
    })
  })
})
