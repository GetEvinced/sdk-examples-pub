import { screen } from 'shadow-dom-testing-library'
import { userEvent } from '@testing-library/user-event'
import '@testing-library/jest-dom'
import EvincedUT from '@evinced/unit-tester'

import '../src/my-button.js'

describe('Button with increment', async () => {
  const user = userEvent.setup()

  beforeEach(() => {
    document.body.innerHTML = '<my-button name="World"></my-button>'
  })

  it('should increment the count on each click', async () => {
    await user.click(screen.getByShadowRole('button'))

    expect(screen.getByShadowRole('button')).toHaveTextContent('2')
  })

  it('should show name props', async () => {
    expect(screen.getByShadowRole('heading')).toHaveTextContent('World')
  })

  it('should pass evinced unit test', async () => {
    const results = await EvincedUT.analyzeButton({ role: 'button' })
    expect(results).toHaveNoFailures()
  })
})
