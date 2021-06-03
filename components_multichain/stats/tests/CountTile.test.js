import React from 'react'
import { render, screen } from '@testing-library/react'
import CountTile from '../CountTile'

describe('Stats - CountTile', () => {
  test('render CountTile with count and text', () => {
    render(<CountTile title="TestTitle" subtitle="TestSubtitle" />)
    expect(screen.getByText('TestTitle')).toBeInTheDocument()
    expect(screen.getByText('TestSubtitle')).toBeInTheDocument()
  })
})
