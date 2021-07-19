import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletTile from '../WalletTile';
import userEvent from '@testing-library/user-event';

describe('Wallets - WalletTile', () => {
  test('render WalletTile with wallet name', () => {
    render(<WalletTile title="metamask" icon="/some/path" />);
    const tile = screen.getByText('metamask');
    expect(tile).toBeInTheDocument();
  });
  test('onClick of wallet callback', () => {
    const onClick = jest.fn();
    render(<WalletTile title="metamask" icon="/some/path" onClick={onClick} />);
    const tile = screen.getByRole('button');
    userEvent.click(tile);
    expect(onClick).toBeCalled();
  });
});
