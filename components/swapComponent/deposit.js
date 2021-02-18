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

import { formatAddress } from '../../utils'

import QRCode from 'qrcode.react'
import classes from './swap.module.css'

function Deposit({ theme, swapState, handleBack, handleNext, depositAddress }) {

  const [ loading, setLoading ] = useState(false)
  const [ qrCodeOpen, setQRCodeOpen ] = useState(false)

  const onNext = () => {
    setLoading(true)
    handleNext()
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

  const isDark = theme.palette.type === 'dark'

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
        {
          qrCodeOpen && <div className={ classes.qrPreview }>
            <QRCode value={ depositAddress } />
          </div>
        }
        {
          !qrCodeOpen &&
          <div className={ classes.qrPreview }>
            <div className={ classes.displayDualIconContainerConfirm }>
              <img
                className={ classes.displayAssetIcon }
                alt=""
                src={ swapState.fromAssetValue.tokenMetadata.icon }
                height='100px'
              />
              <img
                className={ classes.displayChainIcon }
                alt=""
                src={ `/blockchains/${swapState.fromAssetValue.icon}` }
                height='40px'
                width='40px'
              />
            </div>
          </div>
        }
        <div className={ classes.textField }>
          <Typography align='center' className={ classes.textFlex }>Send <b>{ swapState.fromAmountValue } { swapState.fromAssetValue.tokenMetadata.symbol }</b> on the <b>{ swapState.fromAssetValue.chainDescription }</b> from your account <b>{ formatAddress(swapState.fromAddressValue) }</b> to the address below. Only deposits from your account { formatAddress(swapState.fromAddressValue) } will be accepted.</Typography>
          <div className={ classes.addressSummaryContainer }>
            <Typography className={ `${classes.addressField} ${ !isDark && classes.whiteBackground }` }>{ depositAddress }</Typography>
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
        <div className={ classes.waiting }>
          <Button
            fullWidth
            disableElevation
            variant='contained'
            color='primary'
            size='large'
            disabled={ true }
            >
              <Typography variant='h5'>{ 'Waiting for deposit TX' }</Typography>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default withTheme(Deposit)
