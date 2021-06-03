import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tooltip from '../Tooltip';

describe('Tooltip', () => {
  test('renders Tooltip on hover', async () => {
    render(<Tooltip title="test-title" />);
    const helpIcon = screen.getByAltText('help');
    userEvent.hover(helpIcon);
    await waitFor(() => {
      expect(
        screen.getByText('test-title', { exact: false })
      ).toBeInTheDocument();
    });
  });
});
