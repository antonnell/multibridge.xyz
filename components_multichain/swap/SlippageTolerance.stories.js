import React from 'react';
import SlippageTolerance from './SlippageTolerance';
const options = [{ value: 2 }, { value: 3 }];
export default {
  title: 'Swap/SlippageTolerance',
  component: SlippageTolerance,
  // default args
  args: {
    options,
    value: {
      value: 2,
      selectedOption: 0,
    },
  },
  argTypes: { onChange: { action: 'changed' } },
};

const Template = (args) => <SlippageTolerance {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const WithMoreFixedOptions = Template.bind({});
const withMoreOptions = [...options, { value: 3.5 }];
WithMoreFixedOptions.args = {
  options: withMoreOptions,
  value: {
    value: 2,
    selectedOption: 1,
  },
};
