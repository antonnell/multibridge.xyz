import React, { useState, useEffect } from 'react';
import {
  TextField,
  Typography,
  InputAdornment,
  Button,
  MenuItem,
  Paper,
  Tabs,
  Tab,
  IconButton,
  CircularProgress
} from '@material-ui/core';
import {
  withStyles,
  withTheme,
} from '@material-ui/core/styles';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CropFreeIcon from '@material-ui/icons/CropFree';
import BigNumber from 'bignumber.js'
import Skeleton from '@material-ui/lab/Skeleton';
import { formatCurrency, formatAddress, formatCurrencyWithSymbol } from '../../utils'

import QRCode from 'qrcode.react'

import classes from './swap.module.css'

import stores from '../../stores'
import {
  ERROR,
  SWAP_UPDATED,
  SWAP_GET_DEPOSIT_ADDRESS,
  SWAP_DEPOSIT_ADDRESS_RETURNED,
  CHANGE_NETWORK,
  NETWORK_CHANGED,
  ACCOUNT_CHANGED,
  CONNECT_WALLET,
  CONFIGURE_NETWORK
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

const HugeInputAssetSelect = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      padding: '0px',
    },
  },
})(TextField);

function Swap({ theme }) {
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const storeAccount = stores.accountStore.getStore('account')
  const storeSwapChains = stores.swapStore.getStore('swapChains')

  const [ loading, setLoading ] = useState(false)
  const [ tabValue, setTabValue ] = useState(0)
  const [ currentScreen, setCurrentScreen ] = useState('setup') //setup, confirm, submitTX, waitTX, confirmedTX

  const [ swapFee, setSwapFee ] = useState(null)
  const [ asset, setAsset ] = useState(null)
  const [ receiveAsset, setReceiveAsset ] = useState(null)

  const [ account, setAccount ] = useState(storeAccount)
  const [ swapChains, setSwapChains ] = useState(storeSwapChains)
  const [ receiveAmount, setReceiveAmount ] = useState('')

  const [ fromAsset, setFromAsset ] = useState('')
  const [ fromAssetObject, setFromAssetObject ] = useState(null)
  const [ fromAssetAmount, setFromAssetAmount ] = useState('')
  const [ fromAssetError, setFromAssetError ] = useState(false)

  const [ metaMaskChainID, setMetaMaskChainID ] = useState(stores.accountStore.getStore('chainID'))

  const [ chain, setChain ] = useState(useState(stores.accountStore.getStore('selectedChainID')))
  const [ chainObject, setChainObject ] = useState(null)

  const [ receiveAddress, setReceiveAddress ] = useState(storeAccount ? storeAccount.address : '')
  const [ receiveAddressError, setReceiveAddressError ] = useState(false)

  const [ depositInfo, setDepositInfo ] = useState(null)
  const [ qrCodeOpen, setQRCodeOpen ] = useState(false)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);

    if(fromAssetObject) {
      setAsset(newValue === 0 ? fromAssetObject.sourceAsset : fromAssetObject.destinationAsset)
      setReceiveAsset(newValue === 0 ? fromAssetObject.destinationAsset : fromAssetObject.sourceAsset)
    }
  };

  const handleConnectWallet = () => {
    stores.emitter.emit(CONNECT_WALLET)
  }

  const handleConfigureNetwork = () => {
    stores.emitter.emit(CONFIGURE_NETWORK)
  }

  const handleNext = () => {
    setFromAssetError(false)
    setReceiveAddressError(false)

    let error = false

    if(!fromAssetAmount || fromAssetAmount === '' || isNaN(fromAssetAmount)) {
      setFromAssetError(true)
      error = true
    }

    if(!fromAsset || fromAsset === '') {
      setFromAssetError(true)
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
          stores.dispatcher.dispatch({ type: SWAP_GET_DEPOSIT_ADDRESS, content: { receiveAccount: receiveAddress, chainID: chain, coinType: tabValue === 0 ? receiveAsset.key : asset.key } })
          setLoading(true)
          break;
        default:

      }
    }
  }

  const handleBack = () => {
    let newScreen = ''
    switch (currentScreen) {
      case 'confirm':
        newScreen = 'setup'
        break;
      case 'submitTX':
        newScreen = 'confirm'
        break;
      default:

    }

    setCurrentScreen(newScreen)
  }

  useEffect(function() {
    const swapUpdated = () => {
      const storeSwapChains = stores.swapStore.getStore('swapChains')
      const storeSelectedChainID = stores.accountStore.getStore('selectedChainID')
      const storeChainID = stores.accountStore.getStore('chainID')
      setSwapChains(storeSwapChains)

      let index = 0
      if(storeSelectedChainID != null) {
        index = storeSwapChains.findIndex(chain => chain.key === storeSelectedChainID)
      }

      setChainObject(storeSwapChains[index])
      setChain(storeSwapChains[index].key)
      setMetaMaskChainID(storeChainID)

      const pair = storeSwapChains[index].pairs[0]

      setFromAssetObject(pair)
      setFromAsset(pair.key)

      setAsset(tabValue === 0 ? pair.sourceAsset : pair.destinationAsset)
      setReceiveAsset(tabValue === 0 ? pair.destinationAsset : pair.sourceAsset)
    }

    const networkChanged = () => {
      const storeChainID = stores.accountStore.getStore('chainID')
      const storeSelectedChainID = stores.accountStore.getStore('selectedChainID')
      const theOption = swapChains.filter(chain => chain.key === storeSelectedChainID)
      setChainObject(theOption[0])
      setChain(storeSelectedChainID)
      setMetaMaskChainID(storeChainID)

      const pair = theOption[0].pairs[0]

      setFromAssetObject(pair)
      setFromAsset(pair.key)

      setAsset(tabValue === 0 ? pair.sourceAsset : pair.destinationAsset)
      setReceiveAsset(tabValue === 0 ? pair.destinationAsset : pair.sourceAsset)
    }

    const accountChanged = () => {
      setAccount(stores.accountStore.getStore('account'))
    }

    const getDepositAddress = () => {
      setLoading(false)
      setDepositInfo(stores.swapStore.getStore('depositInfo'))
      setCurrentScreen('submitTX')
    }

    const errorReturned = () => {
      setLoading(false)
    }

    stores.emitter.on(SWAP_UPDATED, swapUpdated)
    stores.emitter.on(NETWORK_CHANGED, networkChanged)
    stores.emitter.on(ACCOUNT_CHANGED, accountChanged)
    stores.emitter.on(SWAP_DEPOSIT_ADDRESS_RETURNED, getDepositAddress)
    stores.emitter.on(ERROR, errorReturned)

    return () => {
      stores.emitter.removeListener(SWAP_UPDATED, swapUpdated)
      stores.emitter.removeListener(NETWORK_CHANGED, networkChanged)
      stores.emitter.removeListener(ACCOUNT_CHANGED, accountChanged)
      stores.emitter.removeListener(SWAP_DEPOSIT_ADDRESS_RETURNED, getDepositAddress)
      stores.emitter.removeListener(ERROR, errorReturned)
    }
  },[]);

  const onFromAssetChange = (event) => {
    const theOption = chainObject.pairs.filter(pair => pair.key === event.target.value)

    setFromAssetObject(theOption[0])
    setFromAsset(event.target.value)
    if(theOption[0]) {
      setAsset(tabValue === 0 ? theOption[0].sourceAsset : theOption[0].destinationAsset)
      setReceiveAsset(tabValue === 0 ? theOption[0].destinationAsset : theOption[0].sourceAsset)
    }

    calculateReceiveAmount(fromAssetAmount)
  }

  const onChainChange = (event) => {
    const theOption = swapChains.filter(chain => chain.key === event.target.value)
    setChainObject(theOption[0])
    setChain(event.target.value)

    // also set swapAsset

    const pair = theOption[0].pairs[0]

    setFromAssetObject(pair)
    setFromAsset(pair.key)
    if(pair) {
      setAsset(tabValue === 0 ? pair.sourceAsset : pair.destinationAsset)
      setReceiveAsset(tabValue === 0 ? pair.destinationAsset : pair.sourceAsset)
    }

    calculateReceiveAmount(fromAssetAmount)

    stores.dispatcher.dispatch({ type: CHANGE_NETWORK, content: { network: { chainID:  event.target.value } } })
  }

  const onReceiveAddressChanged = (event) => {
    setReceiveAddress(event.target.value)
  }

  const calculateReceiveAmount = (amount) => {

    let receive = 0
    let fee = 0
    if(amount && amount !== '' && !isNaN(amount)) {
      fee = BigNumber(amount).times(asset.swapFeeRate).toNumber()
      if(fee > asset.maximumSwapFee) {
        fee = asset.maximumSwapFee
      } else if (fee < asset.minimumSwapFee) {
        fee = asset.minimumSwapFee
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
    setQRCodeOpen(true)
  }

  const renderChainSelect = () => {
    return (
      <HugeInputAssetSelect
        select
        value={ chain }
        onChange={ onChainChange }
        SelectProps={{
          native: false
        }}
        fullWidth
        placeholder={ 'Select' }
        variant='outlined'
      >
        { swapChains ? swapChains.map(renderChainOption) : <div></div> }
      </HugeInputAssetSelect>
    )
  }

  const renderChainOption = (option) => {
    return (
      <MenuItem key={option.key} value={option.key} className={ classes.assetSelectMenu }>
        <div className={ classes.assetSelectMenuItem }>
          <div className={ classes.assetSelectIcon }>
            <img
              alt=""
              src={ option.icon }
              height="30px"
            />
          </div>
          <div className={ classes.assetSelectIconName }>
            <Typography variant='h5'>{ option.symbol }</Typography>
            <Typography variant='subtitle1' color='textSecondary'>{ option.name }</Typography>
          </div>
        </div>
      </MenuItem>
    )
  }

  const renderAssetSelect = (type) => {
    let value = ''
    let onChange = null

    switch (type) {
      case 'From':
        value = fromAsset
        onChange = onFromAssetChange
        break;
    }

    return (
      <HugeInputAssetSelect
        select
        value={ value }
        onChange={ onChange }
        SelectProps={{
          native: false
        }}
        fullWidth
        placeholder={ 'Select' }
        variant='outlined'
      >
        { chainObject && chainObject.pairs ? chainObject.pairs.map(renderAssetOption) : <div></div> }
      </HugeInputAssetSelect>
    )
  }

  const renderAssetOption = (option) => {
    const asset = tabValue === 0 ? option.sourceAsset : option.destinationAsset

    return (
      <MenuItem key={option.key} value={option.key} className={ classes.assetSelectMenu }>
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

  let size = "hugeInputFontSizeLarge";
  let chars = parseInt(fromAssetAmount.length)+parseInt(asset ? asset.tokenMetadata.symbol.length : 0)
  if((asset ? asset.tokenMetadata.symbol.length : 0) >= 6) {
    chars = chars + 2
  }

  if (chars > 7 && chars <= 9) {
    size = "hugeInputFontSizeMedium";
  } else if (chars > 9 && chars <= 12) {
    size = "hugeInputFontSizeSmall";
  } else if (chars > 12) {
    size = "hugeInputFontSizeSmallest";
  }

  const renderSetup = () => {
    return (
      <div>
        <Tabs
          variant='fullWidth'
          indicatorColor='primary'
          value={ tabValue }
          onChange={ handleTabChange }
        >
          <Tab label="Mint" />
          <Tab label="Release" />
        </Tabs>
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
                <Typography color='textSecondary' className={ classes[size]}>{ asset ? asset.tokenMetadata.symbol : '' }</Typography>
              </InputAdornment>,
            }}
          />
          <div className={ classes.textField }>
            <div className={ classes.inputTitleContainer }>
              <div className={ classes.inputTitle }>
                <Typography variant='h5' noWrap className={ classes.inputTitleWithIcon }>Blockchain</Typography>
              </div>
            </div>
            { renderChainSelect() }
          </div>
          <div className={ classes.textField }>
            <div className={ classes.inputTitleContainer }>
              <div className={ classes.inputTitle }>
                <Typography variant='h5' noWrap className={ classes.inputTitleWithIcon }>Swap Asset</Typography>
              </div>
            </div>
            { renderAssetSelect('From') }
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
              value={ tabValue === 1 ? account.address : receiveAddress }
              error={ receiveAddressError }
              onChange={ onReceiveAddressChanged }
              disabled={ tabValue === 1 }
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
                      src={ receiveAsset ? receiveAsset.tokenMetadata.icon : '' }
                      height="30px"
                    />
                  </div>
                </div>
                <Typography className={ classes.displayInputContent }>{ receiveAmount }</Typography>
                <Typography color='textSecondary' >{ receiveAsset ? receiveAsset.tokenMetadata.symbol : '' }</Typography>
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
                  <Typography variant='h5'>Configure Network</Typography>
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
          <Typography>{ tabValue === 0 ? 'Mint' : 'Release' }</Typography>
          <div className={ classes.backButton }>
          </div>
        </div>
        <div className={ classes.swapInputs }>
          <div className={ classes.hugeInputPreview }>
            <Typography className={ classes[size] }>{ fromAssetAmount } { asset ? asset.tokenMetadata.symbol : '' }</Typography>
          </div>
          <div className={ classes.textField }>
            <div className={ classes.displaySummaryContainer }>
              <div className={ classes.displayInput }>
                <Typography className={ classes.displayInputContent } color='textSecondary'>{ tabValue === 0 ? 'Minting' : 'Releasing' }</Typography>
                <Typography className={ classes.displayInputContent } align='right'>
                  <div className={ classes.assetSelectIcon }>
                    <img
                      alt=""
                      src={ asset.tokenMetadata.icon }
                      height="30px"
                    />
                  </div>
                  { tabValue === 0 && (receiveAsset ? receiveAsset.tokenMetadata.symbol : '') }
                  { tabValue === 1 && (asset ? asset.tokenMetadata.symbol : '') }
                </Typography>
              </div>
              <div className={ classes.displayInputGap}></div>
              <div className={ classes.displayInput }>
                <Typography className={ classes.displayInputContent } color='textSecondary'>Destination address</Typography>
                <Typography className={ classes.displayInputContent } align='right'>{ tabValue === 0 ? formatAddress(receiveAddress, 'short') : formatAddress(account.address, 'short')  }</Typography>
              </div>
              <div className={ classes.displayInputGap}></div>
              <div className={ classes.displayInput }>
                <Typography className={ classes.displayInputContent } color='textSecondary'>Total fees</Typography>
                <Typography className={ classes.displayInputContent } align='right'>
                  <div className={ classes.assetSelectIcon }>
                    <img
                      alt=""
                      src={ asset.tokenMetadata.icon }
                      height="30px"
                    />
                  </div>
                  { swapFee } { asset ? asset.tokenMetadata.symbol : '' }
                </Typography>
              </div>
              <div className={ classes.displayInputGap}></div>
              <div className={ classes.displayInput }>
                <Typography className={ classes.displayInputContent } color='textSecondary'>You receive</Typography>
                <Typography className={ classes.displayInputContent } align='right'>
                  <div className={ classes.assetSelectIcon }>
                    <img
                      alt=""
                      src={ asset.tokenMetadata.icon }
                      height="30px"
                    />
                  </div>
                  { receiveAmount } { receiveAsset ? receiveAsset.tokenMetadata.symbol : '' }
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

  const renderSubmit = () => {
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
          <Typography>{ tabValue === 0 ? 'Mint' : 'Release' }</Typography>
          <div className={ classes.backButton }>
          </div>
        </div>
        <div className={ classes.swapInputs }>
          {
            qrCodeOpen && <div className={ classes.qrPreview }>
              <QRCode value={ depositInfo.P2shAddress } />
            </div>
          }
          {
            !qrCodeOpen && <div className={ classes.hugeInputPreview }>
              <Typography className={ classes[size] }>{ fromAssetAmount } { asset ? asset.tokenMetadata.symbol : '' }</Typography>
            </div>
          }
          <div className={ classes.textField }>
            <Typography variant='h2' align='center' className={ classes.textFlex }>Deposit { fromAssetAmount } { asset.tokenMetadata.symbol }
              <img
                alt=""
                src={ receiveAsset.tokenMetadata.icon }
                height="20px"
                style={{ marginLeft: '6px', marginRight: '6px' }}
              />
            to
            </Typography>
            <div className={ classes.addressSummaryContainer }>
              <Typography className={ classes.addressField }>{ depositInfo.P2shAddress }</Typography>
              <div className={ classes.flexy }>
                <Button onClick={ (event) => { onCopy(event, depositInfo.P2shAddress) } }>
                  <FileCopyIcon className={ classes.assetSelectIcon } /> Copy address
                </Button>
                <Button onClick={ (event) => { onGenerateQR(event, depositInfo.P2shAddress) } }>
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
      { currentScreen === 'submitTX' && renderSubmit() }
    </Paper>
  )

}

export default withTheme(Swap)
