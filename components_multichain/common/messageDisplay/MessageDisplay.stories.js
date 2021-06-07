import React from 'react';
import MessageDisplay from './MessageDisplay';

export default {
  title: 'Common/MessageDisplay',
  component: MessageDisplay,
  args: {
    text: 'Test message',
    type: 'success',
    show: true,
  },
  argTypes: { onClose: { action: 'onClose' } },
};
const Template = (args) => <MessageDisplay {...args} />;
export const Success = Template.bind({});

export const Error = Template.bind({});
Error.args = { type: 'error' };
