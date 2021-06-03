import React from 'react';
import PropTypes from 'prop-types';

import styles from './swap.module.scss';

const infoIcon = '/images/information-circle.svg';

/**
 * Renders array of swap limits - such as min,max swap amount
 */
export default function SwapLimits({
  maxSwapAmount,
  minSwapAmount,
  swapFee,
  maxFreeAmount,
  minFreeAmount,
}) {
  const amounts = [
    maxSwapAmount,
    minSwapAmount,
    swapFee,
    maxFreeAmount,
    minFreeAmount,
  ];
  const labels = [
    'Max Swap Amount',
    'Min Swap Amount',
    'Swap Fee',
    'Max Fee Amount',
    'Min Fee Amount',
  ];
  return (
    <div className={styles.swapLimits}>
      {labels.map((label, idx) => (
        <div className={styles.limitItem} key={label}>
          <div className={styles.limitName}>{label}</div>
          <div className={styles.limitAmount}>{amounts[idx]}</div>
        </div>
      ))}
      <div className={styles.limitNote}>
        <img src={infoIcon} className={styles.img} alt="info" />
        <span>Deposits larger than 0.0000000 could take up to 12 hours</span>
      </div>
    </div>
  );
}

SwapLimits.propTypes = {
  maxSwapAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  minSwapAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  swapFee: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  maxFreeAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  minFreeAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};
