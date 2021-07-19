import React from 'react'
import { render, screen } from '@testing-library/react'
import Panel from '../Panel'
import userEvent from '@testing-library/user-event'

describe('Panel', () => {
  test('renders children in panel', () => {
    render(
      <Panel>
        <div>test</div>
      </Panel>
    )
    expect(screen.getByText('test')).toBeInTheDocument()
  })
  test('attaches classNames if sent', () => {
    render(
      <Panel classNames="testPanel">
        <div>test</div>
      </Panel>
    )
    expect(screen.getByText('test').parentElement.className).toContain('testPanel')
  })
})
