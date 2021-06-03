import React from 'react';

const WalletContext = React.createContext({
  wallet: false,
  setWallet: null,
});
export default WalletContext;
