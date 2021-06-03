import React from 'react';
import PropTypes from 'prop-types';
import useBreakpoints from '../../framework/useBreakpoints';

import config from '../../config';
import styles from './stats.module.scss';

/**
 * Displays Locked Value
 */
function LockedValueTile({ value }) {
  const { textBlocks } = config.lockedValueTile;
  const formattedValue = value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
  });
  const { isMobile } = useBreakpoints();
  return (
    <div
      className={`${styles.lockedValueDisplayTile} ${
        isMobile ? styles.isMobile : ''
      }`}
    >
      <div className={styles.lockedValueBlock}>
        <div className={styles.lockedValue}>{formattedValue}</div>
        <div className={styles.lockedValueText}>Total Value Locked</div>
      </div>
      {!isMobile &&
        textBlocks.map((block) => (
          <div key={block.title} className={styles.lockedValueInfoBlock}>
            <div className={styles.divider} />
            <div className={styles.textBlock}>
              <div className={styles.title}>{block.title}</div>
              <div className={styles.subtitle}>{block.subtitle}</div>
            </div>
          </div>
        ))}
    </div>
  );
}
LockedValueTile.propTypes = {
  value: PropTypes.number.isRequired,
};
export default LockedValueTile;
