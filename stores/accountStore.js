import {
  GAS_PRICE_API,
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
  GAS_PRICES_RETURNED
} from './constants';

import stores from './'

import {
  injected
} from './connectors';

import Web3 from 'web3';

class Store {
  constructor(dispatcher, emitter) {

    this.dispatcher = dispatcher
    this.emitter = emitter

    this.store = {
      chainIDMapping: {
        1: {
          name: 'Ehereum Mainnet',
          rpcURL: 'https://mainnet.anyswap.exchange',
          chainID: '1',
          explorer: 'https://etherscan.io',
          symbol: 'ETH',
          icon: 'ETH.svg'
        },
        56: {
          name: 'BNB Mainnet',
          rpcURL: 'https://bsc-dataseed1.binance.org',
          chainID: '56',
          explorer: 'https://bscscan.com',
          symbol: 'BNB',
          icon: 'BNB.svg'
        },
        128: {
          name: 'Huobi Mainnet',
          rpcURL: 'https://http-mainnet.hecochain.com',
          chainID: '128',
          explorer: 'https://scan.hecochain.com',
          symbol: 'HT',
          icon: 'HT.svg'
        },
        250: {
          name: 'Fantom Mainnet',
          rpcURL: 'https://rpcapi.fantom.network',
          chainID: '250',
          explorer: 'https://ftmscan.com',
          symbol: 'FTM',
          icon: 'FTM.png'
        },
        32659: {
          name: 'Fusion Mainnet',
          rpcURL: 'https://mainnet.anyswap.exchange',
          chainID: '32659',
          explorer: 'https://fsnex.com',
          symbol: 'FSN',
          icon: 'FSN.svg'
        }
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

    this.getGasPrices()
    this.getCurrentBlock()

    injected.isAuthorized().then(isAuthorized => {
      if (isAuthorized) {
        injected.activate()
        .then((a) => {
          this.setStore({
            selectedChainID: a.provider.networkVersion,
            chainID: a.provider.networkVersion,
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

      console.log("REMOVING ACCOUNT CHANGED LISTENER")
      window.removeEventListener('ethereum#initialized', this.updateAccount)
      window.addEventListener('ethereum#initialized', this.updateAccount, {
        once: true,
      });
    }
  };

  updateAccount = () => {
    const that = this

    console.log("ADDING ACCOUNT CHANGED LISTENER")

    window.ethereum.on('accountsChanged', (accounts) => {
      if(accounts.length === 0) {
        that.setStore({
          chainID: null,
          account: null,
          web3context: null
        })
      } else {
        that.setStore({
          chainID: window.ethereum.networkVersion,
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
      const url = GAS_PRICE_API
      const priceResponse = await fetch(url);
      const priceJSON = await priceResponse.json()

      if(priceJSON) {
        return priceJSON
      }
    } catch(e) {
      console.log(e)
      return {}
    }
  }

  getGasPrice = async (speed) => {

    let gasSpeed = speed
    if(!speed) {
      gasSpeed = this.getStore('gasSpeed')
    }

    try {
      const url = GAS_PRICE_API
      const priceResponse = await fetch(url);
      const priceJSON = await priceResponse.json()

      if(priceJSON) {
        return priceJSON[gasSpeed].toFixed(0)
      }
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

  changeNetwork = (payload) => {
    this.setStore({ selectedChainID: payload.content.network.chainID })
    this.emitter.emit(NETWORK_CHANGED)
  }
}

export default Store;
