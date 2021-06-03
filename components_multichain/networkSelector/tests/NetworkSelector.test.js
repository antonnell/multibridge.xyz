import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import NetworkSelector from '../NetworkSelector';
// Mock react-select drop down for page size
// https://polvara.me/posts/testing-a-custom-select-with-react-testing-library

let _formatOptionLabel = null;
jest.mock(
  'react-select',
  () => ({ options, value, onChange, formatOptionLabel }) => {
    const React = require('react');
    _formatOptionLabel = formatOptionLabel;
    function handleChange(event) {
      const option = options.find(
        (option) => option.value === event.currentTarget.value
      );
      onChange(option);
    }
    return (
      <select data-testid="select" value={value} onChange={handleChange}>
        {options.map(({ name, value }) => (
          <option key={name} value={value}>
            {name}
          </option>
        ))}
      </select>
    );
  }
);
describe('NetworkSelector', () => {
  const icon = '/path/to/icon';
  const options = [
    { value: 'polygon', name: 'Polygon Network', icon },
    { value: 'Quorum', name: 'Quorum', icon },
    { value: 'Easyfi', name: 'Easyfi', icon },
  ];
  test('renders with supplied options', () => {
    render(<NetworkSelector options={options} />);
    for (let i = 0; i < options.length; i++) {
      expect(screen.getByText(options[i].name)).toBeInTheDocument();
    }
  });

  test('formats menu value with label', () => {
    const value = options[0].value;
    render(<NetworkSelector options={options} value={value} />);
    let optionLabel = _formatOptionLabel(options[0], { context: 'menu' });
    cleanup();
    render(optionLabel);
    expect(screen.getByText(options[0].name));
    // menu selected value scenario display null
    optionLabel = _formatOptionLabel(options[0], { context: 'value' });
    expect(optionLabel).toBeNull();
  });
});
