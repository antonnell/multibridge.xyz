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
  SWAP_DEPOSIT_ADDRESS_RETURNED,
  SWAP_CONFIRM_SWAP,
  SWAP_RETURN_DEPOSIT_ADDRESS,
  SWAP_RETURN_SWAP_PERFORMED,
  SWAP_SHOW_TX_STATUS
} from './constants';

import stores from './'

import {
  ERC20ABI,
  ERC20SWAPASSETABI,
  BTCSWAPASSETABI,
  PROXYSWAPASSETABI
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
    name: 'Ethereum Mainnet',
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
      swapChains: [],
      swapAssets: []
    }

    dispatcher.register(
      function (payload) {
        switch (payload.type) {
          case CONFIGURE_SWAP:
            this.configureNew(payload)
            break;
          case GET_SWAP_BALANCES:
            this.getSwapBalancesNew(payload);
            break;
          case APPROVE_SWAP:
            this.approveSwap(payload);
            break;
          case SWAP_GET_DEPOSIT_ADDRESS:
            this.getDepositAddress(payload)
            break;
          case SWAP_CONFIRM_SWAP:
            this.swapConfirmSwap(payload)
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

        const sourceChainInfo = this.mapSrcChainInfo(chainKey, key)

        return [
          {
            id: sourceChainInfo.sourceChainID+'_'+key,
            chainID: sourceChainInfo.sourceChainID,
            pairID: key,
            contractAddress: val.SrcToken.ContractAddress,
            dcrmAddress: val.SrcToken.DcrmAddress,
            minimumSwap: val.SrcToken.MinimumSwap,
            maximumSwap: val.SrcToken.MaximumSwap,
            swapFeeRate: val.SrcToken.SwapFeeRate,
            maximumSwapFee: val.SrcToken.MaximumSwapFee,
            minimumSwapFee: val.SrcToken.MinimumSwapFee,
            tokenMetadata: {
              icon: `/tokens/${val.SrcToken.Symbol}.png`,
              address: val.SrcToken.ContractAddress,
              symbol: val.SrcToken.Symbol,
              decimals: val.SrcToken.Decimals,
              name: val.SrcToken.Name,
              description: `${val.SrcToken.Symbol} on ${sourceChainInfo.sourceChainDescription}`
            }
          },
          {
            id: chainKey+'_'+key,
            chainID: chainKey,
            pairID: key,
            contractAddress: val.DestToken.ContractAddress,
            dcrmAddress: val.DestToken.DcrmAddress,
            minimumSwap: val.DestToken.MinimumSwap,
            maximumSwap: val.DestToken.MaximumSwap,
            swapFeeRate: val.DestToken.SwapFeeRate,
            maximumSwapFee: val.DestToken.MaximumSwapFee,
            minimumSwapFee: val.DestToken.MinimumSwapFee,
            tokenMetadata: {
              icon: `/tokens/${val.SrcToken.Symbol}.png`,
              address: val.DestToken.ContractAddress,  // GET ADDRESS SOMEHOW, think it is contractAddress.proxyToken
              symbol: val.DestToken.Symbol,
              decimals: val.DestToken.Decimals,
              name: val.DestToken.Name,
              description: `${val.DestToken.Symbol} on ${sourceChainInfo.destinationChainDescription}`
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

    const uniqueAssetsWithTargets = uniqueAssets.map((asset) => {
      const targets = anyswapServerArray.map((chainDetails) => {
        const chainKey = chainDetails[0]
        const chainVal = chainDetails[1]

        const chainValArray = Object.keys(chainVal).map((key) => [key, chainVal[key]]);

        const anyswapInfoFormatted = chainValArray.map((details) => {
          const key = details[0]
          const val = details[1]

          const sourceChainInfo = this.mapSrcChainInfo(chainKey, key)

          if(key === asset.pairID && chainKey === asset.chainID && asset.tokenMetadata.symbol === val.DestToken.Symbol) {
            return {
              id: sourceChainInfo.sourceChainID+'_'+key,
              chainID: sourceChainInfo.sourceChainID,
              pairID: key,
              symbol: val.SrcToken.Symbol
            }
          } else if (key === asset.pairID && sourceChainInfo.sourceChainID === asset.chainID && asset.tokenMetadata.symbol === val.SrcToken.Symbol) {
            return {
              id: chainKey+'_'+key,
              chainID: chainKey,
              pairID: key,
              symbol: val.DestToken.Symbol
            }
          } else {
            return null
          }
        })
        return anyswapInfoFormatted.filter((info) => { return info != null })
      }).filter((asset) => { return asset != null }).flat()
      asset.targets = targets

      return asset
    })

    this.setStore({ swapAssets: uniqueAssetsWithTargets.sort((a, b) => {
        if(a.chainID > b.chainID) {
          return 1
        } else if ( a.chainID < b.chainID) {
          return -1
        } else if ( a.symbol > b.symbol) {
          return 1
        } else if( a.symbol < b.symbol) {
          return -1
        } else {
          return 0
        }
      })
    })

    this.emitter.emit(SWAP_CONFIGURED)
    this.emitter.emit(SWAP_UPDATED)
    this.dispatcher.dispatch({ type: GET_SWAP_BALANCES, content: {} })

  }

  mapSrcChainInfo = (chainKey, key) => {
    let sourceChainID = ''
    let sourceChainDescription = ''
    let destinationChainDescription = ''
    if(CHAIN_MAP[chainKey]) {
      destinationChainDescription = CHAIN_MAP[chainKey].name
    } else {
      destinationChainDescription = 'Unknown Network'
    }
    if(chainKey === '1') {
      switch (key) {
        case 'btc':
          sourceChainID = 'BTC'
          sourceChainDescription = 'Bitcoin Mainnet'
          break;
        case 'any':
          sourceChainID = 'ANY'
          sourceChainDescription = 'Anyswap Mainnet'
          break;
        case 'fsn':
          sourceChainID = '32659'
          sourceChainDescription = 'Fusion Mainnet'
          break;
        case 'ltc':
          sourceChainID = 'LTC'
          sourceChainDescription = 'Litecoin Mainnet'
          break;
        case 'block':
          sourceChainID = 'BLOCK'
          sourceChainDescription = 'Blocknet Mainnet'
          break;
        case 'fantom':
          sourceChainID = '250'
          sourceChainDescription = 'Fantom Mainnet'
          break;
        default:
          sourceChainID = 'Unknown'
          sourceChainDescription = 'Unknown Network'
      }
    } else {
      if(key === 'btc') {
        sourceChainID = 'BTC'
        sourceChainDescription = 'Bitcoin Mainnet'
      } else {
        sourceChainID = '1'
        sourceChainDescription = 'Ethereum Mainnet'
      }
    }

    return {
      sourceChainID: sourceChainID,
      sourceChainDescription: sourceChainDescription,
      destinationChainDescription: destinationChainDescription
    }
  }

  getSwapBalancesNew = async () => {
    const account = await stores.accountStore.getStore('account')
    const chainID = await stores.accountStore.getStore('chainID')
    if(!account) {
      return false
    }

    const web3 = await stores.accountStore.getWeb3Provider()
    const swapAssets = this.getStore('swapAssets')

    // get address from contract thing
    async.map(swapAssets, async (asset, callback) => {
      try {
        if(asset.chainID != chainID) {
          callback(null, asset)
          return
        }

        let erc20Address = asset.tokenMetadata.address

        if(asset.chainID === '1' && asset.pairID === 'fantom') {
          const proxyContract = new web3.eth.Contract(PROXYSWAPASSETABI, erc20Address)
          erc20Address = await proxyContract.methods.proxyToken().call()
        }

        if(erc20Address) {
          const erc20Contract = new web3.eth.Contract(ERC20ABI, erc20Address)

          const decimals = await erc20Contract.methods.decimals().call()
          const balanceOf = await erc20Contract.methods.balanceOf(account.address).call()

          const balance = BigNumber(balanceOf).div(10**decimals).toNumber()

          asset.tokenMetadata.balance = balance
        }

        callback(null, asset)
      } catch(ex) {
        console.log(asset)
        console.log(ex)
        callback(null, asset)
      }
    }, (err, swapAssetsMapped) => {
      if(err) {
        console.log(err)
        return this.emitter.emit(ERROR, err)
      }

      this.setStore({ swapAssets: swapAssetsMapped })

      this.emitter.emit(SWAP_UPDATED)
      this.emitter.emit(SWAP_BALANCES_RETURNED)
    })
  }

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

    console.log(contract.methods)
    console.log(contract.methods[method])
    console.log(contract.methods[method](...params))

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


  /*
    if ERC20 -> Native Chain(56, 128, 250, 32659)
      return DCRM address
      Show Deposit address screen

    if Native Chain(56, 128, 250, 32659) -> ERC20
      Call SwapOut on nativeChain side
      Show TXStatus screen

    if BTC -> Ethereum
      Generate Deposit Address
      return deposit address
      Show Deposit address screen

    if Ethereum -> BTC
      Call SwapOut on Eth
      Show TXStatus screen

    if FTM -> FTMERC20
      Return DCRM address
      Show Deposit address screen

    if FTMERC20 -> FTM
      Check approval for contractAddress to use delegateToken
      if fine, call swapOut on contractAddress
      Show TXStatus screen
      if not, call approval, then do tX. Probably need an intermediary screen, or extra field on TX status screen

  */

  swapConfirmSwap = async (payload) => {
    const { fromAsset, toAsset, receiveAddress, amount } = payload.content

    if(fromAsset.chainID === '1' && !['BTC', 'LTC', 'BLOCK', 'ANY'].includes(toAsset.chainID)) {
      this._ercToNative(fromAsset, toAsset)
    }

    if(toAsset.chainID === '1' && !['BTC', 'LTC', 'BLOCK', 'ANY'].includes(fromAsset.chainID)) {
      this._nativeToERC(fromAsset, toAsset, amount)
    }

    console.log(fromAsset)
    console.log(toAsset)
    console.log("NO DICE")
  }

  _ercToNative = async (fromAsset, toAsset) => {
    const depositAddress = toAsset.dcrmAddress
    this.emitter.emit(SWAP_RETURN_DEPOSIT_ADDRESS, depositAddress)
  }

  _nativeToERC = async (fromAsset, toAsset, amount) => {
    const account = await stores.accountStore.getStore('account')
    if(!account) {
      return false
    }

    const web3 = await stores.accountStore.getWeb3Provider()
    if(!web3) {
      return false
    }

    const tokenContract = new web3.eth.Contract(ERC20SWAPASSETABI, fromAsset.contractAddress)
    const amountToSend = BigNumber(amount).times(10**fromAsset.tokenMetadata.decimals).toFixed(0)
    const gasPrice = await stores.accountStore.getGasPrice()

    this._callContract(web3, tokenContract, 'Swapout', [amountToSend, account.address], account, gasPrice, SWAP_RETURN_SWAP_PERFORMED, (err, res) => {
      if(err) {
        return this.emitter.emit(ERROR, err);
      }

      return this.emitter.emit(SWAP_SHOW_TX_STATUS, res)
    })
  }
}

export default Store;
