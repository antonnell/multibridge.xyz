import React from 'react'
import LockedValueTile from './LockedValueTile'
export default {
  title: 'stats/LockedValueTile',
  component: LockedValueTile,
  // default args
  args: {
    value: 107333456.9
  }
}
const Template = (args) => <LockedValueTile {...args} />

export const Default = Template.bind({})
