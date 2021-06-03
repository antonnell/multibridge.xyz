import React from 'react'
import Progress from './Progress'

export default {
  title: 'Common/Progress',
  component: Progress,
  args: {}
}
const Template = (args) => <Progress {...args} />
export const InProgress = Template.bind({})
InProgress.args = { text: 'Bridging 0.01111 ETH to Polygon' }

export const Done = Template.bind({})
Done.args = { text: 'Transfer Complete', animate: false, done: true }
