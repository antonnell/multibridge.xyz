import React, { useState,useEffect } from 'react';
import LockedValueTile from '../../components_multichain/stats/LockedValueTile';
import CountTile from '../../components_multichain/stats/CountTile';
import styles from '../../styles/layout.module.scss';

import stores from '../../stores'
import {
  ERROR,
  GET_BRIDGE_INFO,
  BRIDGE_INFO_RETURNED,
} from '../../stores/constants'
import { formatCurrency } from '../../utils'

export default function StatsMain() {
 


  const [ totalLocked, setTotalLocked ] = useState(null)
  const [ bridgedAssets, setBridgedAssets ] = useState(null)
  const [ blockchains, setBlockchains ] = useState(null)
  const [ nodes, setNodes ] = useState(null)

  useEffect(function() {
    const bridgeInfoReturned = (history) => {
      setTotalLocked(stores.swapStore.getStore('totalLocked'))
      setBridgedAssets(stores.swapStore.getStore('bridgedAssets'))
      setBlockchains(stores.swapStore.getStore('bridgeBlockchains'))
      setNodes(stores.swapStore.getStore('nodes'))
    }

    stores.emitter.on(BRIDGE_INFO_RETURNED, bridgeInfoReturned)
    stores.dispatcher.dispatch({ type: GET_BRIDGE_INFO })

    return () => {
      stores.emitter.removeListener(BRIDGE_INFO_RETURNED, bridgeInfoReturned)
    }
  },[]);

  const onNavigateChains = () => {
    router.push('/stats/chains')
  }

  const onNavigateAssets = () => {
    router.push('/stats/assets')
  }
     // TODO: API: Get from data source
     const [data] = useState({
        lockedValue: ""+formatCurrency(totalLocked),
        nodes: nodes,
        chains: blockchains,
        tokens: bridgedAssets,
      });
console.log('data', data)
if(nodes !== null && blockchains !== null && bridgedAssets !== null){
  return (
    <div className={styles.statsPage}>
      <LockedValueTile value={formatCurrency(totalLocked)} />
      <div className={styles.countBlock}>
        <CountTile title={nodes} subtitle="Nodes securing the network" />
        <CountTile
          title={blockchains}
          subtitle="Chains connected via the bridge"
        />
        <CountTile
          title={bridgedAssets}
          subtitle="Tokens supported"
          subtitleOnClick={() => {}}
        />
      </div>
    </div>
  );
}else{
    return null
}
}
