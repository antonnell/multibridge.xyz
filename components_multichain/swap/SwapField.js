import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '../common/dialog/Dialog';
import NetworkSelector, {
  NetworkOption,
} from '../networkSelector/NetworkSelector';
import CoinSelector, { CoinOption } from '../coinSelector/CoinSelector';
import SelectionDisplay from '../common/selector/SelectionDisplay';
import styles from './swap.module.scss';
import Tooltip from '../common/tooltip/Tooltip';
import swapCoins from '../../swapCoins';

const coinIconsPath = '/images/coins/';
const networkIconsPath = '/images/networks/';

/**
 * Container component with network, coin selector and amount input field
 */
function SwapField({
  networkOptions,
  coinOptions,
  onChange,
  amountReadOnly,
  value,
  id,
  showTooltip,
}) {
  // TODO: API: Retrieve coin, network options
  // eslint-disable-next-line no-param-reassign
  coinOptions = coinOptions || swapCoins;
  coinOptions.forEach((co) => {
    co.icon = `${coinIconsPath}${co.symbol.toLowerCase()}.svg`;
  });

  // TODO: API Call to get network list
  // eslint-disable-next-line no-param-reassign
  networkOptions = networkOptions || [
    { value: 'ethereum', name: 'Ethereum' },
    { value: 'polygon', name: 'Polygon Network' },
    { value: 'optimism', name: 'Optimism' },
  ];
  networkOptions.forEach((no) => {
    no.icon = `${networkIconsPath}${no.name}.svg`;
  });
  const [networks] = useState(networkOptions);
  const [coins] = useState(coinOptions);
  const [networkSelectorOpen, setNetworkSelectionOpen] = useState(false);
  const [coinSelectorOpen, setCoinSelectorOpen] = useState(false);
  const swapData = value;

  useEffect(() => {
    if (!swapData.coin || !swapData.network) {
      swapData.coin = swapData.coin || coins[0];
      swapData.network = swapData.network || networks[0];
      onChange(swapData);
    }
  }, []);

  const toggleNetworkSelector = () => {
    setNetworkSelectionOpen(!networkSelectorOpen);
  };
  const toggleCoinSelector = () => {
    setCoinSelectorOpen(!coinSelectorOpen);
  };
  const processChange = (newValue) => {
    const newState = { ...swapData, ...newValue };
    onChange(newState);
  };

  const onCoinChange = (coin) => {
    toggleCoinSelector();
    processChange({ coin });
  };
  const onNetworkChange = (network) => {
    toggleNetworkSelector();
    processChange({ network });
  };
  const onAmountChange = ({ target: { value: _amount } }) => {
    let amount = _amount.trim();
    amount = amount === '' ? 0 : parseFloat(amount);
    processChange({ amount });
  };

  const SelectedNetworkDisplay = () => {
    const selectedNetwork =
      networks.find((n) => n.value === swapData.network?.value) || networks[0];
    return (
      <SelectionDisplay
        icon={selectedNetwork?.icon}
        name={selectedNetwork?.name}
        onClick={toggleNetworkSelector}
      />
    );
  };
  const SelectedCoinDisplay = () => {
    const selectedCoin =
      coins.find((n) => n.value === swapData.coin?.value) || coins[0];
    const { name, icon } = selectedCoin;
    return (
      <div className={styles.selectedCoinDisplay}>
        <SelectionDisplay
          name={name}
          icon={icon}
          onClick={toggleCoinSelector}
        />
        {showTooltip && <Tooltip title="Select token to swap" />}
      </div>
    );
  };
  return (
    <div className={styles.swapFieldContainer}>
      <div className={styles.networkHeader}>Network</div>
      <div className={styles.networkAndAmount}>
        <div className={styles.networkAndAmountBlock}>
          <SelectedNetworkDisplay />
          <div className={styles.divider} />
          <input
            type="number"
            name="amount"
            className={styles.amount}
            onChange={onAmountChange}
            value={swapData.amount || ''}
            autoComplete="off"
            readOnly={amountReadOnly}
            aria-label="amount"
          />
        </div>
        {showTooltip && (
          <Tooltip title="Provide token amount you want to transfer" />
        )}
      </div>
      <Dialog
        open={networkSelectorOpen}
        title="Select a Network"
        className={styles.networkSelectorDialog}
        onClose={toggleNetworkSelector}
      >
        <NetworkSelector
          options={networks}
          onChange={onNetworkChange}
          value={swapData.network?.value}
          id={`${id}-networkSelector`}
          menuIsOpen={networkSelectorOpen}
        />
      </Dialog>
      <div className={styles.coinSelectorWrapper}>
        <SelectedCoinDisplay />
        <Dialog
          open={coinSelectorOpen}
          title="Select a Token"
          className={styles.coinSelectorDialog}
          onClose={toggleCoinSelector}
        >
          <div>
            <CoinSelector
              options={coins}
              onChange={onCoinChange}
              value={swapData.coin?.value}
              id={`${id}-coinSelector`}
              menuIsOpen={coinSelectorOpen}
            />
          </div>
        </Dialog>
      </div>
    </div>
  );
}
SwapField.propTypes = {
  networkOptions: PropTypes.arrayOf(NetworkOption),
  coinOptions: PropTypes.arrayOf(CoinOption),
  onChange: PropTypes.func,
  amountReadOnly: PropTypes.bool,
  value: PropTypes.shape({
    coin: CoinOption,
    network: NetworkOption,
    amount: PropTypes.number,
  }),
  id: PropTypes.string,
  showTooltip: PropTypes.bool,
};
SwapField.defaultProps = {
  networkOptions: null,
  coinOptions: null,
  onChange: () => null,
  amountReadOnly: false,
  value: { coin: null, network: null, amount: 0 },
  id: 'swapField',
  showTooltip: false,
};
export default SwapField;
