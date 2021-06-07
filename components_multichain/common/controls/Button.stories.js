import React from 'react';
import Button from './Button';

export default {
  title: 'common/Button',
  component: Button,
  // default args
  args: {},
  argTypes: { onClick: { action: 'clicked' } },
};
const Template = (args) => <Button {...args}>click me</Button>;
export const PrimaryButton = Template.bind({});
PrimaryButton.args = {
  icon: null,
};
export const PrimaryButtonWithIcon = Template.bind({});
PrimaryButtonWithIcon.args = {
  icon: '/images/EthIcon24x24.svg',
};

export const SecondaryButton = Template.bind({});
SecondaryButton.args = {
  variant: 'secondary',
};
export const SecondaryButtonWithIcon = Template.bind({});
SecondaryButtonWithIcon.args = {
  variant: 'secondary',
  icon: '/images/EthIcon24x24.svg',
};
