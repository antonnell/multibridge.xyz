import React, { useState, useEffect } from 'react';
import styles from '../../styles/layout.module.scss';
import Layout from '../../components/layout/layout.js'
import TokensTable from '../../components/tokensTable';

import stores from '../../stores';
import {
  ERROR,
  GET_SWAP_TOKENS,
  SWAP_TOKENS_RETURNED,
} from '../../stores/constants';

function Tokens({ changeTheme }) {

  const [swapTokens, setSwapTokens] = useState(null);
  const [search, setSearch] = useState('');
  const [filteredSwapTokens, setFilteredSwapTokens] = useState(null);

  useEffect(() => {
    const swapTokensReturned = () => {
      setSwapTokens(stores.swapStore.getStore('swapTokens'));
      console.log(stores.swapStore.getStore('swapTokens'));
      setFilteredSwapTokens(stores.swapStore.getStore('swapTokens'));
    };
    stores.emitter.on(SWAP_TOKENS_RETURNED, swapTokensReturned);
    stores.dispatcher.dispatch({ type: GET_SWAP_TOKENS });

    return () => {
      stores.emitter.removeListener(SWAP_TOKENS_RETURNED, swapTokensReturned);
    };
  }, []);

  const onSearchChanged = (event) => {
    setSearch(event.target.value);

    setFilteredSwapTokens(
      swapTokens.filter((token) => {
        const searchT = event.target.value;

        if (!searchT || searchT === '') {
          return true;
        }

        return (
          token.name.toLowerCase().includes(searchT.toLowerCase()) ||
          token.symbol.toLowerCase().includes(searchT.toLowerCase()) ||
          token.srcChainID.toLowerCase().includes(searchT.toLowerCase()) ||
          token.destChainID.toLowerCase().includes(searchT.toLowerCase()) ||
          token.srcContract.address
            .toLowerCase()
            .includes(searchT.toLowerCase()) ||
          token.destContract.address
            .toLowerCase()
            .includes(searchT.toLowerCase()) ||
          token.mpc.address.toLowerCase().includes(searchT.toLowerCase())
        );
      })
    );
  };

  const chainMap = stores.accountStore.getStore('chainIDMapping');


  return (
    // <Layout changeTheme={ changeTheme }>

    <div className={styles.tokensPage}>
    <div className={styles.searchBar} style={{width: '60% !important'}}>
      <input
        className={styles.searchToken}
        type="text"
        placeholder="ETH, FTM..."
        value={search}
        onChange={onSearchChanged}
      />
      <a
        className={styles.addTokenLink}
        href="https://dard6erxu8t.typeform.com/to/C7RwF08A"
        target="_blank"
        rel="noreferrer"
      >
        Cant find a token? request to add it
      </a>
    </div>
    {filteredSwapTokens !== null ? <TokensTable swapTokens={filteredSwapTokens} chainMap={chainMap} /> : null}
    </div>
  // </Layout>

  )
}

export default Tokens
