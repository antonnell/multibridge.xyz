import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import {
  TextField,
  Typography,
  InputAdornment,
  Button,
  MenuItem,
  IconButton,
  Dialog,
  CircularProgress,
  Tooltip
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import InfoIcon from '@material-ui/icons/Info';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import CheckIcon from '@material-ui/icons/Check';
import ToggleButton from '@material-ui/lab/ToggleButton';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

import { withTheme } from '@material-ui/core/styles';

import { formatCurrency, formatAddress, formatCurrencyWithSymbol, formatCurrencySmall } from '../../utils'

import classes from './swap.module.css'

import stores from '../../stores'
import {
  SWAP_UPDATED,
  ERROR,
  CONNECT_WALLET,
  ACCOUNT_CHANGED,
  CHANGE_NETWORK,
  NETWORK_CHANGED,
  CONFIGURE_NETWORK,
  TX_HASH
} from '../../stores/constants'
import BigNumber from 'bignumber.js'

function Setup({ theme, handleNext, swapState, setSwapState }) {

  const router = useRouter()

  const storeSwapAssets = stores.swapStore.getStore('swapAssets')
  const storeAccount = stores.accountStore.getStore('account')

  const [ account, setAccount ] = useState(storeAccount)
  const [ metaMaskChainID, setMetaMaskChainID ] = useState(stores.accountStore.getStore('chainID'))
  const [ chain, setChain ] = useState(stores.accountStore.getStore('selectedChainID'))

  const [ loading, setLoading ] = useState(false)

  const [ fromAmountValue, setFromAmountValue ] = useState(swapState ? swapState.fromAmountValue : '')
  const [ fromAmountError, setFromAmountError ] = useState(false)
  const [ fromAssetValue, setFromAssetValue ] = useState(swapState ? swapState.fromAssetValue : null)
  const [ fromAssetError, setFromAssetError ] = useState(false)
  const [ fromAssetOptions, setFromAssetOptions ] = useState(storeSwapAssets)

  const [ toAmountValue, setToAmountValue ] = useState(swapState ? swapState.toAmountValue : '')
  const [ toAmountError, setToAmountError ] = useState(false)
  const [ toAssetValue, setToAssetValue ] = useState(swapState ? swapState.toAssetValue : null)
  const [ toAssetError, setToAssetError ] = useState(false)
  const [ toAssetOptions, setToAssetOptions ] = useState([])

  useEffect(function() {
    setAccount(storeAccount)
  }, [storeAccount])

  useEffect(function() {
    if(storeSwapAssets && storeSwapAssets.length > 0) {
      let index = 0

      setFromAssetOptions(storeSwapAssets)
      if(!fromAssetValue) {
        setFromAssetValue(storeSwapAssets[index])
        stores.dispatcher.dispatch({ type: CHANGE_NETWORK, content: { network: { chainID: storeSwapAssets[index].chainID } } })
      }

      setToAssetOptions(storeSwapAssets[index].targets)
      if(!toAssetValue) {
        setToAssetValue(storeSwapAssets[index].targets[0])
      }
    }
  }, [storeSwapAssets])

  useEffect(function() {
    const swapUpdated = () => {
      const storeSwapAssets = stores.swapStore.getStore('swapAssets')
      const rawJson = stores.swapStore.getStore('anyswapServerJson')

      setFromAssetOptions(storeSwapAssets)


      if(router.query.src && router.query.dest) {
        const srcChainInfo = rawJson[router.query.src][router.query.pairID]
        const destChainInfo = rawJson[router.query.dest][router.query.pairID]

        let index = 0

        if(srcChainInfo) {
          let searchToken = null
          if(router.query.src === srcChainInfo.SrcToken.chainID) {
            searchToken = srcChainInfo.SrcToken
          } else if (router.query.src === srcChainInfo.DestToken.chainID) {
            searchToken = srcChainInfo.DestToken
          }

          index = storeSwapAssets.findIndex((i) => { return (i.ContractAddress == searchToken.ContractAddress && router.query.src == searchToken.chainID) })
          if(index === -1) {
            index = 0
          }
        } else if (destChainInfo) {
          index = storeSwapAssets.findIndex((i) => { return (i.ContractAddress == destChainInfo.SrcToken.ContractAddress && router.query.src == destChainInfo.SrcToken.chainID) })
          if(index === -1) {
            index = 0
          }
        } else {
          //ignore
        }

        if(!fromAssetValue) {
          setFromAssetValue(storeSwapAssets[index])
          stores.dispatcher.dispatch({ type: CHANGE_NETWORK, content: { network: { chainID: storeSwapAssets[index].chainID } } })
        }

        setChain(storeSwapAssets[index].chainID)

        const targetOption = storeSwapAssets[index].targets

        let targetIndex = 0

        setToAssetOptions(targetOption)
        if(!toAssetValue) {
          if(srcChainInfo) {
            targetIndex = targetOption.findIndex((i) => { return (i.ContractAddress == srcChainInfo.DestToken.ContractAddress) })
            if(targetIndex === -1) {
              targetIndex = 0
            }
          } else if (destChainInfo) {
            targetIndex = targetOption.findIndex((i) => { return (i.ContractAddress == destChainInfo.DestToken.ContractAddress) })
            if(targetIndex === -1) {
              targetIndex = 0
            }
          } else {
            //ignore
          }

          setToAssetValue(targetOption[targetIndex])
        }

        setSwapState({
          fromAmountValue: fromAmountValue,
          fromAssetValue: storeSwapAssets[index],
          toAmountValue: toAmountValue,
          toAssetValue: targetOption[targetIndex],
        })
      }

      // get URL params to set swap assets
      // if(storeSwapAssets && storeSwapAssets.length > 0 && router && router.query.pairID && router.query.src && router.query.dest) {
      //   index = storeSwapAssets.findIndex((i) => { console.log(i);  return (i.PairID.toLowerCase() == router.query.pairID.toLowerCase() && i.chainID == router.query.src) })
      //   if(index === -1) {
      //     index = 0
      //   }
      // }
      // if(!fromAssetValue) {
      //   setFromAssetValue(storeSwapAssets[index])
      //   stores.dispatcher.dispatch({ type: CHANGE_NETWORK, content: { network: { chainID: storeSwapAssets[index].chainID } } })
      // }

      // setChain(storeSwapAssets[index].chainID)
      //
      // const targetOption = storeSwapAssets[index].targets
      //
      // let targetIndex = 0
      //
      // setToAssetOptions(targetOption)
      // if(!toAssetValue) {
      //   // get URL params to set swap assets
      //   if(targetOption && targetOption.length > 0 && router && router.query.pairID && router.query.src && router.query.dest) {
      //     targetIndex = targetOption.findIndex((i) => { return (i.PairID.toLowerCase() == router.query.pairID.toLowerCase() && i.chainID == router.query.dest) })
      //     if(targetIndex === -1) {
      //       targetIndex = 0
      //     }
      //   }
      //
      //   setToAssetValue(targetOption[targetIndex])
      // }
      //
      // setSwapState({
      //   fromAmountValue: fromAmountValue,
      //   fromAssetValue: storeSwapAssets[index],
      //   toAmountValue: toAmountValue,
      //   toAssetValue: targetOption[targetIndex],
      // })
    }

    const errorReturned = () => {
      setLoading(false)
    }

    const accountChanged = () => {
      setAccount(stores.accountStore.getStore('account'))
    }

    const networkChanged = () => {
      setChain(stores.accountStore.getStore('selectedChainID'))
      setMetaMaskChainID(stores.accountStore.getStore('chainID'))
    }

    const txHash = () => {
      setLoading(false)
    }

    stores.emitter.on(SWAP_UPDATED, swapUpdated)
    stores.emitter.on(ERROR, errorReturned)
    stores.emitter.on(ACCOUNT_CHANGED, accountChanged)
    stores.emitter.on(NETWORK_CHANGED, networkChanged)
    stores.emitter.on(TX_HASH, txHash)

    return () => {
      stores.emitter.removeListener(SWAP_UPDATED, swapUpdated)
      stores.emitter.removeListener(ERROR, errorReturned)
      stores.emitter.removeListener(ACCOUNT_CHANGED, accountChanged)
      stores.emitter.removeListener(NETWORK_CHANGED, networkChanged)
      stores.emitter.removeListener(TX_HASH, txHash)
    }
  },[]);

  const handleConnectWallet = () => {
    stores.emitter.emit(CONNECT_WALLET)
  }

  const toHex = (num) => {
    return '0x'+parseInt(num).toString(16)
  }

  const handleConfigureNetwork = async () => {

    if(chain == 1) {
    stores.emitter.emit(CONFIGURE_NETWORK)
    } else {
      const web3Provder = await stores.accountStore.getWeb3Provider()

      const chainMap = stores.accountStore.getStore('chainIDMapping')
      const theChain = chainMap[chain]

      const params = {
        chainId: toHex(theChain.chainID), // A 0x-prefixed hexadecimal string
        chainName: theChain.name,
        nativeCurrency: {
          name: theChain.symbol,
          symbol: theChain.symbol, // 2-6 characters long
          decimals: theChain.decimals,
        },
        rpcUrls: [theChain.rpcURLdisplay],
        blockExplorerUrls: [theChain.explorer]
      }

      web3Provder.eth.getAccounts((error, accounts) => {

        if(!accounts || accounts.length === 0) {
          return stores.emitter.emit(ERROR, 'Connect your account in MetaMask to add a chain')
        }

        window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [params, accounts[0]],
        })
        .then((result) => {
          stores.accountStore.setStore({ selectedChainID: chain })
        })
        .catch((error) => {
          stores.emitter.emit(ERROR, error.message ? error.message : error)
          console.log(error)
        });
      })
    }
  }

  const onAssetSelect = (type, value) => {
    console.log(value)
    if(type === 'From') {
      setFromAssetValue(value)
      stores.dispatcher.dispatch({ type: CHANGE_NETWORK, content: { network: { chainID: value.chainID } } })

      setToAssetOptions(value.targets)
      setToAssetValue(value.targets[0])

      calculateReceiveAmount(fromAmountValue, value, value.targets[0])
    } else {
      setToAssetValue(value)

      calculateReceiveAmount(fromAmountValue, fromAssetValue, value)
    }
  }

  const fromAmountChanged = (event) => {
    setFromAmountValue(event.target.value)

    calculateReceiveAmount(event.target.value, fromAssetValue, toAssetValue)
  }

  const toAmountChanged = (event) => {
  }

  const calculateReceiveAmount = (amount, from, to) => {
    let receive = 0
    let fee = 0
    if(amount && amount !== '' && !isNaN(amount)) {
      fee = BigNumber(amount).times(from.SwapFeeRate).toNumber()
      if(fee > from.MaximumSwapFee) {
        fee = from.MaximumSwapFee
      } else if (fee < from.MinimumSwapFee) {
        fee = from.MinimumSwapFee
      }

      receive = BigNumber(amount).minus(fee).toNumber()
      if(receive < 0) {
        receive = 0
      }
    }

    setToAmountValue(receive)

    setSwapState({
      fromAmountValue: amount,
      fromAssetValue: from,
      toAmountValue: receive,
      toAssetValue: to,
    })
  }

  const onNext = () => {
    setFromAmountError(false)
    setFromAssetError(false)
    setToAssetError(false)

    let error = false

    if(!fromAmountValue || fromAmountValue === '' || isNaN(fromAmountValue)) {
      setFromAmountError('From amount is required')
      error = true
    } else {
      if(!fromAssetValue.tokenMetadata.balance || isNaN(fromAssetValue.tokenMetadata.balance) || BigNumber(fromAssetValue.tokenMetadata.balance).lte(0))  {
        setFromAmountError('Invalid balance')
        error = true
      } else if(BigNumber(fromAmountValue).lt(0)) {
        setFromAmountError('Invalid amount')
        error = true
      } else if(fromAssetValue && BigNumber(fromAmountValue).lt(fromAssetValue.MinimumSwap)) {
        setFromAmountError(`Less than min swap amount ${fromAssetValue.MinimumSwap}`)
        error = true
      } else if (fromAssetValue && BigNumber(fromAmountValue).gt(fromAssetValue.MaximumSwap)) {
        setFromAmountError(`Greater than max swap amount ${fromAssetValue.MaximumSwap}`)
        error = true
      } else if (fromAssetValue && BigNumber(fromAmountValue).gt(fromAssetValue.tokenMetadata.balance)) {
        setFromAmountError(`Greater than your available balance`)
        error = true
      }
    }

    if(!fromAssetValue || fromAssetValue === null) {
      setFromAssetError('From asset is required')
      error = true
    }

    if(!toAssetValue || toAssetValue === null) {
      setFromAssetError('To asset is required')
      error = true
    }

    if(!error) {
      setLoading(true)
      handleNext({
        fromAmountValue: fromAmountValue,
        fromAssetValue: fromAssetValue,
        toAmountValue: toAmountValue,
        toAssetValue: toAssetValue,
      })
    }
  }

  const setBalance100 = () => {
    setFromAmountValue(fromAssetValue.tokenMetadata.balance)

    calculateReceiveAmount(fromAssetValue.tokenMetadata.balance, fromAssetValue, toAssetValue)
  }

  const swapAssets = () => {
    let from = fromAssetValue
    setFromAssetValue(toAssetValue)
    stores.dispatcher.dispatch({ type: CHANGE_NETWORK, content: { network: { chainID: toAssetValue.chainID } } })

    setToAssetOptions(toAssetValue.targets)
    setToAssetValue(from)

    calculateReceiveAmount(fromAmountValue, toAssetValue, from)
  }

  const renderMassiveInput = (type, amountValue, amountError, amountChanged, assetValue, assetError, assetOptions, onAssetSelect) => {
    const isDark = theme.palette.type === 'dark'

    return (
      <div className={ classes.textField}>
        <div className={ classes.inputTitleContainer }>
          <div className={ classes.inputTitle }>
            <Typography variant='h5' noWrap className={ classes.inputTitleWithIcon }>{ type }</Typography>
          </div>
          <div className={ classes.inputBalance }>
            <Typography variant='h5' noWrap onClick={ () => {
              if(type === 'From') {
                setBalance100()
              }
            }}>
              { (assetValue && assetValue.tokenMetadata.balance) ?
                formatCurrency(assetValue.tokenMetadata.balance) + ' ' + assetValue.tokenMetadata.symbol :
                ''
              }
            </Typography>
          </div>
        </div>
        <div className={ `${classes.massiveInputContainer} ${ !isDark && classes.whiteBackground } ${ (amountError || assetError) && classes.error }` }>
          <div className={ classes.massiveInputAssetSelect }>
            <AssetSelect type={type} value={ assetValue } assetOptions={ assetOptions } onSelect={ onAssetSelect } />
          </div>
          <div className={ classes.massiveInputAmount }>
            <TextField
              placeholder='0.00'
              fullWidth
              error={ amountError }
              helperText={ amountError }
              value={ amountValue }
              onChange={ amountChanged }
              disabled={ loading || type === 'To' }
              InputProps={{
                className: classes.largeInput
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  const renderTooltip = () => {
    return (
      <div className={ classes.swapInfoContainer }>
        <div className={ classes.swapInfo }>
          <div className={ classes.swapDirectionHead }>
            <Typography variant='h1'>{ (swapState && swapState.fromAssetValue) ? swapState.fromAssetValue.tokenMetadata.symbol : '' }</Typography>
            <div className={ classes.swapDirection }>
              <div className={ classes.assetSelectMenuItem }>
                <div className={ `${classes.displayDualIconContainerSmall} ${classes.marginRightNone}` }>
                  <img
                    className={ classes.displayAssetIconSmall }
                    alt=""
                    src={ (swapState && swapState.fromAssetValue) ? swapState.fromAssetValue.tokenMetadata.icon : '' }
                    height='60px'
                    onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
                  />
                  <img
                    className={ classes.displayChainIconSmall }
                    alt=""
                    src={ (swapState && swapState.fromAssetValue) ? `/blockchains/${swapState.fromAssetValue.chainMetadata.icon}` : '' }
                    height='30px'
                    width='30px'
                    onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
                  />
                </div>
              </div>
              <ArrowRightAltIcon className={ classes.rightArrow } />
              <div className={ classes.assetSelectMenuItem }>
                <div className={ `${classes.displayDualIconContainerSmall} ${classes.marginRightNone}` }>
                  <img
                    className={ classes.displayAssetIconSmall }
                    alt=""
                    src={ (swapState && swapState.toAssetValue) ? swapState.toAssetValue.tokenMetadata.icon : '' }
                    height='60px'
                    onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
                  />
                  <img
                    className={ classes.displayChainIconSmall }
                    alt=""
                    src={ (swapState && swapState.toAssetValue) ? `/blockchains/${swapState.toAssetValue.chainMetadata.icon}` : '' }
                    height='30px'
                    width='30px'
                    onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={ classes.swapInfoRow }>
            <Typography color='textSecondary'>Max Swap Amount </Typography>
            <Typography>{ formatCurrencySmall(swapState && swapState.fromAssetValue ? swapState.fromAssetValue.MaximumSwap : 0) } { swapState && swapState.fromAssetValue ? swapState.fromAssetValue.tokenMetadata.symbol : '' }</Typography>
          </div>
          <div className={ classes.swapInfoRow }>
            <Typography color='textSecondary'>Min Swap Amount</Typography>
            <Typography>{ formatCurrencySmall(swapState && swapState.fromAssetValue ? swapState.fromAssetValue.MinimumSwap : 0) } { swapState && swapState.fromAssetValue ? swapState.fromAssetValue.tokenMetadata.symbol : '' }</Typography>
          </div>
          <div className={ classes.swapInfoRow }>
            <Typography color='textSecondary'>Swap Fee</Typography>
            <Typography>{ formatCurrencySmall(swapState && swapState.fromAssetValue ? (swapState.fromAssetValue.SwapFeeRate*100) : 0) }%</Typography>
          </div>
          <div className={ classes.swapInfoRow }>
            <Typography color='textSecondary'>Max Fee Amount</Typography>
            <Typography>{ formatCurrencySmall(swapState && swapState.fromAssetValue ? swapState.fromAssetValue.MaximumSwapFee : 0) } { swapState && swapState.fromAssetValue ? swapState.fromAssetValue.tokenMetadata.symbol : '' }</Typography>
          </div>
          <div className={ classes.swapInfoRow }>
            <Typography color='textSecondary'>Min Fee Amount</Typography>
            <Typography>{ formatCurrencySmall(swapState && swapState.fromAssetValue ? swapState.fromAssetValue.MinimumSwapFee : 0) } { swapState && swapState.fromAssetValue ? swapState.fromAssetValue.tokenMetadata.symbol : '' }</Typography>
          </div>
          <div className={ classes.swapInfoRow }>
            <Typography color='textSecondary' className={ classes.flexy }>Deposits <Typography color={ 'textPrimary' } className={ classes.inlineText }>> {formatCurrencySmall(swapState && swapState.fromAssetValue ? swapState.fromAssetValue.BigValueThreshold : 0)} {(swapState && swapState.fromAssetValue && swapState.fromAssetValue.tokenMetadata) ? swapState && swapState.fromAssetValue.tokenMetadata.symbol : ''} </Typography> could take up to <Typography color='textPrimary' className={ classes.inlineText }> 12 hours</Typography></Typography>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={ classes.swapInputs }>
      { renderMassiveInput('From', fromAmountValue, fromAmountError, fromAmountChanged, fromAssetValue, fromAssetError, fromAssetOptions, onAssetSelect) }
      <div className={ classes.swapIconContainer }>
        <SwapVertIcon className={ classes.swapIcon } onClick={ swapAssets }/>
      </div>
      { renderMassiveInput('To', toAmountValue, toAmountError, toAmountChanged, toAssetValue, toAssetError, toAssetOptions, onAssetSelect) }
      <Tooltip interactive title={ renderTooltip() } placement='left-end'>
        <div className={ classes.limitsFlex }>
          <InfoIcon className={ classes.infoIcon } /> <Typography>View Limits</Typography>
        </div>
      </Tooltip>
      {
        (!account || !account.address) && (
          <Button
            className={ classes.actionButton }
            size='large'
            fullWidth
            disableElevation
            variant='contained'
            color='primary'
            onClick={ handleConnectWallet }
            >
            <Typography variant='h5'>Connect Wallet</Typography>
          </Button>
        )
      }
      {
        (account && account.address && chain === metaMaskChainID) && (
          <Button
            className={ classes.actionButton }
            size='large'
            fullWidth
            disableElevation
            variant='contained'
            color='primary'
            onClick={ onNext }
            disabled={ loading }
            >
            { loading && <CircularProgress size={20} /> }
            { !loading && <Typography variant='h5'>{ 'Transfer' }</Typography>}
          </Button>
        )
      }
      {
        account && account.address && chain !== metaMaskChainID && (
          <Button
            className={ classes.actionButton }
            size='large'
            fullWidth
            disableElevation
            variant='contained'
            color='primary'
            onClick={ handleConfigureNetwork }
            >
            <Typography variant='h5'>Connect to Network</Typography>
          </Button>
        )
      }
    </div>
  )
}

function AssetSelect({ type, value, assetOptions, onSelect }) {

  const [ open, setOpen ] = useState(false);
  const [ search, setSearch ] = useState('')
  const [ withBalance, setWithBalance ] = useState(type === 'From' ? true : false)

  const openSearch = () => {
    setOpen(true)
    setSearch('')
  };

  const onSearchChanged = (event) => {
    setSearch(event.target.value)
  }

  const onLocalSelect = (type, asset) => {
    setOpen(false)
    onSelect(type, asset)
  }

  const onClose = () => {
    setOpen(false)
  }

  const renderAssetOption = (type, asset) => {
    return (
      <MenuItem val={ asset.id } key={ asset.id } className={ classes.assetSelectMenu } onClick={ () => { onLocalSelect(type, asset) } }>
        <div className={ classes.assetSelectMenuItem }>
          <div className={ classes.displayDualIconContainerSmall }>
            <img
              className={ classes.displayAssetIconSmall }
              alt=""
              src={ asset ? asset.tokenMetadata.icon : '' }
              height='60px'
              onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
            />
            <img
              className={ classes.displayChainIconSmall }
              alt=""
              src={ asset ? `/blockchains/${asset.chainMetadata.icon}` : '' }
              height='30px'
              width='30px'
              onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
            />
          </div>
        </div>
        <div className={ classes.assetSelectIconName }>
          <Typography variant='h5'>{ asset ? asset.tokenMetadata.symbol : '' }</Typography>
          <Typography variant='subtitle1' color='textSecondary'>{ asset ? asset.chainMetadata.name : '' }</Typography>
        </div>
        <div className={ classes.assetSelectBalance}>
          <Typography variant='h5'>{ (asset && asset.tokenMetadata.balance) ? formatCurrency(asset.tokenMetadata.balance) : '0.00' }</Typography>
          <Typography variant='subtitle1' color='textSecondary'>{ 'Balance' }</Typography>
        </div>
      </MenuItem>
    )
  }

  return (
    <React.Fragment>
      <div className={ classes.displaySelectContainer } onClick={ () => { openSearch() } }>
        <div className={ classes.assetSelectMenuItem }>
          <div className={ classes.displayDualIconContainer }>
            <img
              className={ classes.displayAssetIcon }
              alt=""
              src={ value ? value.tokenMetadata.icon : '' }
              height='100px'
              onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
            />
            <img
              className={ classes.displayChainIcon }
              alt=""
              src={ value ? `/blockchains/${value.chainMetadata.icon}` : '' }
              height='40px'
              width='40px'
              onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
            />
          </div>
        </div>
      </div>
      <Dialog onClose={ onClose } aria-labelledby="simple-dialog-title" open={ open } >
        <div className={ classes.searchContainer }>
          <div className={ classes.searchInline }>
            <TextField
              autoFocus
              variant="outlined"
              fullWidth
              placeholder="ETH, CRV, ..."
              value={ search }
              onChange={ onSearchChanged }
              InputProps={{
                startAdornment: <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>,
              }}
            />
            <ToggleButton
              value="check"
              color='primary'
              className={ classes.withBalanceToggle }
              selected={withBalance}
              onChange={() => {
                setWithBalance(!withBalance);
              }}
            >
              <AccountBalanceWalletIcon />
            </ToggleButton>
          </div>
          <div className={ classes.assetSearchResults }>
            {
              assetOptions ? assetOptions.filter((asset) => {
                if(withBalance) {
                  return BigNumber(asset.tokenMetadata.balance).gt(0)
                }

                return true
              }).filter((asset) => {
                if(search && search !== '') {
                  return asset.tokenMetadata.symbol.toLowerCase().includes(search.toLowerCase()) ||
                    asset.tokenMetadata.name.toLowerCase().includes(search.toLowerCase())
                } else {
                  return true
                }
              }).map((asset) => {
                return renderAssetOption(type, asset)
              }) : []
            }
          </div>
        </div>
      </Dialog>
    </React.Fragment>
  )
}

export default withTheme(Setup)
