import React from 'react';
import PropTypes from 'prop-types';
import styles from './controls.module.scss';

/**
 * Renders Primary/Secondary Buttion with optional icon
 */
function Button(props) {
  const { icon, variant, children, className, ...otherProps } = props;

  return (
    <button
      type="button"
      className={`${styles.iconButton} ${styles[variant]} ${className || ''}`}
      {...otherProps}
    >
      {icon && <img src={icon} alt="icon" />}
      {children}
    </button>
  );
}
Button.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary']),
  className: PropTypes.string,
};
Button.defaultProps = {
  children: null,
  variant: 'primary',
  icon: null,
  className: null,
};
export default Button;
