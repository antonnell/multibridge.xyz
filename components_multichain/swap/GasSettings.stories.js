import React from 'react'
import GasSettings from './GasSettings'
const options = [
  { name: 'Slow', value: 'slow', description: '83 Gwei' },
  { name: 'Fast', value: 'fast', description: '91 Gwei' },
  { name: 'Instant', value: 'instant', description: '102 Gwei' }
]
export default {
  title: 'Swap/GasSettings',
  component: GasSettings,
  // default args
  args: { options },
  argTypes: { onChange: { action: 'onChange' } }
}

const Template = (args) => <GasSettings {...args} />

export const Default = Template.bind({})
Default.args = {}
