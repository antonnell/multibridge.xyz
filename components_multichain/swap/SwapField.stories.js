import React, { useState } from 'react';
import SwapField from './SwapField';

const icon = './images/coins/MTLX.svg';

const coinOptions = [
  {
    value: 'FTM',
    name: 'FTM',
    symbol: 'FTM',
    balance: 100.0,
    currencyValue: 1000000.0,
  },
  {
    value: 'DAI',
    name: 'DAI',
    symbol: 'DAI',
    balance: 0.0001,
    currencyValue: 1000000.0,
  },
  {
    value: 'MTLX',
    name: 'MTLX',
    symbol: 'MTLX',
    balance: 10000.0,
    currencyValue: 1000000.0,
  },
];
export default {
  title: 'Swap/SwapField',
  component: SwapField,
  // default args
  args: { coinOptions },
  argTypes: { onChange: { action: 'onChange' } },
};

const Template = (args) => {
  const [value, setValue] = useState(args.value ?? null);
  return (
    <>
      <SwapField
        {...args}
        onChange={(params) => {
          args.onChange(params);
          setValue(params);
        }}
        value={value}
      />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};

export const AmountReadOnly = Template.bind({});
AmountReadOnly.args = {
  amountReadOnly: true,
  value: { coin: null, network: null, amount: 567 },
};

export const ShowingTooltip = Template.bind({});
ShowingTooltip.args = {
  amountReadOnly: false,
  showTooltip: true,
  value: { coin: null, network: null, amount: 567 },
};
