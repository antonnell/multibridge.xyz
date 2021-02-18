import React, { useState, useEffect } from 'react';
import {
  TextField,
  Typography,
  InputAdornment,
  Button,
  MenuItem,
  Paper,
  IconButton,
  CircularProgress,
  Dialog,
  Fade
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab'
import {
  withStyles,
  withTheme,
} from '@material-ui/core/styles';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CropFreeIcon from '@material-ui/icons/CropFree';
import SearchIcon from '@material-ui/icons/Search';

import BigNumber from 'bignumber.js'
import Skeleton from '@material-ui/lab/Skeleton';
import { formatCurrency, formatAddress, formatCurrencyWithSymbol } from '../../utils'

import QRCode from 'qrcode.react'

import classes from './swap.module.css'

import stores from '../../stores'
import {
  ERROR,
  SWAP_UPDATED,
  SWAP_CONFIRM_SWAP,
  SWAP_DEPOSIT_ADDRESS_RETURNED,
  CHANGE_NETWORK,
  NETWORK_CHANGED,
  ACCOUNT_CHANGED,
  CONNECT_WALLET,
  CONFIGURE_NETWORK,
  SWAP_RETURN_DEPOSIT_ADDRESS
} from '../../stores/constants'

const HugeInput = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      padding: '80px 24px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none'
    },
    '& .MuiInputBase-input': {
      textAlign: 'center',
      height: '78.25px',
    },
    '& .MuiFormHelperText-contained': {
      textAlign: 'center',
      position: 'absolute',
      width: '100%',
      bottom: '60px',
    }
  },
})(TextField);

function Swap({ theme }) {
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const storeAccount = stores.accountStore.getStore('account')

  const [ loading, setLoading ] = useState(false)
  const [ currentScreen, setCurrentScreen ] = useState('setup') //setup, confirm, depositAddress, submitTX, waitTX, confirmedTX

  const [ swapFee, setSwapFee ] = useState(null)

  const [ account, setAccount ] = useState(storeAccount)
  const [ swapAssets, setSwapAssets ] = useState(stores.swapStore.getStore('swapAssets'))
  const [ receiveAmount, setReceiveAmount ] = useState('')

  const [ fromAssetValue, setFromAssetValue ] = useState(null)
  const [ fromAsset, setFromAsset ] = useState(null)
  const [ fromAssetAmount, setFromAssetAmount ] = useState('')
  const [ fromAssetError, setFromAssetError ] = useState(false)

  const [ toAsset, setToAsset ] = useState(null)
  const [ toAssetError, setToAssetError ] = useState(false)

  const [ metaMaskChainID, setMetaMaskChainID ] = useState(stores.accountStore.getStore('chainID'))
  const [ chain, setChain ] = useState(useState(stores.accountStore.getStore('selectedChainID')))

  const [ receiveAddress, setReceiveAddress ] = useState(storeAccount ? storeAccount.address : '')
  const [ receiveAddressError, setReceiveAddressError ] = useState(false)

  const [ depositInfo, setDepositInfo ] = useState(null)
  const [ depositAddress, setDepositAddress ] = useState(null)
  const [ qrCodeOpen, setQRCodeOpen ] = useState(false)

  const [anchorEl, setAnchorEl] = useState(null);
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  const [ search, setSearch ] = useState('')

  const handleConnectWallet = () => {
    stores.emitter.emit(CONNECT_WALLET)
  }

  const handleConfigureNetwork = () => {
    stores.emitter.emit(CONFIGURE_NETWORK)
  }

  const handleNext = () => {
    setFromAssetError(false)
    setToAssetError(false)
    setReceiveAddressError(false)

    let error = false

    if(!fromAssetAmount || fromAssetAmount === '' || isNaN(fromAssetAmount)) {
      setFromAssetError(true)
      error = true
    }

    if(!fromAsset || fromAsset === null) {
      setFromAssetError(true)
      error = true
    }

    if(!toAsset || toAsset === null) {
      setToAssetError(true)
      error = true
    }

    if(!receiveAddress || receiveAddress === '') {
      setReceiveAddressError(true)
      error = true
    } else {
      //check receving address validation somehow
    }

    if(!error) {
      switch (currentScreen) {
        case 'setup':
          const newScreen = 'confirm'
          setCurrentScreen(newScreen)
          break;
        case 'confirm':
          stores.dispatcher.dispatch({ type: SWAP_CONFIRM_SWAP, content: { fromAsset: fromAsset, toAsset: toAsset, receiveAddress: receiveAddress, amount: fromAssetAmount } })
          setLoading(true)
          break;
        default:

      }
    }
  }

  const handleBack = () => {
    setLoading(false)

    let newScreen = ''
    switch (currentScreen) {
      case 'confirm':
        newScreen = 'setup'
        break;
      case 'depositAddress':
        newScreen = 'confirm'
        break;
      default:
    }

    setCurrentScreen(newScreen)
  }

  useEffect(function() {
    const swapUpdated = () => {
      const storeSwapAssets = stores.swapStore.getStore('swapAssets')
      const storeSelectedChainID = stores.accountStore.getStore('selectedChainID')

      setMetaMaskChainID(stores.accountStore.getStore('chainID'))
      setSwapAssets(storeSwapAssets)

      let index = 0
      if(storeSelectedChainID != null) {
        index = storeSwapAssets.findIndex(asset => asset.chainID === storeSelectedChainID)
      }

      setChain(storeSwapAssets[index].chainID)

      setFromAsset(storeSwapAssets[index])

      const targetOption = swapAssets.filter((asset) => {
        return storeSwapAssets[index].targets.map((as) => { return as.id }).includes(asset.id)
      })

      setToAsset(targetOption[0])
    }

    const networkChanged = () => {
      setChain(stores.accountStore.getStore('selectedChainID'))
      setMetaMaskChainID(stores.accountStore.getStore('chainID'))
    }

    const accountChanged = () => {
      setAccount(stores.accountStore.getStore('account'))
    }

    const getDepositAddress = () => {
      setLoading(false)
      setDepositInfo(stores.swapStore.getStore('depositInfo'))
      setCurrentScreen('depositAddress')
    }

    const errorReturned = () => {
      setLoading(false)
    }

    const depositAddressReturned = (address) => {
      setLoading(false)
      setDepositAddress(address)
      setCurrentScreen('depositAddress')
    }

    stores.emitter.on(SWAP_UPDATED, swapUpdated)
    stores.emitter.on(NETWORK_CHANGED, networkChanged)
    stores.emitter.on(ACCOUNT_CHANGED, accountChanged)
    stores.emitter.on(SWAP_DEPOSIT_ADDRESS_RETURNED, getDepositAddress)
    stores.emitter.on(ERROR, errorReturned)

    stores.emitter.on(SWAP_RETURN_DEPOSIT_ADDRESS, depositAddressReturned)

    return () => {
      stores.emitter.removeListener(SWAP_UPDATED, swapUpdated)
      stores.emitter.removeListener(NETWORK_CHANGED, networkChanged)
      stores.emitter.removeListener(ACCOUNT_CHANGED, accountChanged)
      stores.emitter.removeListener(SWAP_DEPOSIT_ADDRESS_RETURNED, getDepositAddress)
      stores.emitter.removeListener(ERROR, errorReturned)

      stores.emitter.removeListener(SWAP_RETURN_DEPOSIT_ADDRESS, depositAddressReturned)
    }
  },[]);

  const onFromAssetChange = (event, newVal) => {
    setFromAsset(newVal)

    if(newVal) {
      const targetOption = swapAssets.filter((asset) => {
        return newVal.targets.map((as) => { return as.id }).includes(asset.id)
      })

      setToAsset(targetOption[0])
      let chainID = getRequiredChain(newVal, targetOption[0])
      stores.dispatcher.dispatch({ type: CHANGE_NETWORK, content: { network: { chainID: chainID } } })
    }

    calculateReceiveAmount(fromAssetAmount)
  }

  const getRequiredChain = (from, to) => {
    let requiredChain = '1'
    if(['BTC', 'LTC', 'BLOCK', 'ANY'].includes(from.chainID)) {
      requiredChain = to.chainID
    } else if(['BTC', 'LTC', 'BLOCK', 'ANY'].includes(to.chainID)) {
      requiredChain = from.chainID
    } else if (from.chainID !== '1') {
      requiredChain = from.chainID
    }

    /*

      else if (from.chainID === '1') {
       requiredChain = to.chainID
     } else if (to.chainID === '1') {
       requiredChain = from.chainID
     } else {
       console.log("I dont know")
       console.log(from)
       console.log(to)
     }

    */

    return requiredChain
  }

  const onToAssetChange = (event, newVal) => {
    setToAsset(newVal)

    let chainID = getRequiredChain(fromAsset, newVal)
    stores.dispatcher.dispatch({ type: CHANGE_NETWORK, content: { network: { chainID: chainID } } })

    calculateReceiveAmount(fromAssetAmount)
  }

  const onReceiveAddressChanged = (event) => {
    setReceiveAddress(event.target.value)
  }

  const calculateReceiveAmount = (amount) => {

    let receive = 0
    let fee = 0
    if(amount && amount !== '' && !isNaN(amount)) {
      fee = BigNumber(amount).times(fromAsset.swapFeeRate).toNumber()
      if(fee > fromAsset.maximumSwapFee) {
        fee = fromAsset.maximumSwapFee
      } else if (fee < fromAsset.minimumSwapFee) {
        fee = fromAsset.minimumSwapFee
      }
      receive = BigNumber(amount).minus(fee).toNumber()
      if(receive < 0) {
        receive = 0
      }
    }

    setSwapFee(fee)
    setReceiveAmount(receive)
  }

  const onFromAssetAmountChanged = (event) => {
    setFromAssetError(false)
    setFromAssetAmount(event.target.value)

    calculateReceiveAmount(event.target.value)
  }

  const setFromAssetAmountPercent = (percent) => {
    const value = BigNumber(asset.tokenMetadata.balance).times(percent).div(100).toFixed(asset.tokenMetadata.decimals, BigNumber.ROUND_DOWN)
    setFromAssetAmount(value)
  }

  const onCopy = (event, val) => {
    event.stopPropagation();
    navigator.clipboard.writeText(val).then(() => {

    });
  }

  const onGenerateQR = (event, val) => {
    event.stopPropagation()
    setQRCodeOpen(!qrCodeOpen)
  }

  const renderAssetOption = (type, asset) => {
    return (
      <MenuItem val={ asset.id } key={ asset.id } className={ classes.assetSelectMenu } onClick={ () => { onSearchAssetClicked(type, asset) } }>
        <div className={ classes.assetSelectMenuItem }>
          <div className={ classes.assetSelectIcon }>
            <img
              alt=""
              src={ asset.tokenMetadata.icon }
              height="30px"
            />
          </div>
          <div className={ classes.assetSelectIconName }>
            <Typography variant='h5'>{ asset ? asset.tokenMetadata.symbol : '' }</Typography>
            <Typography variant='subtitle1' color='textSecondary'>{ asset ? asset.tokenMetadata.description : '' }</Typography>
          </div>
        </div>
      </MenuItem>
    )
  }

  const openSearch = (type) => {
    if(type === 'From') {
      setFromOpen(true)
    }
    if(type === 'To') {
      setToOpen(true)
    }
  };

  const onSearchChanged = (event) => {
    setSearch(event.target.value)
  }

  const closeSearch = () => {
    setFromOpen(false)
    setToOpen(false)
  };

  const onSearchAssetClicked = (type, asset) => {
    if(type === 'From') {
      onFromAssetChange(null, asset)
    }
    if(type === 'To') {
      onToAssetChange(null, asset)
    }
    setFromOpen(false)
    setToOpen(false)
  }

  const renderAssetSelect = (type) => {
    let value = ''

    switch (type) {
      case 'From':
        value = fromAsset
        break;
      case 'To':
        value = toAsset
        break;
    }

    return (
      <React.Fragment>
        <div className={ classes.displaySelectContainer } onClick={ () => { openSearch(type) } }>
          <div className={ classes.assetSelectMenuItem }>
            <div className={ classes.assetSelectIcon }>
              <img
                alt=""
                src={ value ? value.tokenMetadata.icon : '' }
                height="30px"
              />
            </div>
            <div className={ classes.assetSelectIconName }>
              <Typography variant='h5'>{ value ? value.tokenMetadata.symbol : '' }</Typography>
              <Typography variant='subtitle1' color='textSecondary'>{ value ? value.tokenMetadata.description : '' }</Typography>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }

  let size = "hugeInputFontSizeLarge";
  let chars = parseInt(fromAssetAmount.length)+parseInt(fromAsset ? fromAsset.tokenMetadata.symbol.length : 0)
  if((fromAsset ? fromAsset.tokenMetadata.symbol.length : 0) >= 6) {
    chars = chars + 1
  }

  if (chars > 8 && chars <= 10) {
    size = "hugeInputFontSizeMedium";
  } else if (chars > 10 && chars <= 13) {
    size = "hugeInputFontSizeSmall";
  } else if (chars > 13) {
    size = "hugeInputFontSizeSmallest";
  }

  const renderSetup = () => {
    return (
      <div>
        <div className={ classes.swapInputs }>
          <HugeInput
            variant="outlined"
            fullWidth
            placeholder={ `0.00` }
            value={ fromAssetAmount }
            error={ fromAssetError }
            onChange={ onFromAssetAmountChanged }
            InputProps={{
              className: classes[size],
              endAdornment: <InputAdornment position="end">
                <Typography color='textSecondary' className={ classes[size]}>{ fromAsset ? fromAsset.tokenMetadata.symbol : '' }</Typography>
              </InputAdornment>,
            }}
          />

          <div className={ classes.textField }>
            <div className={ classes.inputTitleContainer }>
              <div className={ classes.inputTitle }>
                <Typography variant='h5' noWrap className={ classes.inputTitleWithIcon }>I have</Typography>
              </div>
              <div className={ classes.inputBalance }>
                <Typography variant='h5' noWrap >
                  { (fromAsset && fromAsset.tokenMetadata.balance) ?
                    formatCurrency(fromAsset.tokenMetadata.balance) + ' ' + fromAsset.tokenMetadata.symbol :
                    ''
                  }
                </Typography>
              </div>
            </div>
            { renderAssetSelect('From') }
          </div>
          <div className={ classes.textField }>
            <div className={ classes.inputTitleContainer }>
              <div className={ classes.inputTitle }>
                <Typography variant='h5' noWrap className={ classes.inputTitleWithIcon }>I want</Typography>
              </div>
              <div className={ classes.inputBalance }>
                <Typography variant='h5' noWrap >
                  { (toAsset && toAsset.tokenMetadata.balance) ?
                    formatCurrency(toAsset.tokenMetadata.balance) + ' ' + toAsset.tokenMetadata.symbol :
                    ''
                  }
                </Typography>
              </div>
            </div>
            { renderAssetSelect('To') }
          </div>
          <div className={ classes.textField }>
            <div className={ classes.inputTitleContainer }>
              <div className={ classes.inputTitle }>
                <Typography variant='h5' noWrap className={ classes.inputTitleWithIcon }>Your receiving address</Typography>
              </div>
            </div>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="0x123..."
              value={ receiveAddress }
              error={ receiveAddressError }
              onChange={ onReceiveAddressChanged }
              InputProps={{
                startAdornment: <InputAdornment position="start">
                  <div className={ classes.assetInputIcon }><AccountBalanceWalletOutlinedIcon /></div>
                </InputAdornment>,
              }}
            />
          </div>
          <div className={ classes.textField }>
            <div className={ classes.inputTitleContainer }>
              <div className={ classes.inputTitle }>
                <Typography variant='h5' noWrap className={ classes.inputTitleWithIcon }>You will receive</Typography>
              </div>
            </div>
            <div className={ classes.displayInputContainer }>
              <div className={ classes.displayInput }>
                <div>
                  <div className={ classes.assetSelectIcon }>
                    <img
                      alt=""
                      src={ toAsset ? toAsset.tokenMetadata.icon : '' }
                      height="30px"
                    />
                  </div>
                </div>
                <Typography className={ classes.displayInputContent }>{ receiveAmount }</Typography>
                <Typography color='textSecondary' >{ toAsset ? toAsset.tokenMetadata.symbol : '' }</Typography>
              </div>
            </div>
          </div>
          <div className={ classes.actionButton }>
            {
              (!account || !account.address) && (
                <Button
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
              account && account.address && chain !== metaMaskChainID && (
                <Button
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
            {
              account && account.address && chain === metaMaskChainID && (
                <Button
                  size='large'
                  fullWidth
                  disableElevation
                  variant='contained'
                  color='primary'
                  onClick={ handleNext }
                  disabled={ loading }
                  >
                  { loading && <CircularProgress size={20} /> }
                  { !loading && <Typography variant='h5'>{ 'Next' }</Typography>}
                </Button>
              )
            }
          </div>
        </div>
      </div>
    )
  }

  /*

  <div className={ classes.swapInfo }>
    <div className={ classes.swapInfoRow }>
      <Typography color='textSecondary'>Maximum Swap Amount </Typography>
      <Typography>{ formatCurrency(asset ? asset.maximumSwap : 0) } { asset ? asset.tokenMetadata.symbol : '' }</Typography>
    </div>
    <div className={ classes.swapInfoRow }>
      <Typography color='textSecondary'>Minimum Swap Amount</Typography>
      <Typography>{ formatCurrency(asset ? asset.minimumSwap : 0) } { asset ? asset.tokenMetadata.symbol : '' }</Typography>
    </div>
    <div className={ classes.swapInfoRow }>
      <Typography color='textSecondary'>Maximum Fee Amount</Typography>
      <Typography>{ formatCurrency(asset ? asset.maximumSwapFee : 0) } { asset ? asset.tokenMetadata.symbol : '' }</Typography>
    </div>
    <div className={ classes.swapInfoRow }>
      <Typography color='textSecondary'>Minimum Fee Amount</Typography>
      <Typography>{ formatCurrency(asset ? asset.minimumSwapFee : 0) } { asset ? asset.tokenMetadata.symbol : '' }</Typography>
    </div>
    <div className={ classes.swapInfoRow }>
      <Typography color='textSecondary'>Fee Percent </Typography>
      <Typography>{ asset ? (asset.swapFeeRate*100) : 0 }%</Typography>
    </div>
  </div>

  */

  const renderConfirm = () => {
    return (
      <div>
        <div className={ classes.header }>
          <div className={ classes.backButton }>
            <Button
              color={ theme.palette.type === 'light' ? 'primary' : 'secondary' }
              onClick={ handleBack }
              disableElevation
              >
              <ArrowBackIcon fontSize={ 'large' } />
            </Button>
          </div>
          <Typography>{ 'Confirm Swap' }</Typography>
          <div className={ classes.backButton }>
          </div>
        </div>
        <div className={ classes.swapInputs }>
          <div className={ classes.hugeInputPreview }>
            <Typography className={ classes[size] }>{ fromAssetAmount } { fromAsset ? fromAsset.tokenMetadata.symbol : '' }</Typography>
          </div>
          <div className={ classes.textField }>
            <div className={ classes.displaySummaryContainer }>
              <div className={ classes.displayInput }>
                <Typography className={ classes.displayInputContent } color='textSecondary'>{ 'Swapping' }</Typography>
                <Typography className={ classes.displayInputContent } align='right'>
                  <div className={ classes.assetSelectIcon }>
                    <img
                      alt=""
                      src={ fromAsset.tokenMetadata.icon }
                      height="30px"
                    />
                  </div>
                  { fromAsset ? fromAsset.tokenMetadata.symbol : '' }
                </Typography>
              </div>
              <div className={ classes.displayInputGap}></div>
              <div className={ classes.displayInput }>
                <Typography className={ classes.displayInputContent } color='textSecondary'>Destination address</Typography>
                <Typography className={ classes.displayInputContent } align='right'>{ formatAddress(receiveAddress, 'short') }</Typography>
              </div>
              <div className={ classes.displayInputGap}></div>
              <div className={ classes.displayInput }>
                <Typography className={ classes.displayInputContent } color='textSecondary'>Total fees</Typography>
                <Typography className={ classes.displayInputContent } align='right'>
                  <div className={ classes.assetSelectIcon }>
                    <img
                      alt=""
                      src={ fromAsset.tokenMetadata.icon }
                      height="30px"
                    />
                  </div>
                  { swapFee } { fromAsset ? fromAsset.tokenMetadata.symbol : '' }
                </Typography>
              </div>
              <div className={ classes.displayInputGap}></div>
              <div className={ classes.displayInput }>
                <Typography className={ classes.displayInputContent } color='textSecondary'>You receive</Typography>
                <Typography className={ classes.displayInputContent } align='right'>
                  <div className={ classes.assetSelectIcon }>
                    <img
                      alt=""
                      src={ toAsset.tokenMetadata.icon }
                      height="30px"
                    />
                  </div>
                  { receiveAmount } { toAsset ? toAsset.tokenMetadata.symbol : '' }
                </Typography>
              </div>
            </div>
          </div>
        </div>
        <div className={ classes.actionButton }>
          <Button
            fullWidth
            disableElevation
            variant='contained'
            color='primary'
            size='large'
            onClick={ handleNext }
            disabled={ loading }
            >
            { loading && <CircularProgress size={20} /> }
            { !loading && <Typography variant='h5'>{ 'Confirm' }</Typography> }
          </Button>
        </div>
      </div>
    )
  }

  const renderDepositAddress = () => {
    return (
      <div>
        <div className={ classes.header }>
          <div className={ classes.backButton }>
            <Button
              color={ theme.palette.type === 'light' ? 'primary' : 'secondary' }
              onClick={ handleBack }
              disableElevation
              >
              <ArrowBackIcon fontSize={ 'large' } />
            </Button>
          </div>
          <Typography>{ 'Deposit' }</Typography>
          <div className={ classes.backButton }>
          </div>
        </div>
        <div className={ classes.swapInputs }>
          {
            qrCodeOpen && <div className={ classes.qrPreview }>
              <QRCode value={ depositAddress } />
            </div>
          }
          {
            !qrCodeOpen && <div className={ classes.hugeInputPreview }>
              <Typography className={ classes[size] }>{ fromAssetAmount } { fromAsset ? fromAsset.tokenMetadata.symbol : '' }</Typography>
            </div>
          }
          <div className={ classes.textField }>
            <Typography variant='h2' align='center' className={ classes.textFlex }>Deposit { fromAssetAmount } { fromAsset.tokenMetadata.symbol }
              <img
                alt=""
                src={ toAsset.tokenMetadata.icon }
                height="20px"
                style={{ marginLeft: '6px', marginRight: '6px' }}
              />
            to
            </Typography>
            <div className={ classes.addressSummaryContainer }>
              <Typography className={ classes.addressField }>{ depositAddress }</Typography>
              <div className={ classes.flexy }>
                <Button onClick={ (event) => { onCopy(event, depositAddress) } }>
                  <FileCopyIcon className={ classes.assetSelectIcon } /> Copy address
                </Button>
                <Button onClick={ (event) => { onGenerateQR(event, depositAddress) } }>
                  <CropFreeIcon className={ classes.assetSelectIcon } /> Generate QR
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Paper elevation={ 2 } className={ classes.swapContainer }>
      { currentScreen === 'setup' && renderSetup() }
      { currentScreen === 'confirm' && renderConfirm() }
      { currentScreen === 'depositAddress' && renderDepositAddress() }
      <Dialog onClose={closeSearch} aria-labelledby="simple-dialog-title" open={fromOpen || toOpen} >
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
              swapAssets ? swapAssets.filter((asset) => {
                if(search && search !== '') {
                  return asset.tokenMetadata.symbol.toLowerCase().includes(search.toLowerCase()) ||
                    asset.tokenMetadata.description.toLowerCase().includes(search.toLowerCase()) ||
                    asset.tokenMetadata.name.toLowerCase().includes(search.toLowerCase())
                } else {
                  return true
                }
              }).filter((asset) => {
                if(fromAsset && toOpen) {
                  return fromAsset.targets.map((as) => { return as.id }).includes(asset.id)
                } else {
                  return true
                }
              }).map((asset) => {
                return renderAssetOption(fromOpen ? 'From' : 'To', asset)
              }) : []
            }
          </div>
        </div>
      </Dialog>
    </Paper>
  )

}

export default withTheme(Swap)
