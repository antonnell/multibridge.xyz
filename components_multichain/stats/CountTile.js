import React from 'react';
import PropTypes from 'prop-types';
import useBreakpoints from '../../framework/useBreakpoints';

import styles from './stats.module.scss';

/**
 * Renders Count Tile with title and subtitle text
 */
function CountTile({ title, subtitle, subtitleOnClick }) {
  const subtitleClass = subtitleOnClick ? styles.subtitleLink : styles.subtitle;
  const { isMobile } = useBreakpoints();
  return (
    <div className={`${styles.countTile} ${isMobile ? styles.isMobile : ''}`}>
      <div className={styles.title}>{title}</div>
      <div className={subtitleClass}>{subtitle}</div>
    </div>
  );
}
CountTile.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
  subtitleOnClick: PropTypes.func,
};
CountTile.defaultProps = {
  subtitle: null,
  subtitleOnClick: null,
};
export default CountTile;
