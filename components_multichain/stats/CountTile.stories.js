import React from 'react';
import CountTile from './CountTile';
export default {
  title: 'stats/CountTile',
  component: CountTile,
  // default args
  args: {
    title: '25',
    subtitle: 'Nodes securing the network',
  },
};
const Template = (args) => <CountTile {...args} />;

export const Default = Template.bind({});
Default.args = {};
export const SubtitleAsLink = Template.bind({});
SubtitleAsLink.args = {
  subtitleOnClick: () => {},
  subtitle: 'Tokens supported',
};
