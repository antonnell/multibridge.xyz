import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Grid from '../Grid'
import userEvent from '@testing-library/user-event'

// Mock react-select drop down for page size
// https://polvara.me/posts/testing-a-custom-select-with-react-testing-library
jest.mock('react-select', () => ({ options, value, onChange }) => {
  const React = require('react')
  function handleChange (event) {
    const option = options.find((option) => option.value === parseInt(event.currentTarget.value))
    onChange(option)
  }

  return (
    <select data-testid="select" value={value} onChange={handleChange}>
      {options.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  )
})

describe('Grid', () => {
  let rowData = null
  const renderGrid = (rows) => {
    rowData = getRows(rows)
    return render(<Grid rowData={rowData} columnDefs={columnDefs} />)
  }
  const getRows = (n) => {
    const rowData = []
    for (let i = 0; i < n; i++) {
      rowData.push({
        col1: 'Token' + i,
        col2: 'Network' + i
      })
    }
    return rowData
  }
  const columnDefs = [
    {
      field: 'col1'
    },
    {
      field: 'col2'
    }
  ]

  test('renders grid', () => {
    renderGrid(21)
    expect(screen.getByText('Token1')).toBeInTheDocument()
    // next page content shouldnt be shown
    expect(screen.queryByText('Token11')).not.toBeInTheDocument()
  })
  test('renders grid pagination text', () => {
    renderGrid(21)
    expect(screen.getByText(`1 - 10 of ${rowData.length}`)).toBeInTheDocument()
  })
  test('renders renders Prev and Next', () => {
    renderGrid(21)
    expect(screen.getByText('Prev')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
  })
  test('next,prev click loads appropriate pages', async () => {
    renderGrid(21)
    const next = screen.getByText('Next')
    setTimeout(() => userEvent.click(next), 50) // Delay to get the grid ready
    // Move to next page
    await screen.findByText(`11 - 20 of ${rowData.length}`)
    await screen.findByText('Token11')
    const prev = screen.getByText('Prev')
    // Move to prev page
    userEvent.click(prev)
    await screen.findByText(`1 - 10 of ${rowData.length}`)
    await screen.findByText('Token1')
  })

  test('on page size change, shows appropriate rows', async () => {
    renderGrid(21)
    setTimeout(() => {
      fireEvent.change(screen.getByTestId('select'), {
        target: { value: 20 }
      })
    }, 100)
    await screen.findByText(`1 - 20 of ${rowData.length}`)
  })
})
