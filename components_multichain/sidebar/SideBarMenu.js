import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import PropTypes from 'prop-types';

import SideBarMenuItem from './SideBarMenuItem';
import styles from './sideBar.module.scss';

const iconPath = '/images/sidebar/';

/**
 * Renders array of side bar menu items
 * @param {*} param0
 * @returns
 */
function SideBarMenu({ menuItems, onSelect }) {
  const getIcons = (id) => ({
    icon: `${iconPath}${id}.svg`,
    iconSelected: `${iconPath}${id}-selected.svg`,
  });
  const router = useRouter();
  const items = menuItems || [
    {
      text: 'swap',
      id: 'swap',
      href: '/',
    },
    {
      text: 'explorer',
      id: 'explorer',
      href: '/explorer',
    },
    {
      text: 'tokens',
      id: 'tokens',
      href: '/tokens',
    },
    {
      text: 'stats',
      id: 'stats',
      href: '/stats',
    },
  ];
  // add icon properties
  items.forEach((item) => {
    Object.assign(item, getIcons(item.id));
    item.onClick = () => {
      router.push(item.href);
      // Notify parent on menu selection, so as to hide menu
      onSelect(item.id);
    };
  });
  return (
    <div className={styles.sideBarMenu}>
      {items.map((item) => {
        item.selected = router.asPath === item.href;
        return (
          <div key={item.id} className={styles.sideBarMenuItemWrapper}>
            <SideBarMenuItem {...item} />
          </div>
        );
      })}
    </div>
  );
}
SideBarMenu.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      id: PropTypes.string,
      icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      iconSelected: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      href: PropTypes.string,
    })
  ),
  onSelect: PropTypes.func,
};
SideBarMenu.defaultProps = {
  menuItems: null,
  onSelect: null,
};
export default SideBarMenu;
