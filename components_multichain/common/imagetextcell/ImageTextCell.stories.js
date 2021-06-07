import React from 'react'
import ImageTextCell from './ImageTextCell'
export default {
  title: 'common/ImageTextCell',
  component: ImageTextCell,
  // default args
  args: {
    icon: '/images/USDT.svg',
    title: 'Test Title',
    subtitle: 'test sub title'
  }
}
const Template = (args) => <ImageTextCell {...args} />

export const Default = Template.bind({})
