import React from 'react';
import PropTypes from 'prop-types';

import styles from './imageTextCell.module.scss';
import { formatAddress } from '../../../utils';

/**
 * Renders image and text in a cell
 */// 



 const addressClicked = (row, direction) => {
  if(direction === 'from') {
    window.open(`${row.fromChain.explorer}/tx/${row.txid}`, '_blank')
  } else {
    window.open(`${row.toChain.explorer}/tx/${row.swaptx}`, '_blank')
  }
}
 function AddressTextCell({ icon, title, subtitle , row, coldef}) {
    console.log(coldef);
  return (
       <div className={styles.imageTextCell} onClick={ () => { addressClicked(row, coldef) }} >
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
