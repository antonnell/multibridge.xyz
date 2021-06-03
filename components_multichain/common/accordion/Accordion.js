import React, { useState } from 'react';
import PropTypes from 'prop-types';

import AccordionItem from './AccordionItem';
import styles from './accordion.module.scss';
/**
 * Display array of items.
 * Handles expand, collapse with animation
 */
function Accordion({ items }) {
  /* eslint-disable react/prop-types */

  if (!items || items.length === 0) return null;
  const [activeId, setActiveId] = useState(-1);
  const toggleOnClick = (item) => {
    if (item.id === activeId) setActiveId(-1);
    // user collapsing
    else setActiveId(item.id); // user clicked other item
  };
  return (
    <div className={styles.accordion}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          item={item}
          onClick={toggleOnClick}
          isActive={activeId === item.id}
        />
      ))}
    </div>
  );
}
Accordion.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string,
      body: PropTypes.node,
    })
  ),
};
Accordion.defaultProps = {
  items: [],
};

export default Accordion;
