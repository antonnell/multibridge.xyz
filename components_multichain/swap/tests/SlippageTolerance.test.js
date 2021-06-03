import React from 'react';
import { render, screen } from '@testing-library/react';
import SlippageTolerance from '../SlippageTolerance';
import userEvent from '@testing-library/user-event';

describe('SlippageTolerance', () => {
  const options = [{ value: 2 }, { value: 3 }];
  const selection = { value: 2, selectedOption: 0 };
  const onChange = jest.fn();
  test('renders slippage tolerance options', () => {
    render(
      <SlippageTolerance
        options={options}
        value={selection}
        onChange={onChange}
      />
    );
    options.forEach((option) => {
      expect(screen.getByText(option.value + '%')).toBeInTheDocument();
    });
  });
  test('on selection triggers onChange event', () => {
    const mockOnChange = jest.fn();
    const targetOption = options[1];
    render(
      <SlippageTolerance
        options={options}
        onChange={mockOnChange}
        value={selection}
      />
    );
    const option2 = screen.getByText(targetOption.value + '%');
    expect(option2.getAttribute('class')).not.toContain('selected');
    // now trigger a click
    userEvent.click(option2);
    expect(mockOnChange).toBeCalled();
    expect(mockOnChange.mock.calls[0][0].value).toEqual(targetOption.value);
  });
  test('user can type slippage and it triggers onChange', () => {
    const mockOnChange = jest.fn();
    render(
      <SlippageTolerance
        options={options}
        onChange={mockOnChange}
        value={selection}
      />
    );

    // Note: Input of type number is represented with accessible role as spinButton
    userEvent.type(screen.getByRole('spinbutton'), '4.5');
    expect(mockOnChange).toBeCalled();
    // Pick up the last onChange event
    const lastOnChange =
      mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1];
    expect(lastOnChange[0].value).toEqual(4.5);
  });
  test('should show textbox only when no predefined options sent', () => {
    render(
      <SlippageTolerance
        onChange={onChange}
        value={{ selectedOption: -1, value: 0 }}
      />
    );
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });
});
