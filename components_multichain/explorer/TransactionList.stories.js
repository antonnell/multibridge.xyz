import React from 'react';
import TransactionList from './TransactionList';
export default {
  title: 'explorer/TransactionList',
  component: TransactionList,
  // default args
  args: {},
};
const Template = (args) => (
  <div style={{ height: '100vh' }}>
    <TransactionList {...args} />
  </div>
);
export const Default = Template.bind({});
