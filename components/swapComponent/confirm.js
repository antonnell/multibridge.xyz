import React, { useState, useEffect } from 'react';
import {
  TextField,
  Typography,
  InputAdornment,
  Button,
  IconButton,
  CircularProgress,
} from '@material-ui/core';
import {
  withStyles,
  withTheme,
} from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import { formatCurrency, formatAddress, formatCurrencyWithSymbol } from '../../utils'

import classes from './swap.module.css'


import stores from '../../stores'
import { ERROR } from '../../stores/constants'

function Confirm({ theme, swapState, handleBack, handleNext }) {

  const [ loading, setLoading ] = useState(false)

  const onNext = () => {
    setLoading(true)
    handleNext()
  }

  useEffect(function() {
    const errorReturned = () => {
      setLoading(false)
    }

    stores.emitter.on(ERROR, errorReturned)

    return () => {
      stores.emitter.removeListener(ERROR, errorReturned)
    }
  },[]);

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
        <Typography variant='h2'>{ 'Confirm' }</Typography>
        <div className={ classes.backButton }>
        </div>
      </div>
      <div className={ classes.swapConfirmContainer }>
        <div className={ `${classes.swapConfirmSide} ${ !isDark && classes.whiteBackground }` }>
          <div className={ classes.displayDualIconContainerConfirm }>
            <img
              className={ classes.displayAssetIcon }
              alt=""
              src={ swapState.fromAssetValue.tokenMetadata.icon }
              height='100px'
              onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
            />
            <img
              className={ classes.displayChainIcon }
              alt=""
              src={ `${swapState.fromAssetValue.logoUrl}` }
              height='40px'
              width='40px'
              onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
            />
          </div>
          <div className={ classes.chainDescrPadding }>
            <Typography align='center'>{ swapState.fromAssetValue.tokenMetadata.description }</Typography>
          </div>
          <div>
            <Typography align='center' className={ classes.largeInput }>{ swapState.fromAmountValue }</Typography>
          </div>
          <div>
            <Typography align='center' className={ classes.addressInput }>{ formatAddress(swapState.fromAddressValue, 'short') }</Typography>
          </div>
        </div>
        <div className={ classes.arrowIcon }>
          <ArrowDownwardIcon fontSize={ 'large' } />
        </div>
        <div className={ `${classes.swapConfirmSide} ${ !isDark && classes.whiteBackground }` }>
          <div className={ classes.displayDualIconContainerConfirm }>
            <img
              className={ classes.displayAssetIcon }
              alt=""
              src={ swapState.toAssetValue.tokenMetadata.icon }
              height='100px'
              onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
            />
            <img
              className={ classes.displayChainIcon }
              alt=""
              src={ `${swapState.toAssetValue.logoUrl}` }
              height='40px'
              width='40px'
              onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
            />
          </div>
          <div className={ classes.chainDescrPadding }>
            <Typography align='center'>{ swapState.toAssetValue.tokenMetadata.description }</Typography>
          </div>
          <div>
            <Typography align='center' className={ classes.largeInput }>{ swapState.toAmountValue }</Typography>
          </div>
          <div>
            <Typography align='center' className={ classes.addressInput }>{ formatAddress(swapState.toAddressValue, 'short') }</Typography>
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
          onClick={ onNext }
          disabled={ loading }
          >
          { loading && <CircularProgress size={20} /> }
          { !loading && <Typography variant='h5'>{ 'Confirm' }</Typography> }
        </Button>
      </div>
    </div>
  )
}

export default withTheme(Confirm)
