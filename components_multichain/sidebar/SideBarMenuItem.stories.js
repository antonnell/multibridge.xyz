import React from 'react';
import SideBarMenuItem from './SideBarMenuItem';
export default {
  title: 'SideBar/SideBarMenuItem',
  component: SideBarMenuItem,
  // default args
  args: {
    text: 'swap',
    // NOTE: Given images are in local folder   and not in public/ folder
    // below convention is required
    // If sending public folder , path can be sent directly
    // E.g /images/xxx.svg
    icon: '/images/sidebar/swap.svg',

    selected: false,
    id: 'swap',
  },
  argTypes: { onClick: { action: 'clicked' } },
};
const Template = (args) => <SideBarMenuItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  selected: false,
};

export const Selected = Template.bind({});
Selected.args = {
  selected: true,
  text: 'swap',
  iconSelected: '/images/sidebar/swap-selected.svg',
};
