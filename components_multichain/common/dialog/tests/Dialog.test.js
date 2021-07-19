import React from 'react';
import { within, waitFor, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dialog from '../Dialog';
describe('Dialog', () => {
  test('renders Dialog with title and content sent', () => {
    render(
      <Dialog title="Test Title" open>
        <div>Child Content</div>
      </Dialog>
    );
    screen.getByText('Test Title');
    screen.getByText('Child Content');
  });
  test('on dialog close, triggers onClose', () => {
    const onClose = jest.fn();
    render(
      <Dialog title="Test Title" open onClose={onClose}>
        <div>Child Content</div>
      </Dialog>
    );
    const closeIcon = screen.getByAltText('close', { exact: false });
    userEvent.click(closeIcon);
    expect(onClose).toBeCalled();
  });
});
