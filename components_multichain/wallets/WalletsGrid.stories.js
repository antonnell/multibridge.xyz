import React from 'react';
import WalletsGrid from './WalletsGrid';
export default {
  title: 'wallets/WalletsGrid',
  component: WalletsGrid,
  // default args
  args: {
    wallets: [],
  },
  argTypes: { onClick: { action: 'onClick' } },
};
const getWallets = (n) => {
  let wallets = [];
  for (var i = 0; i < n; i += 1) {
    wallets.push({ title: 'Metamask', icon: '/images/wallets/metamask.png' });
  }
  return wallets;
};
const Template = (args) => <WalletsGrid {...args} />;
export const SingleTile = Template.bind({});
SingleTile.args = { wallets: getWallets(1) };

export const DoubleTile = Template.bind({});
DoubleTile.args = { wallets: getWallets(2) };

export const QuadTiles = Template.bind({});
const _wallets = getWallets(4);
_wallets[3].title = 'Coming soon...';
_wallets[3].icon = null;
QuadTiles.args = { wallets: _wallets };
