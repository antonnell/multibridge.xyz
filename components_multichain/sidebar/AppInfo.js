import React from 'react';
import PropTypes from 'prop-types';

import config from '../../config';
import styles from './sideBar.module.scss';
/**
 * Display App info such as Version, Locked Value etc
 */
function AppInfo({ lockedValue, version }) {
  const { versionName } = config.appInfo;
  const lockedValueFormatted = lockedValue.toLocaleString(undefined, {
    minimumFractionDigits: 0,
  });
  return (
    <div className={styles.appInfo}>
      <div>{`$ ${lockedValueFormatted} Locked`}</div>
      <div>{versionName}</div>
      <div>{`Version ${version}`}</div>
    </div>
  );
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
