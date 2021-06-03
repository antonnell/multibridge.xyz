import React from 'react';
import SiteActions from './SiteActions';
export default {
  title: 'common/SiteActions',
  component: SiteActions,
  // default args
  args: {},
};
const Template = (args) => <SiteActions {...args} />;

export const Default = Template.bind({});
Default.args = {};
