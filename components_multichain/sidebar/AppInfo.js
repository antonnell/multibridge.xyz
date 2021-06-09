import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';

import config from '../../config';
import styles from './sideBar.module.scss';
import stores from '../../stores'
import {
  ERROR,
  GET_BRIDGE_INFO,
  BRIDGE_INFO_RETURNED,
} from '../../stores/constants'
import { formatCurrency } from '../../utils'
/**
 * Display App info such as Version, Locked Value etc
 */
function AppInfo({ lockedValue, version }) {
  const [ totalLocked, setTotalLocked ] = useState(null)

  useEffect(function() {
    const bridgeInfoReturned = (history) => {
      setTotalLocked(stores.swapStore.getStore('totalLocked'))

    }

    stores.emitter.on(BRIDGE_INFO_RETURNED, bridgeInfoReturned)
    stores.dispatcher.dispatch({ type: GET_BRIDGE_INFO })

    return () => {
      stores.emitter.removeListener(BRIDGE_INFO_RETURNED, bridgeInfoReturned)
    }
  },[]);

  const { versionName } = config.appInfo;

  const lockedValueFormatted = formatCurrency(totalLocked);
  if(totalLocked !== null){
  return (
    <div className={styles.appInfo}>
      <div>{`$ ${lockedValueFormatted} Locked`}</div>
      <div>{versionName}</div>
      <div>{`Version ${version}`}</div>
    </div>
  );
  }else {
    return null
  }
}
AppInfo.propTypes = {
  lockedValue: PropTypes.number,
  version: PropTypes.string,
};
AppInfo.defaultProps = {
  lockedValue: 48194823.39,
  version: process.env.NEXT_PUBLIC_APP_VERSION,
};
export default AppInfo;
