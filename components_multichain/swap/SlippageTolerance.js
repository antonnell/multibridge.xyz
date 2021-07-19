import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import styles from './swap.module.scss';
import config from '../../config';

const infoIcon = '/images/information-circle.svg';
/**
 * Provides options to choose/enter Slippage Tolerance
 */
function SlippageTolerance({
  options,
  onChange,
  value: { value, selectedOption },
}) {
  const { maxSlippage } = config.swap.slippageTolerance;

  const state = {
    value,
    selectedOption,
  };
  if (selectedOption >= 0) state.value = options[selectedOption].value;

  const textInputClasses = classNames(styles.toleranceInput, {
    [styles.selected]: state.selectedOption < 0,
  });

  const inputValue = state.selectedOption >= 0 ? '' : state.value;
  // User focussed on textbox/changed text
  const onToleranceChange = (e) => {
    const tolerance = parseFloat(e.target.value);

    onChange({
      value: Number.isNaN(tolerance) ? null : tolerance,
      selectedOption: -1,
    });
  };
  return (
    <div className={styles.slippageTolerance}>
      <div className={styles.settingsHeader}>
        <div className={styles.settingsTitle}>Slippage tolerance</div>
        <div>
          <img src={infoIcon} className={styles.img} alt="info" />
        </div>
      </div>
      <div className={styles.toleranceContainer}>
        {options.map((option, idx) => {
          const classes = classNames(styles.toleranceOption, {
            [styles.selected]: idx === state.selectedOption,
          });
          const optionClick = () =>
            onChange({ ...option, selectedOption: idx });
          return (
            <div
              className={classes}
              key={option.value}
              onClick={optionClick}
              onKeyDown={optionClick}
              tabIndex="0"
              role="button"
            >{`${option.value}%`}</div>
          );
        })}
        <div className={textInputClasses}>
          <input
            type="number"
            onChange={onToleranceChange}
            value={inputValue}
            name="toleranceInput"
            min={0}
            max={maxSlippage}
            step="any"
          />
          <span>%</span>
        </div>
      </div>
    </div>
  );
}
export const SlippageOption = PropTypes.shape({
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
});
SlippageTolerance.propTypes = {
  options: PropTypes.arrayOf(SlippageOption),
  onChange: PropTypes.func.isRequired,
  value: PropTypes.shape({
    value: PropTypes.number,
    selectedOption: PropTypes.number,
  }),
};
SlippageTolerance.defaultProps = {
  options: [],
  value: {
    value: null,
    selectedOption: 0,
  },
};
export default SlippageTolerance;
