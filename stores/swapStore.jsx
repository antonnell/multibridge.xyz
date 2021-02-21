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
  SWAP_SHOW_TX_STATUS,
  SWAP_DEPOSIT_TRANSACTION,
  SWAP_TRANSFER_TRANSACTION,
  CLEARN_LISTENERS,
  SWAP_STATUS_TRANSACTIONS
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
    name: 'Eth Mainnet',
    rpcURL: 'https://mainnet.infura.io/v3/b7a85e51e8424bae85b0be86ebd8eb31',
    chainID: '1',
    explorer: 'https://etherscan.io',
    symbol: 'ETH',
    icon: 'ETH.svg'
  },
  56: {
    name: 'BSC Mainnet',
    rpcURL: 'https://bsc-dataseed1.binance.org',
    chainID: '56',
    explorer: 'https://bscscan.com',
    symbol: 'BNB',
    icon: 'BNB.svg'
  },
  128: {
    name: 'HT Mainnet',
    rpcURL: 'https://http-mainnet.hecochain.com',
    chainID: '128',
    explorer: 'https://scan.hecochain.com',
    symbol: 'HT',
    icon: 'HT.svg'
  },
  250: {
    name: 'FTM Mainnet',
    rpcURL: 'https://rpcapi.fantom.network',
    chainID: '250',
    explorer: 'https://ftmscan.com',
    symbol: 'FTM',
    icon: 'FTM.png'
  },
  32659: {
    name: 'FSN Mainnet',
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
      swapAssets: [],
      listener: false,
      totalLocked: 0
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
          case CLEARN_LISTENERS:
            this.clearListener()
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

  clearListener = () => {
    this.setStore({ listener: false })
  }

  configureNew = async (payload) => {
    const anyswapServerResult = await fetch(`https://bridgeapi.anyswap.exchange/v2/serverInfo/chainid`);
    const anyswapServerJson = await anyswapServerResult.json()

    const anyswapServerArray = Object.keys(anyswapServerJson).map((key) => [key, anyswapServerJson[key]]);

    const assets = anyswapServerArray.map((chainDetails) => {

      const chainKey = chainDetails[0]
      if(chainKey == 4 || chainKey == 46688 || chainKey == 1) {
        return null
      }
      const chainVal = chainDetails[1]

      const chainValArray = Object.keys(chainVal).map((key) => [key, chainVal[key]]);

      const anyswapInfoFormatted = chainValArray.map((details) => {
        const key = details[0]

        if(['ltc', 'btc', 'any'].includes(key)) {
          return null
        }

        const val = details[1]

        const sourceChainInfo = this.mapSrcChainInfo(chainKey, key)
        if (val.SrcToken.DcrmAddress == '0xC564EE9f21Ed8A2d8E7e76c085740d5e4c5FaFbE') {
          return [
            {
              id: sourceChainInfo.sourceChainID+'_'+key,
              chainID: sourceChainInfo.sourceChainID,
              chainDescription: sourceChainInfo.sourceChainDescription,
              icon: sourceChainInfo.sourceChainIcon,
              pairID: val.PairID,
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
              chainDescription: sourceChainInfo.destinationChainDescription,
              icon: sourceChainInfo.destinationChainIcon,
              pairID: val.PairID,
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
        } else {
          return null
        }

      }).filter((a) => { return a !== null }).flat()

      return anyswapInfoFormatted
    }).filter((a) => { return a !== null }).flat()

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

          if(val.PairID === asset.pairID && chainKey === asset.chainID && asset.tokenMetadata.symbol === val.DestToken.Symbol) {
            return {
              id: sourceChainInfo.sourceChainID+'_'+key,
              chainID: sourceChainInfo.sourceChainID,
              pairID: val.PairID,
              symbol: val.SrcToken.Symbol
            }
          } else if (val.PairID === asset.pairID && sourceChainInfo.sourceChainID === asset.chainID && asset.tokenMetadata.symbol === val.SrcToken.Symbol) {
            return {
              id: chainKey+'_'+key,
              chainID: chainKey,
              pairID: val.PairID,
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
    let sourceChainIcon = ''
    let destinationChainIcon = ''

    if(CHAIN_MAP[chainKey]) {
      destinationChainDescription = CHAIN_MAP[chainKey].name
      destinationChainIcon = CHAIN_MAP[chainKey].icon
    } else {
      destinationChainDescription = 'Unknown Network'
      destinationChainIcon = 'unknown-logo.png'
    }
    if(chainKey === '1') {
      switch (key) {
        case 'btc':
          sourceChainID = 'BTC'
          sourceChainDescription = 'BTC Mainnet'
          sourceChainIcon = 'BTC.png'
          break;
        case 'any':
          sourceChainID = 'ANY'
          sourceChainDescription = 'ANY Mainnet'
          sourceChainIcon = 'ANY.png'
          break;
        case 'fsn':
          sourceChainID = '32659'
          sourceChainDescription = 'FSN Mainnet'
          sourceChainIcon = 'FSN.svg'
          break;
        case 'ltc':
          sourceChainID = 'LTC'
          sourceChainDescription = 'LTC Mainnet'
          sourceChainIcon = 'LTC.png'
          break;
        case 'block':
          sourceChainID = 'BLOCK'
          sourceChainDescription = 'BLOCK Mainnet'
          sourceChainIcon = 'BLOCK.png'
          break;
        case 'fantom':
          sourceChainID = '250'
          sourceChainDescription = 'FTM Mainnet'
          sourceChainIcon = 'FTM.png'
          break;
        default:
          sourceChainID = 'Unknown'
          sourceChainDescription = 'Unknown Network'
          sourceChainIcon = 'unknown-logo.png'
      }
    } else {
      if(key === 'btc') {
        sourceChainID = 'BTC'
        sourceChainDescription = 'BTC Mainnet'
        sourceChainIcon = 'BTC.png'
      } else {
        sourceChainID = '1'
        sourceChainDescription = 'ETH Mainnet'
        sourceChainIcon = 'ETH.svg'
      }
    }

    return {
      sourceChainID: sourceChainID,
      sourceChainDescription: sourceChainDescription,
      destinationChainDescription: destinationChainDescription,
      sourceChainIcon: sourceChainIcon,
      destinationChainIcon: destinationChainIcon
    }
  }

  getSwapBalancesNew = async () => {
    const account = await stores.accountStore.getStore('account')
    if(!account) {
      return false
    }

    const swapAssets = this.getStore('swapAssets')

    const coingeckoCoins = await CoinGeckoClient.coins.list()


    console.log(swapAssets)
    console.log(coingeckoCoins)

    const mappedAssetSymbols = swapAssets.map((asset) => {
      return asset.tokenMetadata.symbol.toLowerCase()
    })

    const filteredCoingeckoCoins = coingeckoCoins.data.filter((coin) => {
      return mappedAssetSymbols.includes(coin.symbol.toLowerCase())
    })

    const priceData = await CoinGeckoClient.simple.price({
      ids: filteredCoingeckoCoins.map(coin => coin.id),
      vs_currencies: ['usd'],
    });

    console.log(priceData)

    // get address from contract thing
    async.map(swapAssets, async (asset, callback) => {
      try {

        if(['BTC', 'LTC', 'BLOCK', 'ANY'].includes(asset.chainID)) {
          callback(null, asset)
          return
        }

        let web3 = null
        web3 = await stores.accountStore.getReadOnlyWeb3(asset.chainID)

        let erc20Address = asset.tokenMetadata.address

        if(asset.chainID === '1' && asset.pairID === 'Fantom') {
          const proxyContract = new web3.eth.Contract(PROXYSWAPASSETABI, erc20Address)
          erc20Address = await proxyContract.methods.proxyToken().call()
        }

        if(erc20Address) {
          const erc20Contract = new web3.eth.Contract(ERC20ABI, erc20Address)

          const decimals = await erc20Contract.methods.decimals().call()
          const balanceOf = await erc20Contract.methods.balanceOf(account.address).call()

          const balance = BigNumber(balanceOf).div(10**decimals).toNumber()
          asset.tokenMetadata.balance = balance

          if(asset.chainID == 1) {
            // GET USD Price
            let theCoinArr = filteredCoingeckoCoins.filter((coinData) => {
              return coinData.symbol.toLowerCase() === asset.tokenMetadata.symbol.toLowerCase()
            })
            let usdPrice = 1

            if(theCoinArr.length >  0) {
              let thePriceData = priceData.data[theCoinArr[0].id]
              if(thePriceData) {
                usdPrice = thePriceData.usd
              }
            }

            //USD Price * balance of DCRM contract
            const dcrmBalance = await erc20Contract.methods.balanceOf(asset.dcrmAddress).call()
            asset.balance = BigNumber(dcrmBalance).div(10**decimals).toNumber()
            asset.usdPrice = usdPrice
            asset.usdBalance = BigNumber(dcrmBalance).div(10**decimals).times(usdPrice).toNumber()
          }
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

      const totalLocked = swapAssetsMapped.reduce((a, b) => {
        return BigNumber(a).plus(b.usdBalance ? b.usdBalance : 0).toNumber()
      }, 0)

      this.setStore({ swapAssets: swapAssetsMapped })
      this.setStore({ totalLocked: totalLocked })

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
    const context = this
    contract.methods[method](...params).send({ from: account.address, gasPrice: web3.utils.toWei(gasPrice, 'gwei') })
      .on('transactionHash', function(hash){
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
    const { toAddressValue, toAssetValue, fromAssetValue } = payload.content

    let chainID = null
    let pairID = null

    if(toAssetValue.chainID == '1') {
      chainID = fromAssetValue.chainID
      pairID = fromAssetValue.pairID
    } else {
      chainID = toAssetValue.chainID
      pairID = toAssetValue.pairID
    }

    console.log(fromAssetValue.chainID)
    console.log(toAssetValue.chainID)

    console.log(chainID)
    console.log(pairID)

    try {
      const registerAccountResult = await fetch(`https://bridgeapi.anyswap.exchange/v2/register/${toAddressValue}/${chainID}/${pairID}`);
      const registerAccouontJson = await registerAccountResult.json()

      /*if(registerAccouontJson.msg && registerAccouontJson.msg === 'Success') {

        registerAccouontJson.info.receiveAccount = toAddressValue
        registerAccouontJson.info.chainID = chainID
        registerAccouontJson.info.coinType = pairID

        this.setStore({ depositInfo: registerAccouontJson.info })

        this.emitter.emit(SWAP_DEPOSIT_ADDRESS_RETURNED)

      } else {
        this.emitter.emit(ERROR, registerAccouontJson.msg)
      }*/

    } catch(ex) {
      console.log(ex)
      this.emitter.emit(ERROR, ex)
    }
  }

  swapConfirmSwap = async (payload) => {
    const { fromAssetValue, toAssetValue, fromAddressValue, toAddressValue, fromAmountValue } = payload.content

    let chainID = null
    let pairID = null

    if(toAssetValue.chainID == '1') {
      chainID = fromAssetValue.chainID
      pairID = fromAssetValue.pairID
    } else {
      chainID = toAssetValue.chainID
      pairID = toAssetValue.pairID
    }

    console.log(fromAssetValue.chainID)
    console.log(toAssetValue.chainID)

    console.log(chainID)
    console.log(pairID)

    try {
      const registerAccountResult = await fetch(`https://bridgeapi.anyswap.exchange/v2/register/${toAddressValue}/${chainID}/${pairID}`);
      const registerAccouontJson = await registerAccountResult.json()

    } catch(ex) {
      console.log(ex)
      this.emitter.emit(ERROR, ex)
    }

    if(fromAssetValue.chainID === '1' && !['BTC', 'LTC', 'BLOCK', 'ANY'].includes(toAssetValue.chainID)) {
      return this._ercToNative(fromAssetValue, toAssetValue, fromAddressValue, toAddressValue, fromAmountValue)
    }

    if(toAssetValue.chainID === '1' && !['BTC', 'LTC', 'BLOCK', 'ANY'].includes(fromAssetValue.chainID)) {
      return this._nativeToERC(fromAssetValue, toAssetValue, fromAmountValue)
    }
  }

  _ercToNative = async (fromAsset, toAsset, fromAddressValue, toAddressValue, amount) => {
    const depositAddress = toAsset.dcrmAddress

    const web3 = await stores.accountStore.getWeb3Provider()
    if(!web3) {
      return false
    }

    const account = await stores.accountStore.getStore('account')
    if(!account) {
      return false
    }

    const tokenContract = new web3.eth.Contract(ERC20ABI, fromAsset.tokenMetadata.address)
    const amountToSend = BigNumber(amount).times(10**fromAsset.tokenMetadata.decimals).toFixed(0)
    const gasPrice = await stores.accountStore.getGasPrice()

    this._callContract(web3, tokenContract, 'transfer', [depositAddress, amountToSend], account, gasPrice, SWAP_RETURN_SWAP_PERFORMED, async (err, txHash) => {
      if(err) {
        return this.emitter.emit(ERROR, err);
      }

      this.emitter.emit(SWAP_SHOW_TX_STATUS, txHash)

      const fromWeb3 = await stores.accountStore.getReadOnlyWeb3(fromAsset.chainID)
      const toWeb3 = await stores.accountStore.getReadOnlyWeb3(toAsset.chainID)

      const fromCurrentBlock = await fromWeb3.eth.getBlockNumber()
      const toCurrentBlock = await toWeb3.eth.getBlockNumber()

      this.setStore({ listener: true })
      const that = this

      while(this.getStore('listener') === true) {
        await this._getNewTransfers(fromWeb3, toWeb3, fromAsset, toAsset, depositAddress, fromCurrentBlock, toCurrentBlock, fromAddressValue, toAddressValue, '0x0000000000000000000000000000000000000000', txHash,  () => {
          this.setStore({ listener: false })
        })
      }
    })
  }

  _getNewTransfers = async (fromWeb3, toWeb3, fromAsset, toAsset, depositAddress, fromCurrentBlock, toCurrentBlock, fromAddressValue, toAddressValue, burnAddress, fromTXHash, callback) => {
    // call bridge API to get the status TX (returns the 2 TXs we need to listen to)
    // might need to change direction/chainID for swaps to and swaps back. need to test
    try {
      console.log('Checking again')
      let direction = 1 // I think?

      let chainID = null
      let pairID = null

      if(toAsset.chainID == '1') {
        chainID = fromAsset.chainID
        pairID = fromAsset.pairID
      } else {
        chainID = toAsset.chainID
        pairID = toAsset.pairID
      }

      let statusJson = null

      if(toAsset.chainID == '1') {
        const statusResult = await fetch(`https://bridgeapi.anyswap.exchange/v2/getWithdrawHashStatus/${toAddressValue}/${fromTXHash}/${chainID}/${pairID}/${direction}`);
        statusJson = await statusResult.json()
      } else {
        const statusResult = await fetch(`https://bridgeapi.anyswap.exchange/v2/getHashStatus/${toAddressValue}/${fromTXHash}/${chainID}/${pairID}/${direction}`);
        statusJson = await statusResult.json()
      }

      console.log(statusJson)
      this.emitter.emit(SWAP_STATUS_TRANSACTIONS, statusJson)

      if(statusJson && statusJson.info && statusJson.info.txid && statusJson.info.txid !== '' && statusJson.info.swaptx && statusJson.info.swaptx !== '') {
        //once we have the transfer we can stop listening

        if(statusJson.info.confirmations >= 10) {
          callback()
        }
      }
    } catch(ex) {
      console.log(ex)
    }

    //
    // console.log('--------------------------------------------------')
    // console.log('Searching for TX on: ', fromAsset.chainID)
    // console.log('Searching for TX asset: ', fromAsset.tokenMetadata.address)
    // console.log('Searching for TX from: ', fromAddressValue)
    // console.log('Searching for TX to: ', depositAddress)
    // console.log('--------------------')
    // console.log('Searching for TX on: ', toAsset.chainID)
    // console.log('Searching for TX asset: ', toAsset.tokenMetadata.address)
    // console.log('Searching for TX from: ', burnAddress)
    // console.log('Searching for TX to: ', toAddressValue)
    // console.log('--------------------------------------------------')
    //
    // const that = this
    //
    // const fromERC20Contract = new fromWeb3.eth.Contract(ERC20ABI, fromAsset.tokenMetadata.address)
    //
    // fromERC20Contract.getPastEvents('Transfer', {
    //   fromBlock: fromCurrentBlock,
    //   toBlock: 'latest',
    //   filter: { _from: fromAddressValue, _to: depositAddress }
    // })
    // .then(function(events){
    //   console.log(events)
    //   let event = events[events.length - 1]
    //
    //   if(event && event.returnValues._from.toLowerCase() === fromAddressValue.toLowerCase() &&
    //     event.returnValues._to.toLowerCase() === depositAddress.toLowerCase()) {
    //
    //     console.log(event.event)
    //     console.log(event.transactionHash)
    //     console.log(event.returnValues._from)
    //     console.log(event.returnValues._to)
    //     console.log(event.returnValues._value)
    //
    //     that.emitter.emit(SWAP_DEPOSIT_TRANSACTION, event)
    //   }
    // })
    // .catch((ex) => {
    //   console.log(ex)
    // })
    //
    // const toERC20Contract = new toWeb3.eth.Contract(ERC20ABI, toAsset.tokenMetadata.address)
    // toERC20Contract.getPastEvents('Transfer', {
    //   fromBlock: toCurrentBlock,
    //   toBlock: 'latest',
    //   filter: { _from: burnAddress, _to: toAddressValue }
    // })
    // .then(function(events){
    //   console.log(events)
    //   let event = events[events.length - 1]
    //
    //   if(event && event.returnValues._to.toLowerCase() === toAddressValue.toLowerCase() &&
    //     event.returnValues._from.toLowerCase() === burnAddress.toLowerCase()) {
    //
    //     console.log(event.event)
    //     console.log(event.transactionHash)
    //     console.log(event.returnValues._from)
    //     console.log(event.returnValues._to)
    //     console.log(event.returnValues._value)
    //
    //     that.emitter.emit(SWAP_TRANSFER_TRANSACTION, event)
    //
    //     callback()
    //   }
    // })
    // .catch((ex) => {
    //   console.log(ex)
    // })

    await this.sleep(10000)
  }

  sleep = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
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

    this._callContract(web3, tokenContract, 'Swapout', [amountToSend, account.address], account, gasPrice, SWAP_RETURN_SWAP_PERFORMED, async (err, txHash) => {
      if(err) {
        return this.emitter.emit(ERROR, err);
      }

      this.emitter.emit(SWAP_SHOW_TX_STATUS, txHash)

      const fromWeb3 = await stores.accountStore.getReadOnlyWeb3(fromAsset.chainID)
      const toWeb3 = await stores.accountStore.getReadOnlyWeb3(toAsset.chainID)

      const fromCurrentBlock = await fromWeb3.eth.getBlockNumber()
      const toCurrentBlock = await toWeb3.eth.getBlockNumber()

      this.setStore({ listener: true })
      const that = this

      while(this.getStore('listener') === true) {
        await this._getNewTransfers(fromWeb3, toWeb3, fromAsset, toAsset, '0x0000000000000000000000000000000000000000', fromCurrentBlock, toCurrentBlock, account.address, account.address, fromAsset.dcrmAddress, txHash, () => {
          that.setStore({ listener: false })
        })
      }
    })
  }
}

export default Store;
