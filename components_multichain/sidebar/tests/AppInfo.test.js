import React from 'react';
import { render, screen } from '@testing-library/react';
import AppInfo from '../AppInfo';

describe('AppInfo', () => {
  test('renders AppInfo', () => {
    render(<AppInfo lockedValue={500} version={'1.0.1'} />);
    screen.getByText('1.0.1', { exact: false });
    screen.getByText('500', { exact: false });
  });
});
