import React from 'react';
import { render, screen } from '@testing-library/react';
import SwapField from '../SwapField';
import userEvent from '@testing-library/user-event';
const icon = '/some/path';
const coinOptions = [
  {
    value: 'FTM',
    name: 'FTM',
    symbol: 'FTM',
    balance: 100,
    currencyValue: 12345,
  },
  {
    value: 'DAI',
    name: 'DAI',
    symbol: 'DAI',
    balance: 101,
    currencyValue: 12345,
  },
  {
    value: 'MTLX',
    name: 'MTLX',
    symbol: 'DAI',
    balance: 102,
    currencyValue: 12345,
  },
];
const networkOptions = [
  { value: 'polygon', name: 'Polygon Network', icon },
  { value: 'ethereum', name: 'Ethereum', icon },
  { value: 'optimism', name: 'Optimism', icon },
];
describe('SwapField', () => {
  const value = {
    coin: coinOptions[0],
    network: networkOptions[0],
    amount: 12,
  };
  test('renders SwapField - coin and network with supplied values', () => {
    render(
      <SwapField
        networkOptions={networkOptions}
        coinOptions={coinOptions}
        value={value}
      />
    );
    screen.getByText('FTM');
    screen.getByText('Polygon', { exact: false });
  });
  test('on amount field entry, onChange is triggered', () => {
    const mockOnChange = jest.fn();
    render(
      <SwapField
        onChange={mockOnChange}
        networkOptions={networkOptions}
        coinOptions={coinOptions}
        value={value}
      />
    );
    const input = screen.getByDisplayValue(12);
    userEvent.type(input, '989'); // NOTE: This gets appended to already available text
    expect(mockOnChange).toBeCalled();
    const lastCall =
      mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1];
    expect(lastCall[0].amount).toEqual(12989);
  });
});
