import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import lightTheme from '../theme/light';
import darkTheme from '../theme/dark';
import Layout from '../components/layout'
import Configure from './configure'
import WalletContext from '../framework/WalletContext';

import stores from '../stores/index.js'

import {
  CONFIGURE,
  CONFIGURE_RETURNED,
  SWAP_CONFIGURED,
  ACCOUNT_CONFIGURED,
} from '../stores/constants'

import '../styles/globals.scss';

 function MyApp({ Component, pageProps }) {
  const [ themeConfig, setThemeConfig ] = useState(lightTheme);
  const [ accountConfigured, setAccountConfigured ] = useState(false)
  const [ swapConfigured, setSwapConfigured ] = useState(false)


  const [wallet, setWallet] = useState(false);
  const value = { wallet, setWallet };

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const changeTheme = (dark) => {
    setThemeConfig(dark ? darkTheme : lightTheme)
    localStorage.setItem('yearn.finance-dark-mode', dark ? 'dark' : 'light')
  }

  const accountConfigureReturned = () => {
    setAccountConfigured(true)
  }

  const swapConfigureReturned = () => {
    setSwapConfigured(true)
  }

  useEffect(function() {
    const localStorageDarkMode = window.localStorage.getItem('yearn.finance-dark-mode')
    changeTheme(localStorageDarkMode ? localStorageDarkMode === 'dark' : false)
  },[]);

  useEffect(function() {
    stores.emitter.on(SWAP_CONFIGURED, swapConfigureReturned)
    stores.emitter.on(ACCOUNT_CONFIGURED, accountConfigureReturned)

    stores.dispatcher.dispatch({ type: CONFIGURE })

    return () => {
      stores.emitter.removeListener(SWAP_CONFIGURED, swapConfigureReturned)
      stores.emitter.removeListener(ACCOUNT_CONFIGURED, accountConfigureReturned)
    }
  },[]);

  return (
    <WalletContext.Provider value={value}>
    <React.Fragment>
      <Head>
        <title>Multichain</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
      </Head>
      <Layout {...pageProps}>
        {swapConfigured && accountConfigured && <Component {...pageProps} changeTheme={ changeTheme } />}
        {!(swapConfigured && accountConfigured) && <Configure {...pageProps} />}
</Layout>
    </React.Fragment>
    </WalletContext.Provider>

  );
}
MyApp.getInitialProps = async ({ ctx }) => {
  let UA;
  if (ctx.req) {
    // if you are on the server and you get a 'req' property from your context
    UA = ctx.req.headers['user-agent']; // get the user-agent from the headers
  } else {
    UA = navigator.userAgent; // if you are on the client you can access the navigator from the window object
  }

  const isMobile = Boolean(
    UA &&
      UA.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
      )
  );
  return { pageProps: { isMobile } };
};
MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
MyApp.defaultProps = {
  pageProps: {},
};
export default MyApp