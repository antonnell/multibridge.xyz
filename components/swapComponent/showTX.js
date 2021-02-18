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

function ShowTX({ theme, swapState, handleBack, handleNext, depositAddress, depositTX, transferTX }) {

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
    window.open(`${chainIDMapping[asset.chainID].explorer}/tx/${val}`, '_blank')
  }

  const isDark = theme.palette.type === 'dark'

  const renderTX = (asset, tx) => {
    return (
      <div className={ classes.txContainer }>
        <div className={ classes.displayDualIconContainerConfirm }>
          <img
            className={ classes.displayAssetIcon }
            alt=""
            src={ asset.tokenMetadata.icon }
            height='100px'
          />
          <img
            className={ classes.displayChainIcon }
            alt=""
            src={ `/blockchains/${asset.icon}` }
            height='40px'
            width='40px'
          />
        </div>
        <div className={ classes.txInfoContainer }>
          <Typography>{ asset.chainDescription } Transaction Hash</Typography>
          <Typography className={ `${classes.addressField} ${ !isDark && classes.whiteBackground }` }>{ tx ? formatAddress(tx.transactionHash, 'long') : 'waiting for tx ...' }</Typography>
          { (!tx || !tx.transactionHash) && (
            <Typography variant='subtitle1'>Estimated Time of Deposit Arrival is 10-30 min</Typography>
          )}
          { tx && tx.transactionHash && (
            <div className={ classes.flexy }>
              <Button onClick={ (event) => { onCopy(event, tx.transactionHash) } }>
                <FileCopyIcon className={ classes.assetSelectIcon } /> Copy
              </Button>
              <Button onClick={ (event) => { onViewTX(event, tx.transactionHash, asset) } }>
                <LaunchIcon className={ classes.assetSelectIcon } /> View
              </Button>
            </div>
            )
          }
        </div>
      </div>
    )
  }

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
        { renderTX(swapState.fromAssetValue, depositTX) }
        { renderTX(swapState.toAssetValue, transferTX) }
      </div>
      <div className={ classes.actionButton }>
        <Button
          fullWidth
          disableElevation
          variant='contained'
          color='primary'
          size='large'
          onClick={ onNext }
          disabled={ !(depositTX && transferTX) }
          >
          { !(depositTX && transferTX) && <Typography variant='h5'>{ 'Waiting for transactions to process' }</Typography> }
          { (depositTX && transferTX) && <Typography variant='h5'>{ 'Done' }</Typography> }
        </Button>
      </div>
    </div>
  )
}

export default withTheme(ShowTX)
