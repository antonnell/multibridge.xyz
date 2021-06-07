import React from 'react';
import PropTypes from 'prop-types';

import styles from './wallets.module.scss';
import WalletTile, { Wallet } from './WalletTile';

/**
 * Renders array of wallets in n x n grid
 */

function WalletsGrid({ wallets, columns }) {
  const getRow = (_wallets, row) => (
    <div className={styles.walletRow} key={`wallet-row-${row}`}>
      {_wallets.map((wallet) => (
        <WalletTile {...wallet} key={wallet.id} />
      ))}
    </div>
  );

  const rows = Math.ceil(wallets.length / columns);
  const components = [];
  for (let i = 0; i < rows; i += 1) {
    const rowWallets = wallets.slice(i * columns, i * columns + columns);
    components.push(getRow(rowWallets, i));
  }
  return <div className={styles.walletGrid}>{components}</div>;
}
WalletsGrid.propTypes = {
  wallets: PropTypes.arrayOf(PropTypes.shape(Wallet)).isRequired,
  columns: PropTypes.number,
};
WalletsGrid.defaultProps = {
  columns: 2,
};
export default WalletsGrid;
