import React, { useState, useEffect } from 'react';
import { Paper, Typography } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import Setup from './setup'
import Confirm from './confirm'
import Deposit from './deposit'
import ShowTX from './showTX'
import Disclaimer from '../disclaimer'
import TransactionController from './swapTransactionController'

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

  const [ currentScreen, setCurrentScreen ] = useState('setup') //setup, showTX
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
      // setCurrentScreen('showTX')
    }

    const transferTransactionReturned = (event) => {
      setTransferTx(event)
      // setCurrentScreen('showTX')
    }

    const transactionStatusReturned = (status) => {
      setTransferStatus(status.info)
      // setCurrentScreen('showTX')
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

      <TransactionController />
    </div>
  )

}

export default Swap
