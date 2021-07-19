import React from 'react';
import SideBarMenu from './SideBarMenu';
import { withNextRouter } from 'storybook-addon-next-router';

export default {
  title: 'SideBar/SideBarMenu',
  component: SideBarMenu,
  // default args
  args: {},
  decorators: [withNextRouter],
};
const Template = (args) => <SideBarMenu {...args} />;
const getComponent = (asPath) => {
  const component = Template.bind({});
  component.story = {
    parameters: {
      nextRouter: {
        path: '/',
        asPath,
      },
    },
  };

  return component;
};
export const Default = getComponent('/');
export const OnExplorerPage = getComponent('/explorer');
