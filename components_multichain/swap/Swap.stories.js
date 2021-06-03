import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import Swap from './Swap';
import Panel from '../common/panel/Panel';
import WalletContext from '../../framework/WalletContext';

export default {
  title: 'Swap/Swap',
  component: Swap,
  // default args
  args: {},
};

const Template = (args) => {
  const [value, setValue] = useState(args.value ?? null);
  return (
    <>
      <Swap
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

export const SwapInsidePanel = () => (
  <Panel>
    <Swap />
  </Panel>
);
export const SwapWithWalletConnected = () => (
  <WalletContext.Provider value={{ wallet: 'x' }}>
    <Swap />
  </WalletContext.Provider>
);
