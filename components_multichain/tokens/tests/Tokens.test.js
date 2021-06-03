import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Tokens from '../Tokens'

describe('Tokens', () => {
  test('renders Tokens', () => {
    render(<Tokens />)
  })
})
