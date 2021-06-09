import React, { useState, useContext } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Button from '../common/controls/Button';
import styles from './siteActions.module.scss';
import WalletContext from '../../framework/WalletContext';
import WalletConnector from '../wallets/WalletConnector';
import config from '../../config';
import SideBarMenuItem from '../sidebar/SideBarMenuItem';

/**
 * Renders Site Actions ( connect wallet, Eth MainNet actions)
 * Non mobile: Displayed in top right corner
 * Mobile: Renders as sidebar menu items
 */
const ethIcon = '/images/EthIcon24x24.svg';
const ethText = 'ETH mainnet';

function SiteActions({ variant }) {
  const { wallet } = useContext(WalletContext);
  // console.log(wallet);
  const [displayWalletConnector, setDisplayWalletConnector] = useState(false);
  // TODO: Dynamic field to display when connected.
  const connectWalletText = wallet ? 'todo-757..87' : 'Connect Wallet';
  const connectedWalletIcon = wallet
    ? config.wallets.find((w) => w.id === wallet).icon
    : null;
  const walletConnectClick = () => setDisplayWalletConnector(true);
  const isMobile = variant === 'mobile';

  const rootClass = classNames(styles.siteActions, {
    [styles.isMobile]: isMobile,
  });
  const mobileActions = () => {
    const actions = [];
    actions.push(
      <SideBarMenuItem
        selected={false}
        icon={ethIcon}
        text={ethText}
        key="ethConnect"
      />
    );
    actions.push(
      <SideBarMenuItem
        key="walletConnct"
        selected={false}
        icon={connectedWalletIcon}
        text={connectWalletText}
        onClick={walletConnectClick}
      />
    );
    return actions;
  };
  const desktopActions = () => {
    const actions = [];
    actions.push(
      <Button key="ethConnect" variant="secondary" icon={ethIcon}>
        ETH mainnet
      </Button>
    );
    actions.push(
      <Button
        key="walletConnect"
        variant="secondary"
        onClick={walletConnectClick}
        icon={connectedWalletIcon}
      >
        {connectWalletText}
      </Button>
    );
    return actions;
  };
  return (
    <div className={rootClass}>
      <WalletConnector
        open={displayWalletConnector}
        onClose={() => setDisplayWalletConnector(false)}
      />
      {(isMobile ? mobileActions : desktopActions)().map((a) => a)}
    </div>
  );
}

SiteActions.propTypes = {
  variant: PropTypes.string,
};
SiteActions.defaultProps = {
  variant: 'desktop',
};
export default SiteActions;
