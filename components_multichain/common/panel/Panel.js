import React from 'react';
import PropTypes from 'prop-types';

import styles from './panel.module.scss';
/**
 * Container Component, showing children in a panel
 */
function Panel({ children, classNames }) {
  const rootClass = classNames ? `${styles.panel} ${classNames}` : styles.panel;
  return <div className={rootClass}>{children}</div>;
}
Panel.propTypes = {
  children: PropTypes.node,
  classNames: PropTypes.string,
};
Panel.defaultProps = {
  children: null,
  classNames: null,
};
export default Panel;
