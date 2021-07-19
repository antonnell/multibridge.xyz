/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import Select, { components } from 'react-select';

import styles from './selector.module.scss';

const SearchIcon = '/images/searchIcon.svg';

const Input = (props) => (
  // eslint-disable-next-line react/prop-types
  <div className={styles.selectorInput}>
    <img src={SearchIcon} className={styles.searchImg} alt="search" />
    <components.Input {...props} />
  </div>
);

/**
 * Extension of react-select component
 * Ref: https://github.com/JedWatson/react-select
 */
function Selector({
  options,
  onChange,
  selectedIndex,
  formatOptionLabel,
  id, // Required: Refer: https://github.com/JedWatson/react-select/issues/2629
  components: overrideComponents,
  selectProps,
  menuListHeader,
}) {
  const MenuList = (props) => {
    // eslint-disable-next-line react/prop-types
    const { children } = props;

    return (
      <components.MenuList {...props}>
        {menuListHeader}
        {children}
      </components.MenuList>
    );
  };
  const customComponents = {
    DropdownIndicator: () => null,
    IndicatorSeparator: () => null,
    MenuList,
    Input,
    ...overrideComponents,
  };
  return (
    <Select
      className={styles.selector}
      instanceId={`${id}-instance`}
      id={id}
      inputId={`${id}-input`}
      options={options}
      formatOptionLabel={formatOptionLabel}
      components={customComponents} // remove indicator separator
      onChange={onChange}
      value={selectedIndex >= 0 ? options[selectedIndex] : null}
      classNamePrefix="selector"
      placeholder=""
      {...selectProps}
    />
  );
}
Selector.propTypes = {
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  onChange: PropTypes.func,
  formatOptionLabel: PropTypes.func,
  selectedIndex: PropTypes.number,
  id: PropTypes.string.isRequired,
  components: PropTypes.object,
  selectProps: PropTypes.object,
  menuListHeader: PropTypes.node,
};
Selector.defaultProps = {
  formatOptionLabel: null,
  selectedIndex: -1,
  components: {},
  selectProps: {},
  onChange: () => null,
  menuListHeader: null,
};
export default Selector;
