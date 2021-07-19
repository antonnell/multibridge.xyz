import React from 'react';
import PropTypes from 'prop-types';
import Selector from '../common/selector/Selector';

import styles from './networkSelector.module.scss';
/**
 * Display list of networks to choose, with search option
 */

function NetworkSelector({
  options,
  onChange,
  defaultIndex,
  value,
  id,
  menuIsOpen,
}) {
  // Refer https://react-select.com/props
  // for styling needs
  const formatOptionLabel = ({ name, icon }, { context }) => {
    // Only for the menu display, we render. For selected value display parent needs to take care
    if (context === 'menu') {
      return (
        <div className={styles.option}>
          <img className={styles.img} src={icon} alt="" />
          <div className={styles.label}>{name}</div>
        </div>
      );
    }
    return null;
  };
  const selectedIndex = value
    ? options.findIndex((o) => o.value === value)
    : defaultIndex;
  return (
    <div className={styles.networkSelector}>
      <Selector
        options={options}
        formatOptionLabel={formatOptionLabel}
        onChange={onChange}
        selectedIndex={selectedIndex}
        id={id}
        selectProps={{ menuIsOpen }}
      />
    </div>
  );
}
export const NetworkOption = PropTypes.shape({
  name: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  value: PropTypes.string,
});
NetworkSelector.propTypes = {
  options: PropTypes.arrayOf(NetworkOption),
  onChange: PropTypes.func,
  defaultIndex: PropTypes.number,
  value: PropTypes.string,
  id: PropTypes.string,
  menuIsOpen: PropTypes.bool,
};
NetworkSelector.defaultProps = {
  options: [],
  value: null,
  defaultIndex: 0,
  menuIsOpen: false,
  onChange: () => {},
  id: 'NetworkSelector',
};
export default NetworkSelector;
