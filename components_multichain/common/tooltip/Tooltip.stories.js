import React from 'react';
import Tooltip from './Tooltip';

export default {
  title: 'common/Tooltip',
  component: Tooltip,
  // default args
  args: {
    title:
      'Component which provides tooltip on hover. On long text scenario it wraps logically',
  },
  argTypes: {},
};
const Template = (args) => (
  <div>
    <pre style={{ marginTop: 200, marginLeft: 200 }}>
      <Tooltip {...args}>click me</Tooltip>
    </pre>
  </div>
);
export const Default = Template.bind({});
