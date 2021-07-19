import React from 'react';
import PropTypes from 'prop-types';
import MaterialUITooltip from '@material-ui/core/Tooltip';
import styles from './tooltip.module.scss';

const icons = {
  help: '/images/questionIcon.svg',
  info: '/images/information-circle.svg',
};

/**
 * Renders tooltip using material-ui tool tip
 * Supports help and info tooltips
 */
function Tooltip({ title, type, placement }) {
  const icon = icons[type];
  return (
    // Assign id for styling purpose
    <MaterialUITooltip
      title={title}
      id="tooltip"
      placement={placement}
      classes={{ popper: styles.tooltip, tooltip: styles.tooltipText }}
    >
      <img src={icon} className={styles.tooltipIcon} alt={type} />
    </MaterialUITooltip>
  );
}
Tooltip.propTypes = {
  title: PropTypes.string,
  type: PropTypes.oneOf(['help', 'info']),
  placement: PropTypes.oneOf([
    'right-end',
    'right-start',
    'right',
    'top-end',
    'top-start',
    'top',
  ]),
};
Tooltip.defaultProps = {
  title: null,
  type: 'help',
  placement: 'right-start',
};
export default Tooltip;
