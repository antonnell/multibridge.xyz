import React, {useState, useEffect} from 'react';
import TransactionList from '../../components_multichain/explorer/TransactionList';
import styles from '../../styles/layout.module.scss';
import Layout from '../../components/layout/layout.js'
import stores from '../../stores';
import { ERROR, GET_EXPLORER, EXPLORER_RETURNED } from '../../stores/constants';

function Explorer({ changeTheme }) {
  const [swapHistory, setSwapHistory] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const swapHistoryReturned = (history) => {
      setSwapHistory(history);
    };

    stores.emitter.on(EXPLORER_RETURNED, swapHistoryReturned);
    stores.dispatcher.dispatch({ type: GET_EXPLORER });

    return () => {
      stores.emitter.removeListener(EXPLORER_RETURNED, swapHistoryReturned);
    };
  }, []);

  const onSearchChanged = (event) => {
    setSearch(event.target.value);
  };

  const onSearchKeydown = (event) => {
    if (event.which === 13) {
      setSwapHistory(null);
      stores.dispatcher.dispatch({
        type: GET_EXPLORER,
        content: { value: search },
      });
    }
  };

  return (
    // <Layout changeTheme={ changeTheme }>
    <div className={styles.explorerPage}>
    <div className={styles.searchBar}>
      <input
        className={styles.searchToken}
        type="text"
        placeholder="Search Account"
      />
    </div>
      <TransactionList swapHistory={swapHistory} />
  </div>
  // </Layout>

  )
}

export default Explorer

/*

<div className={ classes.explanationContainer }>
  <div className={ classes.explanationHeader }>
    <Typography variant='h3'>YEARN</Typography>
    <Typography variant='h4'>swaps</Typography>
  </div>
  <div className={ classes.explanationSubheader }>
    <Typography variant='h2'>Cross-chain swaps, <span className={ classes.accentColor }>made simple</span>.</Typography>
  </div>
</div>

*/
