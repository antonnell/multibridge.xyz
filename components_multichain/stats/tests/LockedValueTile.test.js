import React from 'react'
import { render, screen } from '@testing-library/react'
import LockedValuleTile from '../LockedValueTile'

describe('Stats - LockedValueTile', () => {
  test('render LockedValue, formatted to locale value', () => {
    render(<LockedValuleTile value={123456789.9} />)
    // NOTE: this could break when tester runs in non-US format locale
    expect(screen.getByText('123,456,789.90')).toBeInTheDocument()
  })
})
