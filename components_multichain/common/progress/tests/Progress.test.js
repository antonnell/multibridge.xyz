import React from 'react'
import { render, screen } from '@testing-library/react'
import Progress from '../Progress'
import userEvent from '@testing-library/user-event'

describe('Progress', () => {
  const progressText = 'test progress'
  test('displays progress text', () => {
    render(<Progress text={progressText} />)
    expect(screen.getByTestId('progress-img').className).toContain('animate')
  })
  test('doesnt animate for done scenario', () => {
    render(<Progress text={progressText} done={true} />)
    expect(screen.getByTestId('progress-img').className).not.toContain('animate')
  })
})
