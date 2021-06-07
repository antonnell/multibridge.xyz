import React, { useState } from 'react';
import PropTypes from 'prop-types';
import NetworkSelector from './NetworkSelector';
const polygonIcon = '/images/networks/Ethereum.svg';

const options = [
  { value: 'polygon', name: 'Polygon Network', icon: polygonIcon },
  { value: 'Quorum', name: 'Quorum', icon: polygonIcon, icon: polygonIcon },
  { value: 'Easyfi', name: 'Easyfi', icon: polygonIcon, icon: polygonIcon },
];
export default {
  title: 'Swap/NetworkSelector',
  component: NetworkSelector,
  // default args
  args: { options, defaultIndex: -1 },
  argTypes: { onChange: { action: 'changed' } },
};

const Template = (args) => {
  const [value, setValue] = useState(args.value ?? null);
  return (
    <>
      <NetworkSelector
        {...args}
        onChange={(params) => {
          args.onChange(params);
          setValue(params.value);
        }}
        value={value}
        menuIsOpen
      />
      <pre style={{ marginTop: 10 }}>{JSON.stringify({ value }, null, 2)}</pre>
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};

export const ValueSelected = Template.bind({});
ValueSelected.args = { value: 'Quorum' };
