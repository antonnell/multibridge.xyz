import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletsGrid from '../WalletsGrid';
import userEvent from '@testing-library/user-event';

describe('Wallets - WalletGrids', () => {
  test('render WalletTile with wallet name', () => {
    const wallets = [
      { title: 'Wallet1', icon: '/path/to/icon1', id: 'wallet-1' },
      { title: 'Wallet2', icon: '/path/to/icon2', id: 'wallet-2' },
    ];
    render(<WalletsGrid wallets={wallets} />);
    wallets.forEach((wallet) => {
      expect(screen.getByText(wallet.title)).toBeInTheDocument();
    });
  });
});
