import React, { useState } from 'react';
import CoinSelector from './CoinSelector';
const icon = '/images/coins/MTLX.svg';

export default {
  title: 'Swap/CoinSelector',
  component: CoinSelector,
  // default args
  args: {
    menuIsOpen: true,
    options: [
      {
        value: 'FTM',
        name: 'FTM',
        symbol: 'FTM',
        balance: 100,
        currencyValue: 12345,
      },
      {
        value: 'DAI',
        name: 'DAI',
        symbol: 'DAI',
        balance: 100,
        currencyValue: 12345,
      },
      {
        value: 'MTLX',
        name: 'MTLX',
        symbol: 'MTLX',
        balance: 100,
        currencyValue: 123.45,
      },
    ],
  },
  argTypes: { onChange: { action: 'onChange' } },
};
const Template = (args) => {
  const [value, setValue] = useState(args.value ?? null);
  return (
    <div style={{ height: '200px' }}>
      <CoinSelector
        {...args}
        onChange={(params) => {
          args.onChange(params);
          setValue(params.value);
        }}
        value={value}
      />
      <pre style={{ marginTop: 10 }}>{JSON.stringify({ value }, null, 2)}</pre>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = { value: 'MTLX' };
