import React from 'react';
import { render, screen } from '@testing-library/react';
import CoinSelector from '../CoinSelector';
// Mock react-select drop down for page size
// Ref: https://polvara.me/posts/testing-a-custom-select-with-react-testing-library
jest.mock(
  'react-select',
  () => ({ options, formatOptionLabel, value, onChange }) => {
    const React = require('react');
    function handleChange(event) {
      const option = options.find(
        (option) => option.value === parseInt(event.currentTarget.value)
      );
      onChange(option);
    }
    if (formatOptionLabel) {
    }
    return (
      <select data-testid="select" value={value} onChange={handleChange}>
        {options.map(({ name, value }) => (
          <option key={value} value={value}>
            {name}
          </option>
        ))}
      </select>
    );
  }
);
describe('CoinSelector', () => {
  const options = [
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
  test('render coinselector with supplied options', () => {
    const value = options[0].value;
    render(<CoinSelector options={options} value={value} />);
    for (let i = 0; i < options.length; i++) {
      expect(screen.getByText(options[i].name)).toBeInTheDocument();
    }
  });
});
