import React from 'react'
import { render, screen } from '@testing-library/react'
import ImageTextCell from '../ImageTextCell'

describe('ImageTextCell', () => {
  test('renders image-text-cell', () => {
    render(<ImageTextCell icon="/test/path/icon" title="Sample Title" subtitle="Sample Subtitle" />)
    expect(screen.getByText('Sample Title')).toBeInTheDocument()
    expect(screen.getByText('Sample Subtitle')).toBeInTheDocument()
    const img = screen.getByAltText('icon')
    expect(img.src).toContain('/test/path/icon')
  })
})
