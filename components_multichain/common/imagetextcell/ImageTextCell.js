import React from 'react';
import PropTypes from 'prop-types';

import styles from './imageTextCell.module.scss';

/**
 * Renders image and text in a cell
 */
function ImageTextCell({ icon, title, subtitle }) {
  return (
    <div className={styles.imageTextCell}>
      <img src={icon} className={styles.img} alt="icon" />
      <div className={styles.text}>
        <div className={styles.title}>{title}</div>
        <div className={styles.subtitle}>{subtitle}</div>
      </div>
    </div>
  );
}
ImageTextCell.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  title: PropTypes.string,
  subtitle: PropTypes.string,
};
ImageTextCell.defaultProps = {
  icon: null,
  title: '',
  subtitle: '',
};
export default ImageTextCell;
