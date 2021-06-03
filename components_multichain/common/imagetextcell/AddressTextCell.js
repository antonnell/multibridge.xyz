import React from 'react';
import PropTypes from 'prop-types';

import styles from './imageTextCell.module.scss';
import { formatAddress } from '../../../utils';

/**
 * Renders image and text in a cell
 */
function AddressTextCell({ icon, title, subtitle }) {
  return (
    <div className={styles.imageTextCell}>
      <img src={`/blockchains/${icon}`} className={styles.img} alt="icon" />
      <div className={styles.text}>
        <div className={styles.title}>{title}</div>
        <div className={styles.subtitle}>
          {formatAddress(subtitle, 'medium')}
        </div>
      </div>
    </div>
  );
}
AddressTextCell.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  title: PropTypes.string,
  subtitle: PropTypes.string,
};
AddressTextCell.defaultProps = {
  icon: null,
  title: '',
  subtitle: '',
};
export default AddressTextCell;
