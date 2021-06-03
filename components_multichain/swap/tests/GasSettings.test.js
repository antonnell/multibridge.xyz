import React from 'react'
import { render, screen } from '@testing-library/react'
import GasSettings from '../GasSettings'
import userEvent from '@testing-library/user-event'

describe('GasSettings', () => {
  const options = [
    { name: 'Slow', value: 'slow', description: '83 Gwei' },
    { name: 'Fast', value: 'fast', description: '91 Gwei' },
    { name: 'Instant', value: 'instant', description: '102 Gwei' }
  ]
  test('renders GasSettings options', () => {
    render(<GasSettings options={options} />)
    options.forEach((option) => {
      expect(screen.getByText(option.name)).toBeInTheDocument()
      expect(screen.getByText(option.description, { exact: false })).toBeInTheDocument()
    })
  })
  test('highlights selected option', () => {
    render(<GasSettings options={options} defaultOption={options[1]} />)
    const parentClass = screen.getByText(options[1].name).parentElement.getAttribute('class')
    expect(parentClass).toContain('selected')
    // Others should not have selected class
    expect(screen.getByText(options[0].name).parentElement.getAttribute('class')).not.toContain('selected')
  })
  test('on click, changes selection', () => {
    render(<GasSettings options={options} />)
    const parent = screen.getByText(options[2].name).parentElement
    userEvent.click(parent)
    expect(parent.getAttribute('class')).toContain('selected')
  })
})
