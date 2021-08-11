import React, { useState, useEffect } from 'react';
import {
  TextField,
  Typography,
  InputAdornment,
  Button,
  IconButton,
  CircularProgress,
} from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CropFreeIcon from '@material-ui/icons/CropFree';
import LaunchIcon from '@material-ui/icons/Launch';

import { formatAddress } from '../../utils'
import stores from '../../stores'

import classes from './swap.module.css'

function ShowTX({ theme, swapState, handleBack, handleNext, depositAddress, depositTX, transferTX, transferStatus }) {

  const [ loading, setLoading ] = useState(false)

  const onNext = () => {
    handleNext()
  }

  const onCopy = (event, val) => {
    event.stopPropagation();
    navigator.clipboard.writeText(val).then(() => {

    });
  }

  const onViewTX = (event, val, asset) => {
    event.stopPropagation();
    const chainIDMapping = stores.accountStore.getStore('chainIDMapping')
    window.open(`${chainIDMapping[asset.chainID].explorer.tx}`, '_blank')
  }

  const isDark = theme.palette.type === 'dark'
  const getStatus = (status) => {
    let statusType = 'pending'
    if ([0, 5].includes(status)) {
      statusType = 'confirming'
    } else if ([8, 9].includes(status)) {
      statusType = 'success' // fusionsuccess
    } else if ([10].includes(status)) {
      statusType = 'success' // outnetsuccess
    } else if ([1, 2, 3, 4, 6, 11].includes(status)) {
      statusType = 'failure'
    } else if ([20].includes(status)) {
      statusType = 'timeout'
    } else {
      statusType = 'pending'
    }
  }

  const renderTX = (asset, tx, confirmations) => {
    return (
      <div className={ classes.txContainer }>
        <div className={ classes.displayDualIconContainerConfirm }>
          <img
            className={ classes.displayAssetIcon }
            alt=""
            src={ asset.tokenMetadata.icon }
            height='100px'
            onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
          />
          <img
            className={ classes.displayChainIcon }
            alt=""
            src={ `${asset.logoUrl}` }
            height='40px'
            width='40px'
            onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
          />
        </div>
        <div className={ classes.txInfoContainer }>
          <Typography>{ asset.chainDescription } Transaction Hash</Typography>
          <Typography className={ `${classes.addressField} ${ !isDark && classes.whiteBackground }` }>{ tx ? formatAddress(tx, 'long') : 'waiting for tx ...' }</Typography>
          { (tx && tx !== '' && confirmations && confirmations > 0) && (
            <Typography variant='subtitle1' className={ classes.confirmationsText } align='right'>{ confirmations >= 10 ? '>10' : confirmations } { confirmations > 1 ? 'confirmations' : 'confirmation'}</Typography>
          )}
          { !(tx && tx !== '') && (
            <Typography variant='subtitle1'>Estimated Time of Deposit Arrival is 10-30 min</Typography>
          )}
          { tx && tx !== '' && (
            <div className={ classes.flexy2 }>
              <Button onClick={ (event) => { onCopy(event, tx) } }>
                <FileCopyIcon className={ classes.assetSelectIcon } /> Copy
              </Button>
              <Button onClick={ (event) => { onViewTX(event, tx, asset) } }>
                <LaunchIcon className={ classes.assetSelectIcon } /> View
              </Button>
            </div>
            )
          }
        </div>
      </div>
    )
  }

  console.log(transferStatus)

  return (
    <div className={ classes.confirmSwap }>
      <div className={ classes.header }>
        <div className={ classes.backButton }>
          <Button
            onClick={ handleBack }
            disableElevation
            >
            <ChevronLeftIcon />
            <Typography variant='h2'>{ 'back' }</Typography>
          </Button>
        </div>
        <Typography>{ 'Deposit' }</Typography>
        <div className={ classes.backButton }>
        </div>
      </div>
      <div className={ classes.swapDepositInfo }>
        { renderTX(swapState.fromAssetValue, transferStatus ? transferStatus.txid : null, transferStatus ? transferStatus.intitalConfirmations : null) }
        { renderTX(swapState.toAssetValue, transferStatus ? transferStatus.swaptx : null, transferStatus ? transferStatus.confirmations : null) }
      </div>
      <div className={ classes.actionButton }>
        <Button
          fullWidth
          disableElevation
          variant='contained'
          color='primary'
          size='large'
          onClick={ onNext }
          disabled={ !(transferStatus && transferStatus.txid && transferStatus.txid !== '' && transferStatus.swaptx && transferStatus.swaptx !== '') }
          >
          { !(transferStatus && transferStatus.txid && transferStatus.txid !== '' && transferStatus.swaptx && transferStatus.swaptx !== '') && <Typography variant='h5'>{ 'Waiting for transactions to process' }</Typography> }
          { (transferStatus && transferStatus.txid && transferStatus.txid !== '' && transferStatus.swaptx && transferStatus.swaptx !== '') && <Typography variant='h5'>{ 'Done' }</Typography> }
        </Button>
      </div>
    </div>
  )
}

export default withTheme(ShowTX)
