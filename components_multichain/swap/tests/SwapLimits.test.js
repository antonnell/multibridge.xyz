import React from 'react'
import { render, screen } from '@testing-library/react'
import SwapLimits from '../SwapLimits'
import userEvent from '@testing-library/user-event'

describe('SwapLimits', () => {
  const options = { maxSwapAmount: 1000.0, minSwapAmount: 1.0, swapFee: 0.1, maxFreeAmount: 90909, minFreeAmount: 90 }
  test('renders SwapLimits ', () => {
    render(<SwapLimits {...options} />)
    expect(screen.getByText(options.maxSwapAmount)).toBeInTheDocument()
    expect(screen.getByText(options.minSwapAmount)).toBeInTheDocument()
    expect(screen.getByText(options.maxFreeAmount)).toBeInTheDocument()
    expect(screen.getByText(options.minFreeAmount)).toBeInTheDocument()
  })
})
