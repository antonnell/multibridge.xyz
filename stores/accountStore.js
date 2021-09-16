import {
  GAS_PRICE_API,
  ZAPPER_GAS_PRICE_API,
  ERROR,
  STORE_UPDATED,
  CONFIGURE,
  ACCOUNT_CONFIGURED,
  CONFIGURE_SWAP,
  SWAP_CONFIGURED,
  ACCOUNT_CHANGED,
  CHANGE_NETWORK,
  NETWORK_CHANGED,
  GET_GAS_PRICES,
  GAS_PRICES_RETURNED,
  GET_SWAP_BALANCES
} from './constants';

import stores from './'

import {
  injected,
  network
} from './connectors';

import Web3 from 'web3';

class Store {
  constructor(dispatcher, emitter) {

    this.dispatcher = dispatcher
    this.emitter = emitter

    this.store = {
      chains: [
        {
          name: 'Ethereum Mainnet',
          symbol: 'ETH',
          icon: 'ETH.svg',
        },
        {
          name: 'Binance Smart Chain Mainnet',
          symbol: 'BNB',
          icon: 'BNB.svg',
        },
        {
          name: 'xDAI Chain',
          symbol: 'xDAI',
          icon: 'STAKE.png',
        },
        {
          name: 'Matic Mainnet',
          symbol: 'MATIC',
          icon: 'MATIC.png',
        },
        {
          name: 'Huobi Mainnet',
          symbol: 'HT',
          icon: 'HT.svg',
        },
        {
          name: 'Avalanche',
          symbol: 'AVAX',
          icon: 'AVAX.svg',
        },
        {
          name: 'Fantom Mainnet',
          symbol: 'FTM',
          icon: 'FTM.png',
        },
        {
          name: 'Fusion Mainnet',
          symbol: 'FSN',
          icon: 'FSN.svg',
        },
        {
          name: 'Ethereum Mainnet',
          symbol: 'ETH',
          icon: 'ETH.svg',
        },
        {
          name: 'Bitcoin Mainnet',
          symbol: 'BTC',
          icon: 'BTC.png',
        },
        {
          name: 'Litecoin Mainnet',
          symbol: 'LTC',
          icon: 'LTC.png',
        },
        {
          name: 'Goerli Test Network',
          symbol: 'ETH',
          icon: 'ETH.svg',
        },
      ],
      chainIDMapping: {

      },
      chainID: null,
      account: null,
      web3context: null,
      connectorsByName: {
        MetaMask: injected
      },
      gasPrices: {
        "slow":90,
        "standard":90,
        "fast":100,
        "instant":130
      },
      gasSpeed: 'fast',
      currentBlock: 11743358,
      selectedChainID: '1'
    }

    dispatcher.register(
      function (payload) {
        console.log(payload)
        switch (payload.type) {
          case CONFIGURE:
            this.configure(payload);
            break;
          case CHANGE_NETWORK:
            this.changeNetwork(payload);
            break;
          default: {
          }
        }
      }.bind(this)
    );
  }

  getStore(index) {
    return(this.store[index]);
  };

  setStore(obj) {
    this.store = {...this.store, ...obj}
    console.log(this.store)
    return this.emitter.emit(STORE_UPDATED);
  };

  configure = async () => {

    const anyswapChainInfoResult = await fetch('https://bridgeapi.anyswap.exchange/data/bridgeChainInfo');
    const anyswapChainInfoJson = await anyswapChainInfoResult.json()

    let chainIDs = Object.keys(anyswapChainInfoJson)
    for(let i = 0; i < chainIDs.length; i++) {
      anyswapChainInfoJson[chainIDs[i]].chainID = chainIDs[i]
      if(chainIDs[i] === '1') {
        anyswapChainInfoJson[chainIDs[i]].rpc = 'https://mainnet.infura.io/v3/b7a85e51e8424bae85b0be86ebd8eb31'
      }
    }

    this.setStore({ chainIDMapping: anyswapChainInfoJson })

    this.getGasPrices()

    injected.isAuthorized().then(isAuthorized => {
      if (isAuthorized) {
        injected.activate()
        .then((a) => {

          let networkVersion = a.provider.networkVersion

          if(networkVersion === '0x63564c40') {
            networkVersion = '1666600000'
          }

          this.setStore({
            selectedChainID: networkVersion,
            chainID: networkVersion,
            account: {
              address: a.account
            },
            web3context: {
              library: {
                provider: a.provider
              }
            }
          })
          this.emitter.emit(ACCOUNT_CONFIGURED)

          this.dispatcher.dispatch({ type: CONFIGURE_SWAP, content: { connected: true } })
        })
        .catch((e) => {
          this.emitter.emit(ERROR, e)
          this.emitter.emit(ACCOUNT_CONFIGURED)

          this.dispatcher.dispatch({ type: CONFIGURE_SWAP, content: { connected: false } })
        })
      } else {
        //we can ignore if not authorized.
        this.emitter.emit(ACCOUNT_CONFIGURED)
        this.dispatcher.dispatch({ type: CONFIGURE_SWAP, content: { connected: false } })
      }
    });

    if(window.ethereum) {
      this.updateAccount()
    } else {

      window.removeEventListener('ethereum#initialized', this.updateAccount)
      window.addEventListener('ethereum#initialized', this.updateAccount, {
        once: true,
      });
    }
  };

  updateAccount = () => {
    const that = this

    window.ethereum.on('accountsChanged', (accounts) => {
      if(accounts.length === 0) {
        that.setStore({
          chainID: null,
          account: null,
          web3context: null
        })
      } else {

        let networkVersion = window.ethereum.networkVersion

        if(networkVersion === '0x63564c40') {
          networkVersion = '1666600000'
        }

        that.setStore({
          chainID: networkVersion,
          account: {
            address: accounts[0]
          },
          web3context: {
            library: {
              provider: window.ethereum
            }
          }
        })

      }
      that.emitter.emit(ACCOUNT_CHANGED)
      that.emitter.emit(ACCOUNT_CONFIGURED)

      that.dispatcher.dispatch({ type: CONFIGURE_SWAP, content: { connected: true } })
    })

    ethereum.on('networkChanged', (data) => {
      // window.location.reload();
      if(data === '0x63564c40') {
        data = '1666600000'
      }
      that.setStore({
        chainID: data
      })

      that.emitter.emit(NETWORK_CHANGED)
    });
  }

  getCurrentBlock = async (payload) => {
    try {
      var web3 = new Web3(process.env.NEXT_PUBLIC_PROVIDER);
      const block = await web3.eth.getBlockNumber()
      this.setStore({ currentBlock: block })
    } catch(ex) {
      console.log(ex)
    }
  }

  getGasPrices = async (payload) => {
    const gasPrices = await this._getGasPrices()
    let gasSpeed = localStorage.getItem('yearn.finance-gas-speed')

    if(!gasSpeed) {
      gasSpeed = 'fast'
      localStorage.getItem('yearn.finance-gas-speed', 'fast')
    }

    this.setStore({ gasPrices: gasPrices, gasSpeed: gasSpeed })
    this.emitter.emit(GAS_PRICES_RETURNED)
  }

  _getGasPrices = async () => {
    try {
      const url = ZAPPER_GAS_PRICE_API
      const priceResponse = await fetch(url);
      const priceJSON = await priceResponse.json()

      if(priceJSON) {
        return priceJSON
      }
      return {
        "slow":90,
        "standard":90,
        "fast":100,
        "instant":130
      }
    } catch(e) {
      console.log(e)
      return {}
    }
  }

  getGasPrice = async (speed, asset) => {

    let gasSpeed = speed
    if(!speed) {
      gasSpeed = this.getStore('gasSpeed')
    }

    if(asset && asset.chainID === '250') {
      //get gas price
      const web3 = await this.getWeb3Provider()
      const gasPrice = await web3.eth.getGasPrice()
      return web3.utils.fromWei(gasPrice, 'gwei')
    }

    try {
      const url = ZAPPER_GAS_PRICE_API
      const priceResponse = await fetch(url);
      const priceJSON = await priceResponse.json()

      if(priceJSON) {
        return priceJSON[gasSpeed].toFixed(0)
      }
      return '250'
    } catch(e) {
      console.log(e)
      return {}
    }
  }

  getWeb3Provider = async () => {
    let web3context = this.getStore('web3context')
    let provider = null

    if(!web3context) {
      provider = network.providers['1']
    } else {
      provider = web3context.library.provider
    }

    if(!provider) {
      return null
    }
    return new Web3(provider);
  }

  getReadOnlyWeb3 = async (chainID) => {
    const chainIDMapping = this.getStore('chainIDMapping')
    return new Web3(new Web3.providers.HttpProvider(chainIDMapping[chainID].rpc));
  }

  changeNetwork = (payload) => {
    this.setStore({ selectedChainID: payload.content.network.chainID })
    this.emitter.emit(NETWORK_CHANGED)
  }
}

export default Store;
