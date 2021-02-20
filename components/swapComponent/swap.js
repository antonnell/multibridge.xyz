import React, { useState, useEffect } from 'react';
import { Paper } from '@material-ui/core';

import Setup from './setup'
import Confirm from './confirm'
import Deposit from './deposit'
import ShowTX from './showTX'

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
} from '../../stores/constants'

function Swap({ theme }) {

  const [ currentScreen, setCurrentScreen ] = useState('setup') //setup, confirm, depositAddress, showTX
  const [ swapState, setSwapState ] = useState(null)
  const [ depositAddress, setDepositAddress ] = useState(null)
  const [ depositTX, setDepositTX ] = useState(null)
  const [ transferTX, setTransferTx ] = useState(null)

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

    stores.emitter.on(ERROR, errorReturned)
    stores.emitter.on(SWAP_RETURN_DEPOSIT_ADDRESS, depositAddressReturned)
    stores.emitter.on(SWAP_DEPOSIT_TRANSACTION, depositTransactionReturned)
    stores.emitter.on(SWAP_TRANSFER_TRANSACTION, transferTransactionReturned)

    return () => {
      stores.emitter.removeListener(ERROR, errorReturned)
      stores.emitter.removeListener(SWAP_RETURN_DEPOSIT_ADDRESS, depositAddressReturned)
      stores.emitter.removeListener(SWAP_DEPOSIT_TRANSACTION, depositTransactionReturned)
      stores.emitter.removeListener(SWAP_TRANSFER_TRANSACTION, transferTransactionReturned)

    }
  },[]);

  const handleNext = () => {
    switch (currentScreen) {
      case 'setup':
        stores.dispatcher.dispatch({ type: SWAP_CONFIRM_SWAP, content: swapState })
        break;
      case 'showTX':
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

    setCurrentScreen(newScreen)
    stores.dispatcher.dispatch({ type: CLEARN_LISTENERS })
  }

  const getDepositAddress = () => {
    setLoading(false)
    setDepositInfo(stores.swapStore.getStore('depositInfo'))
    setCurrentScreen('depositAddress')
  }

  const setSetupSwapState = (state) => {
    setSwapState(state)
  }

  const renderSetup = () => {
    return <Setup handleNext={ handleNext } setSwapState={ setSetupSwapState } swapState={ swapState } />
  }

  const renderConfirm = () => {
    return <Confirm handleNext={ handleNext } handleBack= { handleBack } swapState={ swapState } />
  }

  const renderDepositAddress = () => {
    return <Deposit handleNext={ handleNext } handleBack={ handleBack } swapState={ swapState } depositAddress={ depositAddress } />
  }

  const renderShowTX = () => {
    return <ShowTX handleBack={ handleBack } handleNext={ handleNext } swapState={ swapState } depositAddress={ depositAddress } depositTX={ depositTX } transferTX={ transferTX } />
  }

  return (
    <Paper elevation={ 2 } className={ classes.swapContainer }>
      { currentScreen === 'setup' && renderSetup() }
      { currentScreen === 'confirm' && renderConfirm() }
      { currentScreen === 'depositAddress' && renderDepositAddress() }
      { currentScreen === 'showTX' && renderShowTX() }
    </Paper>
  )

}

export default Swap
