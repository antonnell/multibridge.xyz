import React from 'react';
import WalletTile from './WalletTile';
export default {
  title: 'wallets/WalletTile',
  component: WalletTile,
  // default args
  args: {
    title: 'Metamask',
    icon: '/images/wallets/metamask.png',
  },
  argTypes: { onClick: { action: 'onClick' } },
};
const Template = (args) => <WalletTile {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const ComingSoon = Template.bind({});
ComingSoon.args = { title: 'Coming soon...', icon: null };
