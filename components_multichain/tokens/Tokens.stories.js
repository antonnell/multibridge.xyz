import React from 'react';
import Tokens from './Tokens';
export default {
  title: 'explorer/Tokens',
  component: Tokens,
  // default args
  args: {},
};
const Template = (args) => (
  <div style={{ height: '100vh' }}>
    <Tokens {...args} />
  </div>
);
export const Default = Template.bind({});
