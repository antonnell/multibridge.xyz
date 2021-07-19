
import React, { useState, useContext } from 'react';

import SwapComponent from '../../components_multichain/swap/Swap'
import WalletContext from '../../framework/WalletContext';
import styles from '../../styles/layout.module.scss';

import Panel from '../../components_multichain/common/panel/Panel';
import Layout from '../../components/layout/layout.js'

import Progress from '../../components_multichain/common/progress/Progress';
import Button from '../../components_multichain/common/controls/Button';
import { formatMessage } from '../../framework/utils';
import config from '../../config';


export default function Swap() {

  const { wallet } = useContext(WalletContext);

  const [state, setState] = useState({
    progress: false,
    message: null,
    swapDone: false,
  });
  const onContinue = () => {
    setState({
      ...state,
      progress: false,
      message: null,
      swapDone: false,
    });
  };
  const { bridging, depositing, swapSuccess } = config.swap.messages;
  const onSwap = (swapData) => {
    const {
      from: {
        amount,
        coin: { name: coin },
      },
      to: {
        network: { name: network },
      },
    } = swapData;
    // TODO: API:Connect to actual Wallet
    setState({
      ...state,
      progress: true,
      message: formatMessage(bridging, { amount, coin, network }),
      swapData,
    });
    setTimeout(() => {
      setState({
        ...state,
        progress: true,
        message: formatMessage(depositing, { network }),
      });
    }, 1500);
    setTimeout(() => {
      setState({
        ...state,
        progress: true,
        swapDone: true,
        message: formatMessage(swapSuccess, { amount, coin, network }),
      });
    }, 3000);
  }
  return (
    // <Layout>
    <>
    <div className={styles.swapPage}>
    <div className={styles.swapPanelWrapper}>
      {!state.progress ? (
        <Panel classNames={styles.panelOverride}>
          <SwapComponent onSwap={onSwap} />
        </Panel>
      ) : (
        <Progress text={state.message} done={state.swapDone}>
          {state.swapDone && (
            <Button
              type="submit"
              className={styles.continue}
              onClick={onContinue}
            >
              Continue
            </Button>
          )}
        </Progress>
      )}
    </div>
    {!wallet && (
      <div className={styles.infoBlock}>
        <div className={styles.header}>Connect your wallet to swap</div>
        <div className={styles.text}>
          Manage over 120 tokens and multi-chain assets with fully supported
          cross chain transactions.
        </div>
      </div>
    )}
  </div>
  </>
  // </Layout>

  )

}



