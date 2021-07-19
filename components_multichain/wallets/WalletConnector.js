import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import WalletsGrid from './WalletsGrid';
import config from '../../config';
import Dialog from '../common/dialog/Dialog';
import WalletContext from '../../framework/WalletContext';

import styles from './wallets.module.scss';
import useBreakpoints from '../../framework/useBreakpoints';

/**
 * Responsible for launching Wallets Grid and manipulating WalletContext when user connects/disconnects
 */
const WalletConnector = ({ open, onClose }) => {
  if (!open) return null;
  const { wallet, setWallet } = useContext(WalletContext);

  const connectWallet = ({ id }) => {
    // TODO : API: Wallet connection code goes here
    setWallet(id);
    onClose();
  };
  const disconnectWallet = () => {
    // TODO : API: Wallet disconnection code goes here
    setWallet(null);
    onClose();
  };
  const allWallets = [...config.wallets];
  allWallets.forEach((_wallet) => {
    _wallet.onClick = _wallet.icon ? () => connectWallet(_wallet) : null;
  });

  let wallets = allWallets;
  if (wallet) {
    // we're connected. prompt only the wallet to disconnect
    wallets = [
      {
        ...allWallets.find((w) => w.id === wallet),
        title: 'Disconnect Wallet',
        onClick: disconnectWallet,
      },
    ];
  }
  const { isMobile } = useBreakpoints();

  return (
    <div className={styles.walletConnector}>
      <Dialog
        title="Connect a Wallet"
        open
        onClose={onClose}
        className={styles.walletsDialog}
      >
        <WalletsGrid wallets={wallets} columns={isMobile ? 1 : 2} />
      </Dialog>
    </div>
  );
};
WalletConnector.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
WalletConnector.defaultProps = {
  onClose: () => null,
  open: false,
};
export default WalletConnector;
