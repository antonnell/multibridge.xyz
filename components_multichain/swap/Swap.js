import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import SwapField from './SwapField';
import Accordion from '../common/accordion/Accordion';
import Button from '../common/controls/Button';
import SlippageTolerance from './SlippageTolerance';
import GasSettings from './GasSettings';
import SwapLimits from './SwapLimits';
import { feeFormatter } from '../../framework/utils';
import WalletContext from '../../framework/WalletContext';
import WalletConnector from '../wallets/WalletConnector';

import config from '../../config';
import styles from './swap.module.scss';
import MessageDisplay from '../common/messageDisplay/MessageDisplay';
import useBreakpoints from '../../framework/useBreakpoints';

const swapIcon = '/images/swap.svg';
/**
 * Swap - Component with swap fields, tolerance, gas settings
 * @param {*} param0
 * @returns
 */
function Swap({ onSwap }) {
  const { wallet } = useContext(WalletContext);
  const { gasSettingsOptions, slippageTolerance } = config.swap;
  const slippageOptions = slippageTolerance.slippageOptions.map((o) => ({
    value: o,
  }));

  const [showWalletConnector, setShowWalletConnector] = useState(false);
  const [state, setState] = useState({
    from: {
      coin: null,
      network: null,
      amount: 0,
    },
    to: {
      coin: null,
      network: null,
      amount: 0,
    },
    tolerance: {
      value: 0,
      selectedOption: 0,
    },
    gas: null,
    fee: 0.000000011,
  });
  // Success/Error displays
  const [message, setMessage] = useState({
    type: null,
    text: null,
    open: false,
  });
  const swapFields = () => {
    setState({ ...state, from: state.to, to: state.from });
  };

  // TODO: Computation goes here
  const onToleranceChange = ({ value, selectedOption }) => {
    setState({ ...state, tolerance: { value, selectedOption } });
  };

  const onGasSettingsChange = ({ value }) => {
    setState({ ...state, gas: value });
  };
  // TODO: API Fetch limits ( if specific to network/token)
  const limits = {
    maxSwapAmount: 1000.0,
    minSwapAmount: 0.001,
    swapFee: 0.1,
    maxFreeAmount: 90909,
    minFreeAmount: 90,
  };
  const gasSelectedOption = gasSettingsOptions.find(
    (g) => g.value === state.gas
  );
  const items = [
    {
      id: 'ts',
      title: 'Transaction Settings',
      body: (
        <div>
          <SlippageTolerance
            options={slippageOptions}
            onChange={onToleranceChange}
            value={state.tolerance}
            key="inputTolerance"
          />
          <div className={styles.gassSettingsWrapper}>
            <GasSettings
              options={gasSettingsOptions}
              onChange={onGasSettingsChange}
              defaultOption={gasSelectedOption}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'val',
      title: 'Limits',
      body: <SwapLimits {...limits} />,
    },
  ];
  const getOnChangeListener = (fromTo) => {
    function precise(x) {
      return Number.parseFloat(x).toPrecision(6);
    }
    return (value) => {
      // TODO: compute amount in to field. For now it does a 101% computation
      const newState = { ...state, [fromTo]: value };
      newState.to.amount = Number(precise(newState.from.amount * 1.1));
      setState(newState);
    };
  };
  const onSwapClick = () => {
    const { maxSlippage } = config.swap.slippageTolerance;
    if (
      state.from.amount <= 0 ||
      state.from.amount < limits.minSwapAmount ||
      state.from.amount > limits.maxSwapAmount
    ) {
      setMessage({
        type: 'error',
        text: `Swap amount should be between ${limits.minSwapAmount} and ${limits.maxSwapAmount}`,
        show: true,
      });
    } else if (state.tolerance.value > maxSlippage) {
      setMessage({
        type: 'error',
        text: `Slippage tolerance shouldnt exceed ${maxSlippage} %`,
        show: true,
      });
    } else {
      setMessage({ type: null, text: null, show: false });
      onSwap(state);
    }
  };
  const { isMobile } = useBreakpoints();
  const rootClass = classNames(styles.swapContainer, {
    [styles.isMobile]: isMobile,
  });
  return (
    <div className={rootClass}>
      <SwapField
        onChange={getOnChangeListener('from')}
        value={state.from}
        id="swapFrom"
        showTooltip
      />
      <div
        onClick={swapFields}
        onKeyDown={swapFields}
        role="button"
        tabIndex="0"
      >
        <img
          src={swapIcon}
          className={styles.swapIcon}
          alt="Swap From and To"
        />
      </div>
      <SwapField
        onChange={getOnChangeListener('to')}
        value={state.to}
        amountReadOnly
        id="swapTo"
      />
      <div className={styles.estimatedFee}>
        <div>Est. Fee Amount</div>
        <div className={styles.feeAmount}>{feeFormatter(state.fee)}</div>
      </div>
      <div className={styles.accordionWrapper}>
        <Accordion items={items} />
      </div>

      <Button
        type="submit"
        onClick={() => (wallet ? onSwapClick() : setShowWalletConnector(true))}
      >
        {wallet ? 'Swap' : 'Connect wallet'}
      </Button>

      <WalletConnector
        open={showWalletConnector}
        onClose={() => setShowWalletConnector(false)}
      />
      <MessageDisplay
        text={message.text}
        type={message.type}
        show={message.show}
        onClose={() => setMessage({ ...message, show: false })}
        className={styles.swapMessageDisplay}
      />
    </div>
  );
}
Swap.propTypes = {
  onSwap: PropTypes.func,
};
Swap.defaultProps = {
  onSwap: () => null,
};
export default Swap;
