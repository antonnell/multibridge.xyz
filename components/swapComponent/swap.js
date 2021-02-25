import React, { useState, useEffect } from 'react';
import { Paper, Typography } from '@material-ui/core';

import Setup from './setup'
import Confirm from './confirm'
import Deposit from './deposit'
import ShowTX from './showTX'
import Disclaimer from '../disclaimer'

import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

import classes from './swap.module.css'

import stores from '../../stores'
import {
  ERROR,
  SWAP_GET_DEPOSIT_ADDRESS,
  SWAP_CONFIRM_SWAP,
  SWAP_RETURN_DEPOSIT_ADDRESS,
  SWAP_SHOW_TX_STATUS,
  SWAP_DEPOSIT_TRANSACTION,
  SWAP_TRANSFER_TRANSACTION,
  CLEARN_LISTENERS,
  SWAP_STATUS_TRANSACTIONS
} from '../../stores/constants'


import { formatCurrencySmall } from '../../utils'

function Swap({ theme }) {

  const [ currentScreen, setCurrentScreen ] = useState('setup') //setup, confirm, depositAddress, showTX
  const [ swapState, setSwapState ] = useState(null)
  const [ depositAddress, setDepositAddress ] = useState(null)
  const [ depositTX, setDepositTX ] = useState(null)
  const [ transferTX, setTransferTx ] = useState(null)
  const [ transferStatus, setTransferStatus ] = useState(null)

  useEffect(function() {
    const errorReturned = () => {
    }

    const depositAddressReturned = (address) => {
      setDepositAddress(address)
      setCurrentScreen('depositAddress')
    }

    const depositTransactionReturned = (event) => {
      setDepositTX(event)
      setCurrentScreen('showTX')
    }

    const transferTransactionReturned = (event) => {
      setTransferTx(event)
      setCurrentScreen('showTX')
    }

    const transactionStatusReturned = (status) => {
      setTransferStatus(status.info)
      setCurrentScreen('showTX')
    }

    stores.emitter.on(ERROR, errorReturned)
    stores.emitter.on(SWAP_RETURN_DEPOSIT_ADDRESS, depositAddressReturned)
    stores.emitter.on(SWAP_DEPOSIT_TRANSACTION, depositTransactionReturned)
    stores.emitter.on(SWAP_TRANSFER_TRANSACTION, transferTransactionReturned)
    stores.emitter.on(SWAP_STATUS_TRANSACTIONS, transactionStatusReturned)

    return () => {
      stores.emitter.removeListener(ERROR, errorReturned)
      stores.emitter.removeListener(SWAP_RETURN_DEPOSIT_ADDRESS, depositAddressReturned)
      stores.emitter.removeListener(SWAP_DEPOSIT_TRANSACTION, depositTransactionReturned)
      stores.emitter.removeListener(SWAP_TRANSFER_TRANSACTION, transferTransactionReturned)
      stores.emitter.removeListener(SWAP_STATUS_TRANSACTIONS, transactionStatusReturned)

    }
  },[]);

  const setSetupSwapState = (state) => {
    setSwapState(state)
  }

  const handleNext = (setupSwapState) => {
    switch (currentScreen) {
      case 'setup':
        setSwapState(setupSwapState)
        stores.dispatcher.dispatch({ type: SWAP_CONFIRM_SWAP, content: setupSwapState })
        break;
      case 'showTX':
        stores.dispatcher.dispatch({ type: CLEARN_LISTENERS })
        setCurrentScreen('setup')
        break;
      default:

    }
  }

  const handleBack = () => {
    let newScreen = ''
    switch (currentScreen) {
      case 'confirm':
        newScreen = 'setup'
        break;
      case 'depositAddress':
        newScreen = 'setup'
        break;
      case 'showTX':
        newScreen = 'setup'
        break;
      default:
    }

    stores.dispatcher.dispatch({ type: CLEARN_LISTENERS })
    setCurrentScreen(newScreen)
  }

  const getDepositAddress = () => {
    setLoading(false)
    setDepositInfo(stores.swapStore.getStore('depositInfo'))
    setCurrentScreen('depositAddress')
  }

  const renderSetup = () => {
    return <Setup handleNext={ handleNext } swapState={ swapState } setSwapState={ setSetupSwapState } />
  }

  const renderConfirm = () => {
    return <Confirm handleNext={ handleNext } handleBack= { handleBack } swapState={ swapState } />
  }

  const renderDepositAddress = () => {
    return <Deposit handleNext={ handleNext } handleBack={ handleBack } swapState={ swapState } depositAddress={ depositAddress } />
  }

  const renderShowTX = () => {
    return <ShowTX handleNext={ handleNext } handleBack={ handleBack } swapState={ swapState } depositAddress={ depositAddress } depositTX={ depositTX } transferTX={ transferTX } transferStatus={ transferStatus } />
  }

  return (
    <div className={ classes.newSwapContainer }>
      <Paper elevation={ 2 } className={ classes.swapContainer }>
        { currentScreen === 'setup' && renderSetup() }
        { currentScreen === 'confirm' && renderConfirm() }
        { currentScreen === 'depositAddress' && renderDepositAddress() }
        { currentScreen === 'showTX' && renderShowTX() }
      </Paper>
      <div className={ classes.swapInfoContainer }>
        <Disclaimer />
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
                    src={ (swapState && swapState.fromAssetValue) ? `/blockchains/${swapState.fromAssetValue.icon}` : '' }
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
                    src={ (swapState && swapState.toAssetValue) ? `/blockchains/${swapState.toAssetValue.icon}` : '' }
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
            <Typography>{ formatCurrencySmall(swapState && swapState.fromAssetValue ? swapState.fromAssetValue.maximumSwap : 0) } { swapState && swapState.fromAssetValue ? swapState.fromAssetValue.tokenMetadata.symbol : '' }</Typography>
          </div>
          <div className={ classes.swapInfoRow }>
            <Typography color='textSecondary'>Min Swap Amount</Typography>
            <Typography>{ formatCurrencySmall(swapState && swapState.fromAssetValue ? swapState.fromAssetValue.minimumSwap : 0) } { swapState && swapState.fromAssetValue ? swapState.fromAssetValue.tokenMetadata.symbol : '' }</Typography>
          </div>
          <div className={ classes.swapInfoRow }>
            <Typography color='textSecondary'>Swap Fee</Typography>
            <Typography>{ formatCurrencySmall(swapState && swapState.fromAssetValue ? (swapState.fromAssetValue.swapFeeRate*100) : 0) }%</Typography>
          </div>
          <div className={ classes.swapInfoRow }>
            <Typography color='textSecondary'>Max Fee Amount</Typography>
            <Typography>{ formatCurrencySmall(swapState && swapState.fromAssetValue ? swapState.fromAssetValue.maximumSwapFee : 0) } { swapState && swapState.fromAssetValue ? swapState.fromAssetValue.tokenMetadata.symbol : '' }</Typography>
          </div>
          <div className={ classes.swapInfoRow }>
            <Typography color='textSecondary'>Min Fee Amount</Typography>
            <Typography>{ formatCurrencySmall(swapState && swapState.fromAssetValue ? swapState.fromAssetValue.minimumSwapFee : 0) } { swapState && swapState.fromAssetValue ? swapState.fromAssetValue.tokenMetadata.symbol : '' }</Typography>
          </div>
          <div className={ classes.swapInfoRow }>
            <Typography color='textSecondary' className={ classes.flexy }>Deposits <Typography color={ 'textPrimary' } className={ classes.inlineText }>> {formatCurrencySmall(swapState && swapState.fromAssetValue ? swapState.fromAssetValue.bigValueThreshold : 0)} {(swapState && swapState.fromAssetValue && swapState.fromAssetValue.tokenMetadata) ? swapState && swapState.fromAssetValue.tokenMetadata.symbol : ''} </Typography> could take up to <Typography color='textPrimary' className={ classes.inlineText }> 12 hours</Typography></Typography>
          </div>
        </div>
      </div>
    </div>
  )

}

export default Swap
