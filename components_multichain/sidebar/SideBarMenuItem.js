import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './sideBar.module.scss';

/**
 * SideBar Navigation Item
 * @param {*} param0
 * @returns
 */
function SideBarMenuItem({ selected, icon, iconSelected, text, onClick }) {
  // selected:True: sideBarNavItem, selected
  // selected:false: sideBarNavItem
  const root = classNames(styles.sideBarMenuItem, {
    [styles.selected]: selected,
  });
  const props = { onClick };
  return (
    <div className={root} {...props}>
      <div className={styles.icon}>
        <img
          src={selected ? iconSelected : icon}
          className={styles.img}
          alt={selected ? 'Menu Selected' : ''}
        />
      </div>
      <div className={styles.text}>{text}</div>
    </div>
  );
}
SideBarMenuItem.propTypes = {
  selected: PropTypes.bool,
  icon: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.element,
    PropTypes.object,
    PropTypes.string,
  ]),
  iconSelected: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.element,
    PropTypes.object,
    PropTypes.string,
  ]),
  text: PropTypes.string,
  onClick: PropTypes.func,
};
SideBarMenuItem.defaultProps = {
  selected: false,
  icon: null,
  iconSelected: null,
  text: null,
  onClick: null,
};

export default SideBarMenuItem;
