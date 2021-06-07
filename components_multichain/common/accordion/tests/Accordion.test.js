import React from 'react'
import { render, screen } from '@testing-library/react'
import Accordion from '../Accordion'
import userEvent from '@testing-library/user-event'

describe('Accordion', () => {
  const items = [
    { id: 1, title: 'Gas Settings', body: 'Gas Settings Body' },
    { id: 2, title: 'Tolerance', body: 'Tolerance Body' }
  ]
  test('handles when no items passed', () => {
    const { container } = render(<Accordion />)
    expect(container.innerHTML).toEqual('')
  })
  test('renders elements passed', () => {
    render(<Accordion items={items} />)
    items.forEach((item) => expect(screen.getByText(item.title)).toBeInTheDocument())
    items.forEach((item) => expect(screen.getByText(item.body)).toBeInTheDocument())
  })
  test('on click, expands the item', async () => {
    render(<Accordion items={items} />)
    await userEvent.click(screen.getByText('Tolerance'))
    expect(screen.getByText('Gas Settings').lastChild.className).not.toContain('isActive')
    expect(screen.getByText('Tolerance').lastChild.className).toContain('isActive')
  })
  test('on click again, collapses the item', async () => {
    render(<Accordion items={items} />)
    await userEvent.click(screen.getByText('Tolerance'))
    expect(screen.getByText('Gas Settings').lastChild.className).not.toContain('isActive')
    expect(screen.getByText('Tolerance').lastChild.className).toContain('isActive')
    await userEvent.click(screen.getByText('Tolerance'))
    expect(screen.getByText('Tolerance').lastChild.className).not.toContain('isActive')
    expect(screen.getByText('Gas Settings').lastChild.className).not.toContain('isActive')
  })
})
