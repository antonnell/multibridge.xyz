import React from 'react'
import SwapLimits from './SwapLimits'
export default {
  title: 'Swap/SwapLimits',
  component: SwapLimits,
  args: { maxSwapAmount: 1000.0, minSwapAmount: 1.0, swapFee: 0.1, maxFreeAmount: 90909, minFreeAmount: 90 }
}

const Template = (args) => <SwapLimits {...args} />

export const Default = Template.bind({})
Default.args = {}
