const config = {
  appInfo: {
    versionName: 'Security Audit',
  },
  addressFormat: {
    thresholdLength: 30,
    prefixLength: 11,
    suffixLength: 13,
    dots: '......',
  },
  contractFormat: {
    thresholdLength: 19,
    prefixLength: 7,
    suffixLength: 4,
    dots: '...',
  },
  timeFromNow: {
    cutOffSecs: 24 * 60 * 60, // secs before now. In this period, time displayed in friendly format
    defaultFormat: 'YYYY/MM/DD HH:mm',
  },
  grid: {
    rowsPerPage: [10, 20, 50, 100],
    defaultRowsPerPage: 10,
  },
  lockedValueTile: {
    textBlocks: [
      {
        title: "We're Growing",
        subtitle:
          'Come experience ease of using our exchange for your crypto currency needs and more text and more text and more',
      },
      {
        title: "We're Hassle free",
        subtitle:
          'Come experience ease of using our exchange for your crypto currency needs and more text and more text and more',
      },
    ],
  },

  socialMedia: [
    {
      name: 'twitter',
      href: 'https://twitter.com/yearn.fi',
    },
    {
      name: 'medium',
      href: 'https://medium.com',
    },
    {
      name: 'path66',
      href: 'https://path66.com',
    },
    {
      name: 'git',
      href: 'https://github.com',
    },
  ],

  swap: {
    slippageTolerance: {
      slippageOptions: [2, 3],
      maxSlippage: 5, // %age
    },
    gasSettingsOptions: [
      { name: 'Slow', value: 'slow', description: '83 Gwei' },
      { name: 'Fast', value: 'fast', description: '91 Gwei' },
      { name: 'Instant', value: 'instant', description: '102 Gwei' },
    ],
    messages: {
      bridging: 'Bridging $amount$ $coin$ to $network$',
      depositing: 'Success! Depositing into $network$...',
      swapSuccess: '$amount$ $coin$ Successfully deposited to $network$',
    },
  },
  wallets: [
    { title: 'Metamask', icon: '/images/wallets/metamask.png', id: 'metamask' },
    {
      title: 'Metamask2',
      icon: '/images/wallets/metamask.png',
      id: 'metamask2',
    },
    { title: 'Coming soon...', id: 'future1' },
    { title: 'Coming soon...', id: 'future2' },
  ],
};
export default config;
