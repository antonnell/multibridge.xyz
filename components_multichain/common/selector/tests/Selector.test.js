import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Selector from '../Selector'

describe('Selector', () => {
  test('renders selector', () => {
    const options = ['Green', 'Blue', 'Yellow', 'Red']
    const selectedIndex = 0
    const id = 'test-selector'
    render(<Selector options={options} selectedIndex={selectedIndex} id={id} />)
  })
})
