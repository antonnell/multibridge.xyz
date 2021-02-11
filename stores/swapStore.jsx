import async from 'async';
import {
  COMPTROLLER_ADDRESS,
  CREAM_PRICE_ORACLE_ADDRESS,
  X_VAULT_ADDRESS,
  MAX_UINT256,
  ERROR,
  TX_SUBMITTED,
  STORE_UPDATED,
  SWAP_UPDATED,
  CONFIGURE_SWAP,
  SWAP_CONFIGURED,
  GET_SWAP_BALANCES,
  SWAP_BALANCES_RETURNED,
  APPROVE_SWAP,
  APPROVE_SWAP_RETURNED,
  SWAP,
  SWAP_RETURNED,
  SWAP_GET_DEPOSIT_ADDRESS,
  SWAP_DEPOSIT_ADDRESS_RETURNED
} from './constants';

import stores from './'

import {
  ERC20ABI,
} from './abis'
import { bnDec } from '../utils'

import BigNumber from 'bignumber.js'
const fetch = require('node-fetch');

const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

const ID_MAP = {
  fsn: 'fsn',
  btc: 'bitcoin',
  ltc: 'litecoin',
  any: 'anyswap',
  block: 'blocknet'
}

const CHAIN_MAP = {
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
}

class Store {
  constructor(dispatcher, emitter) {

    this.dispatcher = dispatcher
    this.emitter = emitter

    this.store = {
      swapChains: []
    }

    dispatcher.register(
      function (payload) {
        switch (payload.type) {
          case CONFIGURE_SWAP:
            this.configure(payload)
            this.configureNew(payload)
            break;
          case GET_SWAP_BALANCES:
            this.getSwapBalances(payload);
            break;
          case APPROVE_SWAP:
            this.approveSwap(payload);
            break;
          case SWAP_GET_DEPOSIT_ADDRESS:
            this.getDepositAddress(payload)
            break;
          default: {
          }
        }
      }.bind(this)
    );
  }

  getStore = (index) => {
    return(this.store[index]);
  };

  setStore = (obj) => {
    this.store = {...this.store, ...obj}
    console.log(this.store)
    return this.emitter.emit(STORE_UPDATED);
  };

  configureNew = async (payload) => {
    const anyswapServerResult = await fetch(`https://bridgeapi.anyswap.exchange/v2/serverInfo/chainid`);
    const anyswapServerJson = await anyswapServerResult.json()

    const anyswapServerArray = Object.keys(anyswapServerJson).map((key) => [key, anyswapServerJson[key]]);

    const assets = anyswapServerArray.map((chainDetails) => {

      const chainKey = chainDetails[0]
      const chainVal = chainDetails[1]

      const chainValArray = Object.keys(chainVal).map((key) => [key, chainVal[key]]);

      const anyswapInfoFormatted = chainValArray.map((details) => {
        const key = details[0]
        const val = details[1]

        let sourceChainID = ''
        if(chainKey === '1') {
          switch (key) {
            case 'btc':
              sourceChainID = 'BTC'
              break;
            case 'any':
              sourceChainID = 'ANY'
              break;
            case 'fsn':
              sourceChainID = '32659'
              break;
            case 'ltc':
              sourceChainID = 'LTC'
              break;
            case 'block':
              sourceChainID = 'BLOCK'
              break;
            case 'fantom':
              sourceChainID = '250'
              break;
            default:
          }
        } else {
          if(key === 'btc') {
            sourceChainID = 'BTC'
          }
          sourceChainID = '1'
        }

        return [
          {
            id: sourceChainID+'_'+key,
            chainID: sourceChainID, // this is ERC 20 when !ethereum
            pairID: key,
            contractAddress: val.DestToken.ContractAddress,
            dcrmAddress: val.DestToken.ContractAddress,
            minimumSwap: val.SrcToken.MinimumSwap,
            maximumSwap: val.SrcToken.MaximumSwap,
            swapFeeRate: val.SrcToken.SwapFeeRate,
            maximumSwapFee: val.SrcToken.MaximumSwapFee,
            minimumSwapFee: val.SrcToken.MinimumSwapFee,
            tokenMetadata: {
              icon: `/tokens/${val.SrcToken.Symbol}.png`,
              address: '', //val.SrcToken.DcrmAddress
              symbol: val.SrcToken.Symbol,
              decimals: val.SrcToken.Decimals,
              name: val.SrcToken.Name,
              description: val.SrcToken.Description
            }
          },
          {
            id: chainKey+'_'+key,
            chainID: chainKey,
            pairID: key,
            contractAddress: val.DestToken.ContractAddress,
            dcrmAddress: val.DestToken.ContractAddress,
            minimumSwap: val.DestToken.MinimumSwap,
            maximumSwap: val.DestToken.MaximumSwap,
            swapFeeRate: val.DestToken.SwapFeeRate,
            maximumSwapFee: val.DestToken.MaximumSwapFee,
            minimumSwapFee: val.DestToken.MinimumSwapFee,
            tokenMetadata: {
              icon: `/tokens/${val.SrcToken.Symbol}.png`,
              address: '',  // GET ADDRESS SOMEHOW, think it is contractAddress.proxyToken
              symbol: val.DestToken.Symbol,
              decimals: val.DestToken.Decimals,
              name: val.DestToken.Name,
              description: val.DestToken.Description
            }
          }
        ]
      }).flat()

      return anyswapInfoFormatted
    }).flat()

    const uniqueAssets = [];
    const map = new Map();
    for (const item of assets) {
        if(!map.has(item.id)){
            map.set(item.id, true);
            uniqueAssets.push(item);
        }
    }

  }

  configure = async (payload) => {
    const anyswapServerResult = await fetch(`https://bridgeapi.anyswap.exchange/v2/serverInfo/chainid`);
    const anyswapServerJson = await anyswapServerResult.json()

    const anyswapServerArray = Object.keys(anyswapServerJson).map((key) => [key, anyswapServerJson[key]]);

    const serverInfo = anyswapServerArray.map((serverDetails) => {
      const chainKey = serverDetails[0]
      const chainVal = serverDetails[1]

      const chainValArray = Object.keys(chainVal).map((key) => [key, chainVal[key]]);

      const anyswapInfoFormatted = chainValArray.map((details) => {
        const key = details[0]
        const val = details[1]

        return {
          key: key,
          pairID: val.PairID,
          sourceAsset: {
            key: val.SrcToken.ID,
            dcrmAddress: val.SrcToken.DcrmAddress,
            depositAddress: val.SrcToken.DepositAddress,
            minimumSwap: val.SrcToken.MinimumSwap,
            maximumSwap: val.SrcToken.MaximumSwap,
            swapFeeRate: val.SrcToken.SwapFeeRate,
            maximumSwapFee: val.SrcToken.MaximumSwapFee,
            minimumSwapFee: val.SrcToken.MinimumSwapFee,
            tokenMetadata: {
              icon: `/tokens/${val.SrcToken.Symbol}.png`,
              address: val.SrcToken.DcrmAddress,
              symbol: val.SrcToken.Symbol,
              decimals: val.SrcToken.Decimals,
              name: val.SrcToken.Name,
              description: val.SrcToken.Description
            }
          },
          destinationAsset: {
            key: val.DestToken.ID,
            dcrmAddress: val.DestToken.DcrmAddress,
            minimumSwap: val.DestToken.MinimumSwap,
            maximumSwap: val.DestToken.MaximumSwap,
            swapFeeRate: val.DestToken.SwapFeeRate,
            maximumSwapFee: val.DestToken.MaximumSwapFee,
            minimumSwapFee: val.DestToken.MinimumSwapFee,
            tokenMetadata: {
              icon: `/tokens/${val.SrcToken.Symbol}.png`,
              address: val.DestToken.ContractAddress,
              symbol: val.DestToken.Symbol,
              decimals: val.DestToken.Decimals,
              name: val.DestToken.Name,
              description: val.DestToken.Description
            }
          }
        }
      })

      const chainInfo = CHAIN_MAP[chainKey]

      if(!chainInfo) {
        return null
      }

      return {
        key: chainKey,
        name: chainInfo.name,
        rpcURL: chainInfo.rpcURL,
        chainID: chainInfo.chainID,
        explorer: chainInfo.explorer,
        symbol: chainInfo.symbol,
        pairs: anyswapInfoFormatted,
        icon: `/blockchains/${chainInfo.icon}`,
      }
    }).filter((a) => {
      return a !== null
    })

    this.setStore({ swapChains: serverInfo })

    this.emitter.emit(SWAP_CONFIGURED)
    this.emitter.emit(SWAP_UPDATED)
    this.dispatcher.dispatch({ type: GET_SWAP_BALANCES, content: {} })

  };

  getSwapBalances = async () => {

    const account = await stores.accountStore.getStore('account')
    if(!account) {

      return false
    }

    const web3 = await stores.accountStore.getWeb3Provider()
    const swapChains = this.getStore('swapChains')

    const allAssets = swapChains.map((chain) => {
      return chain.pairs.map((pair) => {
        return pair.sourceAsset.tokenMetadata.symbol.toLowerCase()
      })
    }).flat()

    const coingeckoCoins = await CoinGeckoClient.coins.list()

    const filteredCoingeckoCoins = coingeckoCoins.data.filter((coinData) => {
      return allAssets.includes(coinData.symbol.toLowerCase())
    })

    const priceData = await CoinGeckoClient.simple.price({
      ids: filteredCoingeckoCoins.map(coin => coin.id),
      vs_currencies: ['usd'],
    });

    const swapChainsWithPrice = swapChains.map((chain) => {
      const pairs = chain.pairs.map((pair) => {

        let theCoinArr = filteredCoingeckoCoins.filter((coinData) => {
          return coinData.symbol.toLowerCase() === pair.sourceAsset.tokenMetadata.symbol.toLowerCase()
        })

        if(theCoinArr.length >  0) {
          pair.coingeckoID = theCoinArr[0].id

          let thePriceData = priceData.data[theCoinArr[0].id]
          if(thePriceData) {
            pair.destinationAsset.tokenMetadata.price = thePriceData.usd
            pair.sourceAsset.tokenMetadata.price = thePriceData.usd
          }

        }
        return pair
      })
      chain.pairs = pairs
      return chain
    })

    this.setStore({ swapChains: swapChainsWithPrice })

    this.emitter.emit(SWAP_UPDATED)
    this.emitter.emit(SWAP_BALANCES_RETURNED)
  }

  approveSwap = async (payload) => {

  }

  _callContract = (web3, contract, method, params, account, gasPrice, dispatchEvent, callback) => {
    //todo: rewrite the callback unfctionality.

    const context = this
    contract.methods[method](...params).send({ from: account.address, gasPrice: web3.utils.toWei(gasPrice, 'gwei') })
      .on('transactionHash', function(hash){
        context.emitter.emit(TX_SUBMITTED, hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        if(dispatchEvent && confirmationNumber === 1) {
          context.dispatcher.dispatch({ type: dispatchEvent })
        }
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  getDepositAddress = async (payload) => {
    const { receiveAccount, chainID, coinType } = payload.content

    try {
      const registerAccountResult = await fetch(`https://bridgeapi.anyswap.exchange/v2/register/${receiveAccount}/${chainID}/${coinType}`);
      const registerAccouontJson = await registerAccountResult.json()

      if(registerAccouontJson.msg && registerAccouontJson.msg === 'Success') {

        registerAccouontJson.info.receiveAccount = receiveAccount
        registerAccouontJson.info.chainID = chainID
        registerAccouontJson.info.coinType = coinType

        this.setStore({ depositInfo: registerAccouontJson.info })

        this.emitter.emit(SWAP_DEPOSIT_ADDRESS_RETURNED)

      } else {
        this.emitter.emit(ERROR, registerAccouontJson.msg)
      }

    } catch(ex) {
      console.log(ex)
      this.emitter.emit(ERROR, ex)
    }
  }
}

export default Store;
