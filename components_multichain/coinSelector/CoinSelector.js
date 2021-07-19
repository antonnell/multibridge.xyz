/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Selector from '../common/selector/Selector';
import styles from './coinSelector.module.scss';
/**
 * Displays coin/token selector with search capability
 */
function CoinSelector({
  options,
  defaultIndex,
  onChange,
  value,
  id,
  menuIsOpen,
}) {
  // TODO: API: Retrieve coins, when not sent
  let [coins] = useState(options);
  const getFormattedCurrency = (currency) =>
    currency.toLocaleString(undefined, {
      minimumFractionDigits: 2,
    });

  const menuItem = (icon, name, balance, currencyValue) => (
    <div className={styles.coinOptions}>
      <img className={styles.img} src={icon} alt="" />
      <div className={styles.name}>{name}</div>
      <div className={styles.balance}>
        {balance.toLocaleString(undefined, {
          minimumFractionDigits: 0,
        })}
      </div>

      <div className={styles.currencyValue}>
        <div className={styles.currency}>$</div>
        <div>{getFormattedCurrency(currencyValue)}</div>
      </div>
    </div>
  );

  const formatOptionLabel = (
    { name, icon, balance, currencyValue },
    { context }
  ) => {
    if (context === 'menu') {
      return menuItem(icon, name, balance, currencyValue);
    }
    return null;
  };
  const menuListHeader = (
    <div className={styles.menuListHeader}>
      <div className={styles.name}>Coin</div>
      <div className={styles.balance}>Balance</div>
      <div className={styles.currencyValue}>Value</div>
    </div>
  );

  // When value is sent use the same, else use defaultIndex
  let selectedIndex = defaultIndex;
  if (value) {
    // eslint-disable-next-line react/prop-types
    selectedIndex = options.findIndex((o) => o.value === value);
  }
  coins = coins.sort((a, b) => (a.name > b.name ? 1 : -1));
  return (
    <div className={styles.coinSelector}>
      <Selector
        options={coins}
        formatOptionLabel={formatOptionLabel}
        selectedIndex={selectedIndex}
        onChange={onChange}
        id={id}
        selectProps={{ menuIsOpen }}
        menuListHeader={menuListHeader}
      />
    </div>
  );
}
export const CoinOption = PropTypes.shape({
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  icon: PropTypes.string,
  balance: PropTypes.number,
  currencyValue: PropTypes.number,
});
CoinSelector.propTypes = {
  options: PropTypes.arrayOf(CoinOption),
  defaultIndex: PropTypes.number,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  id: PropTypes.string,
  menuIsOpen: PropTypes.bool,
};
CoinSelector.defaultProps = {
  options: [],
  defaultIndex: 0,
  value: null,
  onChange: () => null,
  id: 'coinSelector',
  menuIsOpen: false,
};

export default CoinSelector;
