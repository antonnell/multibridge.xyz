import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletConnector from '../WalletConnector';
import WalletContext from '../../../framework/WalletContext';
import userEvent from '@testing-library/user-event';
import config from '../../../config';

describe('Wallets - WalletConnector', () => {
  test('show wallets to connect', () => {
    const setWallet = jest.fn();
    render(
      <WalletContext.Provider value={{ wallet: null, setWallet }}>
        <WalletConnector open />
      </WalletContext.Provider>
    );
    const firstWallet = screen.getByText(config.wallets[0].title);
  });
  test('on wallet connect, set WalletContext properly', () => {
    const setWallet = jest.fn();
    const onClose = jest.fn();
    render(
      <WalletContext.Provider value={{ wallet: null, setWallet }}>
        <WalletConnector open={true} onClose={onClose} />
      </WalletContext.Provider>
    );
    const firstWallet = screen.getByText(config.wallets[0].title);
    userEvent.click(firstWallet);
    expect(setWallet).toBeCalled();
    expect(setWallet.mock.calls[0][0]).toEqual(config.wallets[0].id);

    expect(onClose).toBeCalled();
  });
  test('on wallet disconnect, clears WalletContext', () => {
    const setWallet = jest.fn();
    render(
      <WalletContext.Provider
        value={{ wallet: config.wallets[0].id, setWallet }}
      >
        <WalletConnector open={true} />
      </WalletContext.Provider>
    );
    const firstWallet = screen.getByText('Disconnect', { exact: false });
    userEvent.click(firstWallet);
    expect(setWallet).toBeCalled();
    expect(setWallet.mock.calls[0][0]).toEqual(null);
  });
});
