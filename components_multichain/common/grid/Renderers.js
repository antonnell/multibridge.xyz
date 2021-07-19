import React from 'react';

import BigNumber from 'bignumber.js';
import * as moment from 'moment';
import ImageTextCell from '../imagetextcell/ImageTextCell';
import AddressTextCell from '../imagetextcell/AddressTextCell';

import { formatAddress } from '../../../framework/utils';
import styles from './grid.module.scss';
import config from '../../../config';
import { formatCurrency } from '../../../utils';

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
export const addressRenderer = (v) => {
   console.log(v);
  var value = {
    coinIcon: v.value.coinIcon,
    title: v.value.network,
    subtitle: v.value.address
  };
var row = {
  ...v.data
}
var coldef = v.colDef.field;
// console.log(value , row)
 return(<AddressTextCell icon={value.coinIcon} title={value.title} subtitle={value.subtitle} row={row} coldef={coldef} />)
};
export const timeRenderer = ({ value }) => (
  <div className={styles.time}>{moment(value * 1000).fromNow()}</div>
);

export const sentCellRenderer = ({
  value: { value, tokenMetadata, swapvalue },
}) => {
  // const title = `Sent: ${sentAmount}`;
  // const subtitle = `Received: ${receivedAmount}`;
  const iconImg = tokenMetadata
    ? tokenMetadata.icon
    : '/tokens/unknown-logo.png';

  const titleTxt = `${formatCurrency(
    BigNumber(value)
      .div(10 ** (tokenMetadata ? tokenMetadata.decimals : 18))
      .toNumber()
  )} ${tokenMetadata ? tokenMetadata.symbol : ''}`;

  const subtitle = `${formatCurrency(
    BigNumber(swapvalue)
      .div(10 ** (tokenMetadata ? tokenMetadata.decimals : 18))
      .toNumber()
  )} ${tokenMetadata ? tokenMetadata.symbol : ''}`;
  console.log(value, titleTxt, subtitle);

  return <ImageTextCell icon={iconImg} title={titleTxt} subtitle={subtitle} />;
};
