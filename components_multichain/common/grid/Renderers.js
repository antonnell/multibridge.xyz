import React from 'react';

import ImageTextCell from '../imagetextcell/ImageTextCell';
import { formatAddress, timeFromNow } from '../../../framework/utils';
import styles from './grid.module.scss';
import config from '../../../config';

const okIcon = '/images/okIcon.svg';
const errorIcon = '/images/errorIcon.svg';

export const chainRenderer = ({ value: { icon, text } }) => (
  <ImageTextCell icon={icon} title={text} />
);
export const contractRenderer = ({ value }) =>
  formatAddress(value, config.contractFormat);
export const statusRenderer = ({ value }) => (
  <img
    className={styles.status}
    src={value ? okIcon : errorIcon}
    alt={value ? 'OK' : 'Error'}
  />
);
export const addressRenderer = ({ value: { network, coinIcon, address } }) => (
  <ImageTextCell
    icon={coinIcon}
    title={network}
    subtitle={formatAddress(address)}
  />
);
export const timeRenderer = ({ value }) => (
  <div className={styles.time}>{timeFromNow(value)}</div>
);

export const sentCellRenderer = ({
  value: { icon, sentAmount, receivedAmount },
}) => {
  const title = `Sent: ${sentAmount}`;
  const subtitle = `Received: ${receivedAmount}`;
  return <ImageTextCell icon={icon} title={title} subtitle={subtitle} />;
};
