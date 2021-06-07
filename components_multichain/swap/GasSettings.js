import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './swap.module.scss';
/**
 * Renders Gas Settings to choose
 */
function GasSettings({ options, defaultOption, onChange }) {
  // Selected Option Index. When sent use the same, else default to first item
  const [selection, setSelection] = useState(
    defaultOption
      ? options.findIndex((o) => o.value === defaultOption.value)
      : 0
  );
  return (
    <div className="gasSettings">
      <div className={styles.settingsHeader}>
        <div className={styles.settingsTitle}>Select gas settings</div>
      </div>
      <div className={styles.settingsContainer}>
        {options.map((option, idx) => {
          const classes = classNames(styles.gasSettingOption, {
            [styles.selected]: idx === selection,
          });
          const optionClick = () => {
            setSelection(idx);
            onChange(option);
          };
          return (
            <div
              role="button"
              key={option.value}
              className={classes}
              onClick={optionClick}
              onKeyDown={optionClick}
              tabIndex="0"
            >
              <div className={styles.gasSettingName}>{option.name}</div>
              <div
                className={styles.gasSettingDescription}
              >{`${option.description}%`}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
const gasSettingOptionPropType = PropTypes.shape({
  name: PropTypes.string,
  description: PropTypes.string,
  value: PropTypes.string,
});
GasSettings.propTypes = {
  options: PropTypes.arrayOf(gasSettingOptionPropType),
  defaultOption: gasSettingOptionPropType,
  onChange: PropTypes.func,
};
GasSettings.defaultProps = {
  options: [],
  defaultOption: null,
  onChange: () => null,
};
export default GasSettings;
