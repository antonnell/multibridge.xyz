import React from 'react';
import { render, screen } from '@testing-library/react';
import SiteActions from '../SiteActions';
import userEvent from '@testing-library/user-event';
import WalletContext from '../../../framework/WalletContext';

import config from '../../../config';

describe('SiteActions', () => {
  test('render SiteActions with connect wallet button', () => {
    render(<SiteActions />);
    expect(
      screen.getByText('Connect Wallet', { exact: false })
    ).toBeInTheDocument();
  });
  test('on click of connect wallet, wallet options displayed', () => {
    const setWallet = jest.fn();
    render(
      <WalletContext.Provider value={{ wallet: null, setWallet }}>
        <SiteActions />
      </WalletContext.Provider>
    );
    const connectWallet = screen.getByText('Connect Wallet', { exact: false });
    userEvent.click(connectWallet);
    config.wallets.forEach((wallet) => {
      wallet.icon && expect(screen.getByText(wallet.title)).toBeInTheDocument();
    });
  });
  test('once connected to wallet, no longer Connect Wallet is displayed', () => {
    const setWallet = jest.fn();

    render(
      <WalletContext.Provider value={{ wallet: 'metamask', setWallet }}>
        <SiteActions />
      </WalletContext.Provider>
    );
    const connectWallet = screen.queryByText('Connect Wallet', {
      exact: false,
    });
    expect(connectWallet).not.toBeInTheDocument();
  });
  test('once connected to wallet, use can disconnect', () => {
    const setWallet = jest.fn();

    render(
      <WalletContext.Provider value={{ wallet: 'metamask', setWallet }}>
        <SiteActions />
      </WalletContext.Provider>
    );
    const disconnectWallet = screen.getAllByRole('button')[1];
    userEvent.click(disconnectWallet);

    //Show shoul wallet tile with disconnect wallet option
    expect(
      screen.getByText('Disconnect Wallet', {
        exact: false,
      })
    ).toBeInTheDocument();
  });
  test('user can cancel wallet connection', () => {
    render(<SiteActions />);
    const connectWallet = screen.getByText('Connect Wallet', { exact: false });
    userEvent.click(connectWallet);
    const closeButton = screen.getByAltText('close');
    userEvent.click(closeButton);
    expect(
      screen.getByText('Connect Wallet', { exact: false })
    ).toBeInTheDocument();
  });
});
