import React, { useState, useEffect } from 'react';
import {
  TextField,
  Typography,
  InputAdornment,
  Button,
  MenuItem,
  IconButton,
  Dialog
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { withTheme } from '@material-ui/core/styles';

import { formatCurrency, formatAddress, formatCurrencyWithSymbol } from '../../utils'

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
} from '../../stores/constants'
import BigNumber from 'bignumber.js'


function Setup({ theme, handleNext, setSwapState }) {
  const storeSwapAssets = stores.swapStore.getStore('swapAssets')
  const storeAccount = stores.accountStore.getStore('account')

  const [ account, setAccount ] = useState(storeAccount)
  const [ metaMaskChainID, setMetaMaskChainID ] = useState(stores.accountStore.getStore('chainID'))
  const [ chain, setChain ] = useState(useState(stores.accountStore.getStore('selectedChainID')))

  const [ loading, setLoading ] = useState(false)

  const [ fromAmountValue, setFromAmountValue ] = useState('')
  const [ fromAmountError, setFromAmountError ] = useState(false)
  const [ fromAddressValue, setFromAddressValue ] = useState('')
  const [ fromAddressError, setFromAddressError ] = useState(false)
  const [ fromAssetValue, setFromAssetValue ] = useState(null)
  const [ fromAssetError, setFromAssetError ] = useState(false)
  const [ fromAssetOptions, setFromAssetOptions ] = useState([])

  const [ toAmountValue, setToAmountValue ] = useState('')
  const [ toAmountError, setToAmountError ] = useState(false)
  const [ toAddressValue, setToAddressValue ] = useState('')
  const [ toAddressError, setToAddressError ] = useState(false)
  const [ toAssetValue, setToAssetValue ] = useState(null)
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

      if(!['BTC', 'LTC', 'BLOCK',  'ANY' ].includes(storeSwapAssets[index].chainID)) {
        setFromAddressValue(account ? account.address : '')
      }

      const targetOption = storeSwapAssets.filter((asset) => {
        return storeSwapAssets[index].targets.map((as) => { return as.id }).includes(asset.id)
      })

      setToAssetOptions(targetOption)
      if(!toAssetValue) {
        setToAssetValue(targetOption[0])
      }

      if(!['BTC', 'LTC', 'BLOCK',  'ANY' ].includes(targetOption[0].chainID)) {
        setToAddressValue(account ? account.address : '')
      }
    }
  }, [storeSwapAssets])

  useEffect(function() {
    const swapUpdated = () => {
      const storeSwapAssets = stores.swapStore.getStore('swapAssets')
      let index = 0

      setFromAssetOptions(storeSwapAssets)
      if(!fromAssetValue) {
        setFromAssetValue(storeSwapAssets[index])
        stores.dispatcher.dispatch({ type: CHANGE_NETWORK, content: { network: { chainID: storeSwapAssets[index].chainID } } })
      }

      if(!['BTC', 'LTC', 'BLOCK',  'ANY' ].includes(storeSwapAssets[index].chainID)) {
        setFromAddressValue(account ? account.address : '')
      }

      setChain(storeSwapAssets[index].chainID)

      const targetOption = storeSwapAssets.filter((asset) => {
        return storeSwapAssets[index].targets.map((as) => { return as.id }).includes(asset.id)
      })

      setToAssetOptions(targetOption)
      if(!toAssetValue) {
        setToAssetValue(targetOption[0])
      }

      if(!['BTC', 'LTC', 'BLOCK',  'ANY' ].includes(targetOption[0].chainID)) {
        setToAddressValue(account ? account.address : '')
      }
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

    stores.emitter.on(SWAP_UPDATED, swapUpdated)
    stores.emitter.on(ERROR, errorReturned)
    stores.emitter.on(ACCOUNT_CHANGED, accountChanged)
    stores.emitter.on(NETWORK_CHANGED, networkChanged)

    return () => {
      stores.emitter.removeListener(SWAP_UPDATED, swapUpdated)
      stores.emitter.removeListener(ERROR, errorReturned)
      stores.emitter.removeListener(ACCOUNT_CHANGED, accountChanged)
      stores.emitter.removeListener(NETWORK_CHANGED, networkChanged)
    }
  },[]);

  const handleConnectWallet = () => {
    stores.emitter.emit(CONNECT_WALLET)
  }

  const handleConfigureNetwork = () => {
    stores.emitter.emit(CONFIGURE_NETWORK)
  }

  const onAssetSelect = (type, value) => {
    if(type === 'From') {
      setFromAssetValue(value)
      stores.dispatcher.dispatch({ type: CHANGE_NETWORK, content: { network: { chainID: value.chainID } } })

      if(!['BTC', 'LTC', 'BLOCK',  'ANY' ].includes(value.chainID)) {
        setFromAddressValue(account ? account.address : '')
      } else {
        setFromAddressValue('')
      }


      const targetOption = fromAssetOptions.filter((asset) => {
        return value.targets.map((as) => { return as.id }).includes(asset.id)
      })

      setToAssetOptions(targetOption)
      setToAssetValue(targetOption[0])

      if(!['BTC', 'LTC', 'BLOCK',  'ANY' ].includes(targetOption[0].chainID)) {
        setToAddressValue(account ? account.address : '')
      } else {
        setToAddressValue('')
      }
    } else {
      setToAssetValue(value)

      if(!['BTC', 'LTC', 'BLOCK',  'ANY' ].includes(value.chainID)) {
        setToAddressValue(account ? account.address : '')
      } else {
        setToAddressValue('')
      }
    }
  }

  const fromAmountChanged = (event) => {
    setFromAmountValue(event.target.value)

    calculateReceiveAmount(event.target.value)
  }

  const toAmountChanged = (event) => {
  }

  const fromAddressChanged = (event) => {
    setFromAddressValue(event.target.value)
  }

  const toAddressChanged = (event) => {
    setToAddressValue(event.target.value)
  }

  const calculateReceiveAmount = (amount) => {
    let receive = 0
    let fee = 0
    if(amount && amount !== '' && !isNaN(amount)) {
      fee = BigNumber(amount).times(fromAssetValue.swapFeeRate).toNumber()
      if(fee > fromAssetValue.maximumSwapFee) {
        fee = fromAssetValue.maximumSwapFee
      } else if (fee < fromAssetValue.minimumSwapFee) {
        fee = fromAssetValue.minimumSwapFee
      }
      receive = BigNumber(amount).minus(fee).toNumber()
      if(receive < 0) {
        receive = 0
      }
    }

    setToAmountValue(receive)
  }

  const onNext = () => {
    setFromAmountError(false)
    setFromAssetError(false)
    setFromAddressError(false)
    setToAssetError(false)
    setToAddressError(false)

    let error = false

    if(!fromAmountValue || fromAmountValue === '' || isNaN(fromAmountValue)) {
      setFromAmountError(true)
      error = true
    }

    if(!fromAssetValue || fromAssetValue === null) {
      setFromAssetError(true)
      error = true
    }

    if(!toAssetValue || toAssetValue === null) {
      setToAssetError(true)
      error = true
    }

    if(!toAddressValue || toAddressValue === '') {
      setToAddressError(true)
      error = true
    } else {
      //check receving address validation somehow
    }

    if(!fromAddressValue || fromAddressValue === '') {
      setFromAddressError(true)
      error = true
    } else {
      //check receving address validation somehow
    }

    if(!error) {
      setSwapState({
        fromAmountValue: fromAmountValue,
        fromAssetValue: fromAssetValue,
        fromAddressValue: fromAddressValue,
        toAmountValue: toAmountValue,
        toAssetValue: toAssetValue,
        toAddressValue: toAddressValue,
      })
      handleNext() // probably need to pass values to main container
    }
  }

  const renderMassiveInput = (type, amountValue, amountError, amountChanged, addressValue, addressError, addressChanged, assetValue, assetError, assetOptions, onAssetSelect) => {
    const isDark = theme.palette.type === 'dark'
    return (
      <div className={ classes.textField}>
        <div className={ classes.inputTitleContainer }>
          <div className={ classes.inputTitle }>
            <Typography variant='h5' noWrap className={ classes.inputTitleWithIcon }>{ type }</Typography>
          </div>
          <div className={ classes.inputBalance }>
            <Typography variant='h5' noWrap >
              { (assetValue && assetValue.tokenMetadata.balance) ?
                formatCurrency(assetValue.tokenMetadata.balance) + ' ' + assetValue.tokenMetadata.symbol :
                ''
              }
            </Typography>
          </div>
        </div>
        <div className={ `${classes.massiveInputContainer} ${ !isDark && classes.whiteBackground }` }>
          <div className={ classes.massiveInputAssetSelect }>
            <AssetSelect type={type} value={ assetValue } assetOptions={ assetOptions } onSelect={ onAssetSelect } />
          </div>
          <div className={ classes.massiveInputAmount }>
            <TextField
              placeholder='0.00'
              fullWidth
              error={ amountError }
              value={ amountValue }
              onChange={ amountChanged }
              disabled={ loading || type === 'To' }
              InputProps={{
                className: classes.largeInput
              }}
            />
          </div>
          <div className={ classes.massiveInputAddress }>
            <TextField
              fullWidth
              placeholder={ `${type} address` }
              error={ addressError }
              value={ addressValue }
              onChange={ addressChanged }
              disabled={ !['BTC', 'LTC', 'BLOCK',  'ANY' ].includes(assetValue ? assetValue.chainID : '') }
              InputProps={{
                className: classes.addressInput
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={ classes.swapInputs }>
      { renderMassiveInput('From', fromAmountValue, fromAmountError, fromAmountChanged, fromAddressValue, fromAddressError, fromAddressChanged, fromAssetValue, fromAssetError, fromAssetOptions, onAssetSelect) }
      { renderMassiveInput('To', toAmountValue, toAmountError, toAmountChanged, toAddressValue, toAddressError, toAddressChanged, toAssetValue, toAssetError, toAssetOptions, onAssetSelect) }
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
            { !loading && <Typography variant='h5'>{ 'Next' }</Typography>}
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
            />
            <img
              className={ classes.displayChainIconSmall }
              alt=""
              src={ asset ? `/blockchains/${asset.icon}` : '' }
              height='30px'
              width='30px'
            />
          </div>
        </div>
        <div className={ classes.assetSelectIconName }>
          <Typography variant='h5'>{ asset ? asset.tokenMetadata.symbol : '' }</Typography>
          <Typography variant='subtitle1' color='textSecondary'>{ asset ? asset.tokenMetadata.description : '' }</Typography>
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
            />
            <img
              className={ classes.displayChainIcon }
              alt=""
              src={ value ? `/blockchains/${value.icon}` : '' }
              height='40px'
              width='40px'
            />
          </div>
        </div>
      </div>
      <Dialog onClose={ onClose } aria-labelledby="simple-dialog-title" open={ open } >
        <div className={ classes.searchContainer }>
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
          <div className={ classes.assetSearchResults }>
            {
              assetOptions ? assetOptions.filter((asset) => {
                if(search && search !== '') {
                  return asset.tokenMetadata.symbol.toLowerCase().includes(search.toLowerCase()) ||
                    asset.tokenMetadata.description.toLowerCase().includes(search.toLowerCase()) ||
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
