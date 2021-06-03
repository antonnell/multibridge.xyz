import React from 'react';
import PropTypes from 'prop-types';

import styles from './messageDisplay.module.scss';

const closeIcon = '/images/closeIcon.svg';

function MessageDisplay({ text, type, show, className, onClose }) {
  if (!show) return null;
  const classes = `${styles.messageDisplay} ${styles[type]} ${className}`;
  return (
    <div className={classes}>
      <div className={styles.text}>{text}</div>
      <div onClick={onClose} onKeyDown={onClose} role="button" tabIndex="0">
        <img src={closeIcon} alt="close message" />
      </div>
    </div>
  );
}
MessageDisplay.propTypes = {
  text: PropTypes.string,
  type: PropTypes.oneOf(['error', 'success']),
  onClose: PropTypes.func,
  show: PropTypes.bool,
  className: PropTypes.string,
};
MessageDisplay.defaultProps = {
  text: null,
  onClose: null,
  type: 'success',
  show: false,
  className: '',
};
export default MessageDisplay;
