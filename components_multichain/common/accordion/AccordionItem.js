import React from 'react';
import PropTypes from 'prop-types';
import styles from './accordion.module.scss';
/**
 * Child component for Accordion.
 * Note: This is granular component, intended to use only with Accordion.
s * @returns
 */
const AccordionItem = ({ item, isActive, onClick }) => {
  const clickHandler = () => onClick(item);
  return (
    <div className={styles.accordionItem}>
      <div
        role="button"
        onClick={clickHandler}
        onKeyDown={clickHandler}
        className={styles.accordionTrigger}
        tabIndex="0"
      >
        {item.title}
        <div
          className={`${styles.accordionIcon} ${isActive && styles.isActive}`}
        >
          <img src="/images/downChevron.svg" alt="Toggle item" />
        </div>
      </div>
      <div
        className={`${styles.accordionContent} ${isActive && styles.isActive}`}
      >
        <div className={styles.itemBody}>{item.body}</div>
      </div>
    </div>
  );
};
AccordionItem.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string,
    body: PropTypes.node,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
export default AccordionItem;
