import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Head from 'next/head'
import classes from './layout.module.css'
import Link from 'next/link'
import Navigation from '../navigation'
import SnackbarController from '../snackbar'

import classNames from 'classnames';
import SideMenu from '../../components_multichain/sidebar/SideBarMenu';
import AppInfo from '../../components_multichain/sidebar/AppInfo';
import SocialMedia from '../../components_multichain/sidebar/SocialMedia';
import SiteActions from '../../components_multichain/siteActions/SiteActions';


import 'font-awesome/css/font-awesome.min.css';
import styles from '../../styles/layout.module.scss';

const menuImg = { open: '/images/menu.svg', close: '/images/closeIcon.svg' };

export const siteTitle = 'Multichain.xyz'

function Layout({ children, configure, backClicked, changeTheme, isMobile }) {
  const [menuVisible, setMenuVisible] = useState(true);
  const showContent = !isMobile || (isMobile && !menuVisible);

  const toggleMenuVisibility = () => isMobile && setMenuVisible(!menuVisible);

  const rootClass = classNames(styles.container, {
    [styles.isMobile]: isMobile,
    isMobile: true,
  });

  const sideMenuClass = classNames(styles.sideMenu, {
    [styles.hidden]: !menuVisible,
  });
  const menuIcon = menuVisible ? menuImg.close : menuImg.open;

  return (
    <div className={rootClass}>
      <Head>
        <link rel="icon" href="/favicon.png" />
        <link
            rel="preload"
            href="/fonts/Inter/Inter-Regular.ttf"
            as="font"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/fonts/Inter/Inter-Bold.ttf"
            as="font "
            crossOrigin=""
          />
        <meta
          name="description"
          content="Multichain.xyz"
        />
        <meta name="og:title" content="Multichain" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className={styles.main}>
        <div className={sideMenuClass}>
        <div className={styles.appTitle}>
            <span className={styles.appName}>multichain</span>
            <div
              className={styles.appMenu}
              onClick={toggleMenuVisibility}
              onKeyDown={toggleMenuVisibility}
              role="button"
              tabIndex="0"
            >
              <img
                src={menuIcon}
                className={styles.menuImg}
                alt={menuVisible ? 'close menu' : 'open menu'}
              />
            </div>
          </div>
          {menuVisible && (
            <>
              <div className={styles.topPanel}>
                <SiteActions variant="mobile" />
              </div>
              <SideMenu onSelect={toggleMenuVisibility} />
              <div className={styles.sideMenuEndLine} />

              <div className={styles.sideBarFooter}>
                <div className={styles.separtor} />
                <AppInfo  version={'1.0.1'}/>
                {/* <SocialMedia /> */}
              </div>
            </>
          )}
          </div>   
          {showContent && <main className={ styles.content }>{children}</main>}
          {!isMobile && (
          <div className={styles.topPanel}>
            <SiteActions />
          </div>
        )}
          <SnackbarController />

          </div>
    </div>
  )
}
Layout.propTypes = {
  children: PropTypes.node.isRequired,
  isMobile: PropTypes.bool,
};
Layout.defaultProps = {
  isMobile: false,
};

export default Layout