import React from 'react';
import PropTypes from 'prop-types';
import { ellipsify } from '../../../framework/utils';
import styles from './selector.module.scss';

const DownIcon = '/images/downChevron.svg';

/**
 * Default rendering of selection with icon , text and drop down icon
 */
function SelectionDisplay({ icon, name, onClick }) {
  return (
    <div
      className={styles.selectionDisplay}
      onClick={onClick}
      onKeyDown={onClick}
      role="button"
      tabIndex="0"
    >
      <img alt="" src={icon} className={styles.icon} />
      <div className={styles.name}>{ellipsify(name, 10)}</div>
      <img src={DownIcon} alt="Change Coin" className={styles.downIcon} />
    </div>
  );
}
SelectionDisplay.propTypes = {
  icon: PropTypes.string,
  name: PropTypes.string,
  onClick: PropTypes.func,
};
SelectionDisplay.defaultProps = {
  icon: null,
  name: null,
  onClick: null,
};
export default SelectionDisplay;
