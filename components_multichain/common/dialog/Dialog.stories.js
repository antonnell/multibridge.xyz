import React from 'react';
import Dialog from './Dialog';

export default {
  title: 'common/Dialog',
  component: Dialog,
  // default args
  args: {
    open: true,
    title: 'Connect Wallet',
  },
  argTypes: { onClose: { action: 'Dialog Closed' } },
};
const Template = (args) => <Dialog {...args}>Dialog Content</Dialog>;
export const Default = Template.bind({});
