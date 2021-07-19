import React from 'react';
import PropTypes from 'prop-types';

import styles from './wallets.module.scss';

/**
 * Render single wallet tile - image, text and onClick behaviour
 */
function WalletTile({ title, icon, onClick }) {
  const tileStyles = `${styles.walletTile} ${
    icon ? styles.active : styles.dead
  }`;
  return (
    <div
      className={tileStyles}
      onKeyDown={onClick}
      onClick={onClick}
      role="button"
      tabIndex="0"
    >
      {icon && <img className={styles.image} src={icon} alt="" />}
      <div className={styles.title}>{title}</div>
    </div>
  );
}
export const Wallet = {
  title: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func,
};
WalletTile.propTypes = Wallet;
WalletTile.defaultProps = {
  title: null,
  icon: null,
  onClick: () => null,
};
export default WalletTile;
