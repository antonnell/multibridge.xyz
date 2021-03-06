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
  SWAP_STATUS_TRANSACTIONS,
  GET_BRIDGE_INFO,
  BRIDGE_INFO_RETURNED,
  GET_SWAP_HISTORY,
  SWAP_HISTORY_RETURNED,
  TX_UPDATED,
  TX_HASH,
  TX_RECEIPT,
  TX_CONFIRMED,
  GET_SWAP_TOKENS,
  SWAP_TOKENS_RETURNED
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
      totalLocked: 0,
      transactions: [],
      swapTokens: []
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
          case GET_BRIDGE_INFO:
            this.getBridgeInfo()
            break;
          case GET_SWAP_HISTORY:
            this.getSwapHistroy()
            break;
          case GET_SWAP_TOKENS:
            this.getSwapTokens()
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
      if(chainKey == 4 || chainKey == 46688) {
        return null
      }
      const chainVal = chainDetails[1]

      const chainValArray = Object.keys(chainVal).map((key) => [key, chainVal[key]]);

      const anyswapInfoFormatted = chainValArray.map((details) => {
        const key = details[0]

        if(['ltc', 'btc', 'any', 'block', 'sfi', 'frax'].includes(key)) {
          return null
        }

        const val = details[1]

        const sourceChainInfo = this.mapSrcChainInfo(chainKey, key)

        console.log(val.SrcToken.DcrmAddress)

        if (val.SrcToken.DcrmAddress == '0xC564EE9f21Ed8A2d8E7e76c085740d5e4c5FaFbE' || key === 'fantom' || val.SrcToken.DcrmAddress == '0x13B432914A996b0A48695dF9B2d701edA45FF264') {
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
              bigValueThreshold: val.SrcToken.BigValueThreshold,
              tokenMetadata: {
                icon: `/tokens/${(val.PairID === 'fantom' ? 'FTM' : val.SrcToken.Symbol)}.png`,
                address: val.SrcToken.ContractAddress,
                symbol: val.PairID === 'fantom' ? 'FTM' : val.SrcToken.Symbol,
                decimals: val.SrcToken.Decimals,
                name: val.PairID === 'fantom' ? 'Fantom' : val.SrcToken.Name,
                description: `${(val.PairID === 'fantom' ? 'FTM' : val.SrcToken.Symbol)} on ${sourceChainInfo.sourceChainDescription}`
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
              bigValueThreshold: val.DestToken.BigValueThreshold,
              tokenMetadata: {
                icon: `/tokens/${(val.PairID === 'fantom' ? 'FTM' : val.SrcToken.Symbol)}.png`,
                address: val.DestToken.IsDelegateContract ? val.DestToken.DelegateToken : val.DestToken.ContractAddress,
                symbol: val.PairID === 'fantom' ? 'FTM' : val.DestToken.Symbol,
                decimals: val.DestToken.Decimals,
                name: val.PairID === 'fantom' ? 'Fantom' : val.DestToken.Name,
                description: `${(val.PairID === 'fantom' ? 'FTM' : val.DestToken.Symbol)} on ${sourceChainInfo.destinationChainDescription}`
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

          if(val.PairID === asset.pairID && chainKey === asset.chainID && (asset.tokenMetadata.symbol === val.DestToken.Symbol || (asset.tokenMetadata.symbol === 'FTM' && val.DestToken.Symbol === ''))) {
            return {
              id: sourceChainInfo.sourceChainID+'_'+key,
              chainID: sourceChainInfo.sourceChainID,
              pairID: val.PairID,
              symbol: asset.tokenMetadata.symbol === 'FTM' ? 'FTM' : val.SrcToken.Symbol
            }
          } else if (val.PairID === asset.pairID && sourceChainInfo.sourceChainID === asset.chainID && (asset.tokenMetadata.symbol === val.SrcToken.Symbol || (asset.tokenMetadata.symbol === 'FTM' && val.SrcToken.Symbol === ''))) {
            return {
              id: chainKey+'_'+key,
              chainID: chainKey,
              pairID: val.PairID,
              symbol: asset.tokenMetadata.symbol === 'FTM' ? 'FTM' : val.DestToken.Symbol
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

        if(asset.chainID === '250' && asset.pairID === 'fantom') {
          const balanceOf = await web3.eth.getBalance(account.address)

          const balance = BigNumber(balanceOf).div(10**18).toNumber()
          asset.tokenMetadata.balance = balance
        } else if(erc20Address) {
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

  callStatusAPIRepeat = async (fromAsset, toAsset, toAddressValue, fromTXHash) => {
    try {
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
      let callType = ''
      let params = ''

      if(toAsset.chainID === '250' && toAsset.pairID === 'fantom') {
        callType = 'getWithdrawHashStatus/'
        params = `${toAddressValue}/${fromTXHash}/1/FTM/250?pairid=fantom`
      } else if (toAsset.chainID === '1' && toAsset.pairID === 'fantom') {
        callType = 'getHashStatus/'
        params = `${toAddressValue}/${fromTXHash}/1/FTM/250?pairid=fantom`
      } else if (toAsset.chainID == '1') {
        callType = 'getWithdrawHashStatus/'
        params = `${toAddressValue}/${fromTXHash}/${chainID}/${pairID}/1`
      } else {
        callType = 'getHashStatus/'
        params = `${toAddressValue}/${fromTXHash}/${chainID}/${pairID}/1`
      }

      this.setStore({ listener: true })

      while (this.getStore('listener') === true) {
        const statusResult = await fetch(`https://bridgeapi.anyswap.exchange/v2/${callType}${params}`);
        statusJson = await statusResult.json()

        if(statusJson && statusJson.info && statusJson.info.txid && statusJson.info.txid !== '' && statusJson.info.swaptx && statusJson.info.swaptx !== '') {
          //once we have the transfer we can stop listening
          this.setStore({ listener: false })

          const toWeb3 = await stores.accountStore.getReadOnlyWeb3(toAsset.chainID)
          this.createTransactionListener(toWeb3, statusJson.info.swaptx, statusJson.info.txid)
        }

        await this.sleep(1000)
      }
    } catch(ex) {
      console.log(ex)
    }
  }

  createTransactionListener = async (web3, txHash, originalTX) => {
    console.log('creating transaction listener')
    let currentBlock = 0
    let transaction = null
    let shouldCall = true
    while (shouldCall) { //listen up to 10 confirmations
      currentBlock = await web3.eth.getBlockNumber()
      transaction = await web3.eth.getTransaction(txHash)

      console.log(currentBlock)
      console.log(transaction)

      if(transaction) {
        let newTransactions = []
        const transactions = this.getStore('transactions')
        console.log(transactions.some(e => e.transactionHash === transaction.transactionHash))

        if (transactions.some(e => e.transactionHash === transaction.transactionHash)) {
          console.log('TX already exists, updating')
          // append to store transactions[]
          newTransactions = transactions.map((tx) => {
            if(tx.transactionHash === transaction.transactionHash) {
              return transaction
            }
            return tx
          })

          console.log('Confirmations: ', (currentBlock - transaction.blockNumber))

          if(currentBlock - transaction.blockNumber >= 1) {
            shouldCall = false
          }

          this.emitter.emit(TX_CONFIRMED, transaction, (currentBlock - transaction.blockNumber), 'TO')
        } else {
          console.log('TX is new, push')
          //new TX insert into transactions[]
          transactions.push(transaction)
          newTransactions = transactions

          console.log('originalTX ', originalTX)
          this.emitter.emit(TX_RECEIPT, transaction, originalTX, 'TO')
        }

        this.setStore({ transactions: newTransactions })
        //maybe change the sleep duration depending on what chainID it is? 13 seconds for ETH, 3 seconds for FTM
        await this.sleep(1000)
      } else {
        //we dont find the tx for some reason? Try again in a few seconds
        await this.sleep(1000)
      }
    }
  }

  _callContract = (web3, contract, method, params, account, gasPrice, dispatchEvent, payload, callback) => {
    const context = this
    contract.methods[method](...params).send({ from: account.address, gasPrice: web3.utils.toWei(gasPrice, 'gwei') })
      .on('transactionHash', function(hash){
        callback(null, hash)
        context.emitter.emit(TX_HASH, hash, payload.fromAsset, payload.toAsset, payload.amount )
      })
      .on('confirmation', function(confirmationNumber, receipt){
        context.emitter.emit(TX_CONFIRMED, receipt, confirmationNumber)
        if(dispatchEvent && confirmationNumber === 1) {
          context.dispatcher.dispatch({ type: dispatchEvent })
        }
        if(confirmationNumber === 1) {
          context.callStatusAPIRepeat(payload.fromAsset, payload.toAsset, payload.fromAddressValue, receipt.transactionHash)
        }
      })
      .on('receipt', function(receipt) {
        context.emitter.emit(TX_RECEIPT, receipt)
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

  _callContractWait = (web3, contract, method, params, account, gasPrice, dispatchEvent, callback) => {
    const context = this
    contract.methods[method](...params).send({ from: account.address, gasPrice: web3.utils.toWei(gasPrice, 'gwei') })
      .on('transactionHash', function(hash){
        // callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        if(dispatchEvent && confirmationNumber === 1) {
          context.dispatcher.dispatch({ type: dispatchEvent })
        }
      })
      .on('receipt', function(receipt){
        callback(null, receipt.transactionHash)
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
      if(toAssetValue.pairID === 'fantom') {
        chainID = toAssetValue.chainID
        pairID = toAssetValue.pairID
      } else {
        chainID = fromAssetValue.chainID
        pairID = fromAssetValue.pairID
      }
    } else {
      chainID = toAssetValue.chainID
      pairID = toAssetValue.pairID
    }

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
      if(toAssetValue.pairID === 'fantom') {
        chainID = toAssetValue.chainID
        pairID = toAssetValue.pairID
      } else {
        chainID = fromAssetValue.chainID
        pairID = fromAssetValue.pairID
      }
    } else {
      chainID = toAssetValue.chainID
      pairID = toAssetValue.pairID
    }

    try {

      const localStorageRegistration = localStorage.getItem('multichain-register')
      let registerJSON = null

      if(localStorageRegistration && localStorageRegistration !== '') {
        registerJSON = JSON.parse(localStorageRegistration)
      }

      if(registerJSON) {
        if(!(registerJSON[toAddressValue] && registerJSON[toAddressValue][chainID] && registerJSON[toAddressValue][chainID][pairID])) {
          const registerAccountResult = await fetch(`https://bridgeapi.anyswap.exchange/v2/register/${toAddressValue}/${chainID}/${pairID}`);
          const registerAccouontJson = await registerAccountResult.json()

          if(!registerJSON[toAddressValue]) {
            registerJSON[toAddressValue] = {}
          }
          if(!registerJSON[toAddressValue][chainID]) {
            registerJSON[toAddressValue][chainID] = {}
          }
          registerJSON[toAddressValue][chainID][pairID] = registerAccouontJson

          localStorage.setItem('multichain-register', JSON.stringify(registerJSON))
        }
      } else {
        const registerAccountResult = await fetch(`https://bridgeapi.anyswap.exchange/v2/register/${toAddressValue}/${chainID}/${pairID}`);
        const registerAccouontJson = await registerAccountResult.json()

        registerJSON = {}
        registerJSON[toAddressValue] = {}
        registerJSON[toAddressValue][chainID] = {}
        registerJSON[toAddressValue][chainID][pairID] = registerAccouontJson

        localStorage.setItem('multichain-register', JSON.stringify(registerJSON))
      }

    } catch(ex) {
      console.log(ex)
      this.emitter.emit(ERROR, ex)
    }

    if (fromAssetValue.chainID === '1' && toAssetValue.chainID === '250' && pairID == 'fantom')  {
      //check approval first
      const account = await stores.accountStore.getStore('account')
      if(!account) {
        return false
      }

      const web3 = await stores.accountStore.getWeb3Provider()
      if(!web3) {
        return false
      }

      const tokenContract = new web3.eth.Contract(ERC20ABI, fromAssetValue.tokenMetadata.address)

      //get approved amoutn
      const approved = await tokenContract.methods.allowance(account.address, fromAssetValue.contractAddress).call()

      if(BigNumber(approved).div(18**fromAssetValue.tokenMetadata.decimals).gt(fromAmountValue)) {
        return this._nativeToERC(fromAssetValue, toAssetValue, fromAmountValue, fromAddressValue)
      } else {
        const gasPrice = await stores.accountStore.getGasPrice()
        return this._callContractWait(web3, tokenContract, 'approve', [fromAssetValue.contractAddress, MAX_UINT256], account, gasPrice, null, async (err, txHash) => {
          if(err) {
            return this.emitter.emit(ERROR, err);
          }
          return this._nativeToERC(fromAssetValue, toAssetValue, fromAmountValue, fromAddressValue)
        })
      }
    } else if (fromAssetValue.chainID === '250' && toAssetValue.chainID === '1' && pairID == 'fantom') {
      return this._transferNativeToken(fromAssetValue, toAssetValue, fromAddressValue, fromAmountValue)
    } if(fromAssetValue.chainID === '1' && !['BTC', 'LTC', 'BLOCK', 'ANY'].includes(toAssetValue.chainID)) {
      return this._ercToNative(fromAssetValue, toAssetValue, fromAddressValue, toAddressValue, fromAmountValue)
    } else if(toAssetValue.chainID === '1' && !['BTC', 'LTC', 'BLOCK', 'ANY'].includes(fromAssetValue.chainID)) {
      return this._nativeToERC(fromAssetValue, toAssetValue, fromAmountValue, fromAddressValue)
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

    this._callContract(web3, tokenContract, 'transfer', [depositAddress, amountToSend], account, gasPrice, SWAP_RETURN_SWAP_PERFORMED, { fromAsset, toAsset, fromAddressValue, amount, toAddressValue }, async (err, txHash) => {
      if(err) {
        return this.emitter.emit(ERROR, err);
      }

      this.emitter.emit(SWAP_SHOW_TX_STATUS, txHash)

      // const fromWeb3 = await stores.accountStore.getReadOnlyWeb3(fromAsset.chainID)
      // const toWeb3 = await stores.accountStore.getReadOnlyWeb3(toAsset.chainID)
      //
      // const fromCurrentBlock = await fromWeb3.eth.getBlockNumber()
      // const toCurrentBlock = await toWeb3.eth.getBlockNumber()
      //
      // this.setStore({ listener: true })
      // const that = this
      //
      // while(this.getStore('listener') === true) {
      //   await this._getNewTransfers(fromWeb3, toWeb3, fromAsset, toAsset, depositAddress, fromCurrentBlock, toCurrentBlock, fromAddressValue, toAddressValue, '0x0000000000000000000000000000000000000000', txHash,  () => {
      //     this.setStore({ listener: false })
      //   })
      // }
    })
  }

  _getNewTransfers = async (fromWeb3, toWeb3, fromAsset, toAsset, depositAddress, fromCurrentBlock, toCurrentBlock, fromAddressValue, toAddressValue, burnAddress, fromTXHash, callback) => {
    try {
      let direction = 1

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
      let callType = ''
      let params = ''

      if(toAsset.chainID === '250' && toAsset.pairID === 'fantom') {
        callType = 'getWithdrawHashStatus/'
        params = `${toAddressValue}/${fromTXHash}/1/FTM/250?pairid=fantom`
      } else if (toAsset.chainID === '1' && toAsset.pairID === 'fantom') {
        callType = 'getHashStatus/'
        params = `${toAddressValue}/${fromTXHash}/1/FTM/250?pairid=fantom`
      } else if (toAsset.chainID == '1') {
        callType = 'getWithdrawHashStatus/'
        params = `${toAddressValue}/${fromTXHash}/${chainID}/${pairID}/${direction}`
      } else {
        callType = 'getHashStatus/'
        params = `${toAddressValue}/${fromTXHash}/${chainID}/${pairID}/${direction}`
      }

      const statusResult = await fetch(`https://bridgeapi.anyswap.exchange/v2/${callType}${params}`);
      statusJson = await statusResult.json()

      if(this.getStore('listener') === true) {
        this.emitter.emit(SWAP_STATUS_TRANSACTIONS, statusJson)
      }

      if(statusJson && statusJson.info && statusJson.info.txid && statusJson.info.txid !== '') {
        console.log('criteria met')
        let currentBlock = await fromWeb3.eth.blockNumber
        console.log(currentBlock)
        let txBlock = await fromWeb3.eth.getTransaction(statusJson.info.txid).blockNumber
        console.log(txBlock)
        statusJson.info.intitalConfirmations = currentBlock - txBlock
      }
      console.log(statusJson.info.intitalConfirmations)

      if(statusJson && statusJson.info && statusJson.info.txid && statusJson.info.txid !== '' && statusJson.info.swaptx && statusJson.info.swaptx !== '') {
        //once we have the transfer we can stop listening
        if(statusJson.info.confirmations >= 10) {
          callback()
        }
      }
    } catch(ex) {
      console.log(ex)
    }

    await this.sleep(1000)
  }

  sleep = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  _nativeToERC = async (fromAsset, toAsset, amount, fromAddressValue) => {
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

    this._callContract(web3, tokenContract, 'Swapout', [amountToSend, account.address], account, gasPrice, SWAP_RETURN_SWAP_PERFORMED, { fromAsset, toAsset, fromAddressValue, amount }, async (err, txHash) => {
      if(err) {
        return this.emitter.emit(ERROR, err);
      }

      this.emitter.emit(SWAP_SHOW_TX_STATUS, txHash)

      // const fromWeb3 = await stores.accountStore.getReadOnlyWeb3(fromAsset.chainID)
      // const toWeb3 = await stores.accountStore.getReadOnlyWeb3(toAsset.chainID)
      //
      // const fromCurrentBlock = await fromWeb3.eth.getBlockNumber()
      // const toCurrentBlock = await toWeb3.eth.getBlockNumber()
      //
      // this.setStore({ listener: true })
      // const that = this
      //
      // while(this.getStore('listener') === true) {
      //   await this._getNewTransfers(fromWeb3, toWeb3, fromAsset, toAsset, '0x0000000000000000000000000000000000000000', fromCurrentBlock, toCurrentBlock, account.address, account.address, fromAsset.dcrmAddress, txHash, () => {
      //     that.setStore({ listener: false })
      //   })
      // }
    })
  }

  _transferNativeToken = async (fromAsset, toAsset, fromAddressValue, amount) => {
    const account = await stores.accountStore.getStore('account')
    if(!account) {
      return false
    }

    const web3 = await stores.accountStore.getWeb3Provider()
    if(!web3) {
      return false
    }

    const amountToSend = BigNumber(amount).times(10**fromAsset.tokenMetadata.decimals).toFixed(0)
    const gasPrice = await stores.accountStore.getGasPrice()

    const context = this

    web3.eth.sendTransaction({
      from: account.address,
      to: fromAsset.dcrmAddress,
      value: amountToSend,
      gasPrice: web3.utils.toWei(gasPrice, 'gwei'),
    })
    .on('transactionHash', function(hash){
      stores.emitter.emit(TX_HASH, hash, fromAsset, toAsset, amount )
    })
    .on('confirmation', function(confirmationNumber, receipt){
      stores.emitter.emit(TX_CONFIRMED, receipt, confirmationNumber)
      if(confirmationNumber === 1) {
        context.callStatusAPIRepeat(fromAsset, toAsset, fromAddressValue, receipt.transactionHash)
      }
    })
    .on('receipt', function(receipt) {
      stores.emitter.emit(TX_RECEIPT, receipt)
    })
    .on('error', function(error) {
      stores.emitter.emit(ERROR, error);
    })
    .catch((error) => {
      if (!error.toString().includes("-32601")) {
        if(error.message) {
          stores.emitter.emit(ERROR, error.message);
        }
        stores.emitter.emit(ERROR, error);
      }
    })
  }

  getBridgeInfo = async () => {
    try {
      const bridgeInfoResult = await fetch(`https://netapi.anyswap.net/bridge/info`)
      const bridgeInfoJson = await bridgeInfoResult.json()

      const nodeListResult = await fetch(`https://netapi.anyswap.net/nodes/list`)
      const nodeListJson = await nodeListResult.json()

      const bridgeArray = Object.keys(bridgeInfoJson.bridgeList).map((key) => [key, bridgeInfoJson.bridgeList[key]]);
      const bridgeChainsArray = Object.keys(bridgeInfoJson.baseUSD).map((key) => [key, bridgeInfoJson.baseUSD[key]]);
      const nodesArray = Object.keys(nodeListJson.info).map((key) => [key, nodeListJson.info[key]]);

      const totalLocked = bridgeArray.reduce((a, b) => {
        try {
          if(b[1] && b[1].balance && b[1].decimals && b[1].chainId && b[1].markets && Number(b[1].markets)) {
            const balance = BigNumber(b[1].balance).div(10**b[1].decimals).toNumber()
            const baseUSD = bridgeInfoJson.baseUSD[b[1].chainId].market

            return BigNumber(a).plus(BigNumber(balance).times(baseUSD).div(b[1].markets)).toNumber()
          }

          return a
        } catch(ex) {
          console.log(ex)
        }
      }, 0)

      this.setStore({
        totalLocked: totalLocked,
        bridgedAssets: bridgeArray.length,
        bridgeBlockchains: BigNumber(bridgeChainsArray.length).plus(2).toNumber(), // plus 2 for btc/ltc
        nodes: nodesArray.length
      })

      this.emitter.emit(BRIDGE_INFO_RETURNED, bridgeInfoJson)
    } catch(ex) {
      console.log(ex)
    }
  }

  getSwapHistroy = async (payload) => {
    const account = await stores.accountStore.getStore('account')
    if(!account) {
      return false
    }

    try {
      const swapHistoryInFTM = await fetch(`https://bridgeapi.anyswap.exchange/v2/swapin/history/${account.address}/1/250/all?offset=0&limit=100`)
      const swapHistoryInJsonFTM = await swapHistoryInFTM.json()

      const swapHistoryOutFTM = await fetch(`https://bridgeapi.anyswap.exchange/v2/swapout/history/${account.address}/1/250/all?offset=0&limit=100`)
      const swapHistoryOutJsonFTM = await swapHistoryOutFTM.json()

      const swapHistoryIn = await fetch(`https://bridgeapi.anyswap.exchange/v2/swapin/history/${account.address}/250/1/allv2?offset=0&limit=100`)
      const swapHistoryInJson = await swapHistoryIn.json()

      const swapHistoryOut = await fetch(`https://bridgeapi.anyswap.exchange/v2/swapout/history/${account.address}/250/1/allv2?offset=0&limit=100`)
      const swapHistoryOutJson = await swapHistoryOut.json()

      let populatedSwapIn = swapHistoryInJson.info.map((swap) => {
        swap.from = 1
        swap.fromDescription = 'Eth Mainnet'
        swap.fromChain = CHAIN_MAP[1]
        swap.to = 250
        swap.toDescription = 'FTM Mainnet'
        swap.toChain = CHAIN_MAP[250]

        let asset = this.store.swapAssets.filter((asset) => {
          return asset.chainID == 250 && asset.pairID.toLowerCase() === swap.pairid.toLowerCase()
        })

        if(asset[0]) {
          swap.tokenMetadata = asset[0].tokenMetadata
        }

        return swap
      })

      let populatedSwapOut = swapHistoryOutJson.info.map((swap) => {
        swap.from = 250
        swap.fromDescription = 'FTM Mainnet'
        swap.fromChain = CHAIN_MAP[250]
        swap.to = 1
        swap.toDescription = 'Eth Mainnet'
        swap.toChain = CHAIN_MAP[1]

        let asset = this.store.swapAssets.filter((asset) => {
          return asset.chainID == 1 && asset.pairID.toLowerCase() === swap.pairid.toLowerCase()
        })

        if(asset[0]) {
          swap.tokenMetadata = asset[0].tokenMetadata
        }

        return swap
      })

      let populatedSwapInFTM = swapHistoryInJsonFTM.info.map((swap) => {
        swap.from = 250
        swap.fromDescription = 'FTM Mainnet'
        swap.fromChain = CHAIN_MAP[250]
        swap.to = 1
        swap.toDescription = 'Eth Mainnet'
        swap.toChain = CHAIN_MAP[1]

        let asset = this.store.swapAssets.filter((asset) => {
          return asset.chainID == 1 && asset.pairID.toLowerCase() === swap.pairid.toLowerCase()
        })

        if(asset[0]) {
          swap.tokenMetadata = asset[0].tokenMetadata
        }

        return swap
      })

      let populatedSwapOutFTM = swapHistoryOutJsonFTM.info.map((swap) => {
        swap.from = 1
        swap.fromDescription = 'Eth Mainnet'
        swap.fromChain = CHAIN_MAP[1]
        swap.to = 250
        swap.toDescription = 'FTM Mainnet'
        swap.toChain = CHAIN_MAP[250]

        let asset = this.store.swapAssets.filter((asset) => {
          return asset.chainID == 250 && asset.pairID.toLowerCase() === swap.pairid.toLowerCase()
        })

        if(asset[0]) {
          swap.tokenMetadata = asset[0].tokenMetadata
        }

        return swap
      })

      const fullHistory = [...populatedSwapIn, ...populatedSwapOut, ...populatedSwapInFTM, ...populatedSwapOutFTM]

      const history = fullHistory.sort((a, b) => {
        if(a.txtime > b.txtime) {
          return -1
        } else if (a.txtime < b.txtime) {
          return 1
        } else {
          return 0
        }
      })

      this.setStore({ swapHistory: history })

      this.emitter.emit(SWAP_HISTORY_RETURNED, history)
    } catch(ex) {
      console.log(ex)
      this.emitter.emit(ERROR, ex)
    }

  }

  getSwapTokens = async (payload) => {
    try {
      const swapTokensResult = await fetch(`https://gist.githubusercontent.com/andrecronje/94757cd2b1bd054eb3992226859a7562/raw/9a2ae3893671199164781ab6d728e8654ccaf120/anyswap`)
      const swapTokens = await swapTokensResult.text()

      const lines = swapTokens.replace(/\r/g, "").split(/\n/)

      let type = 'unknown'

      const dirtyParse = lines.map((line) => {
        try {
          const first2Chars = line.substring(0, 2)

          // ignore title
          if(first2Chars === '# ') {
            return null
          }
          // set type to subtitle and then return to the next line
          if(first2Chars === '##') {
            type = line.substring(5)
            return null
          }
          //remove empty lines
          if(line.trim() === '') {
            return null
          }

          if(line.startsWith('Name | Symbol')) {
            // table header line, ignroe
            return null
          }

          if(line.startsWith('--- | --- ')) {
            // table header line formatting, ignroe
            return null
          }

          let lineObj = line.split('|')
          lineObj = lineObj.map((obj) => {
            return obj.trim()
          })
          const obj = {
            name: lineObj[0],
            symbol: lineObj[1],
            decimals: lineObj[2],
            srcChainID: lineObj[3],
            destChainID: lineObj[4],
            srcContract: {
              address: this._parseDetails(lineObj[5]).address,
              url: this._parseDetails(lineObj[5]).url
            },
            destContract: {
              address: this._parseDetails(lineObj[6]).address,
              url: this._parseDetails(lineObj[6]).url
            },
            mpc: {
              address: this._parseDetails(lineObj[7]).address,
              url: this._parseDetails(lineObj[7]).url
            },
            logo: {
              address: this._parseDetails(lineObj[8]).address,
              url: this._parseDetails(lineObj[8]).url
            },
            status: lineObj[9],
            chain: type
          }

          return obj
        } catch(ex) {
          console.log(ex)
          console.log(lineObj)
          return null
        }
      }).filter((token) => {
        return token !== null
      })

      this.setStore({ swapTokens: dirtyParse })

      this.emitter.emit(SWAP_TOKENS_RETURNED, history)

    } catch(ex) {
      console.log(ex)
      this.emitter.emit(ERROR, ex)
    }
  }

  _parseDetails = (str) => {
    const address = str.substring(str.indexOf('[')+1, str.indexOf(']'))
    const url = str.substring(str.indexOf('(')+1, str.indexOf(')'))

    return {
      address: address,
      url: url
    }
  }
}

export default Store;
