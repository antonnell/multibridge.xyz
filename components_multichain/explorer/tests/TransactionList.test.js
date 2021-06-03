import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import TransactionList from '../TransactionList'

describe('TransactionList', () => {
  test('renders TransactionList', () => {
    render(<TransactionList />)
  })
})
