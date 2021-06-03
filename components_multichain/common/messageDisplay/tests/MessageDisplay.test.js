import React from 'react';
import { render, screen } from '@testing-library/react';
import MessageDisplay from '../MessageDisplay';
import userEvent from '@testing-library/user-event';

describe('MessageDisplay', () => {
  test('displays message', () => {
    render(<MessageDisplay text={'test-message'} type="error" show={true} />);
    expect(screen.getByText('test-message')).toBeInTheDocument();
  });
  test('hides message', () => {
    render(<MessageDisplay text={'test-message'} type="error" show={false} />);
    expect(screen.queryByText('test-message')).not.toBeInTheDocument();
  });
});
