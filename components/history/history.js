import React, { useState, useEffect } from 'react';
import { Paper, Typography } from '@material-ui/core';

import HistoryTable from './historyTable'

import classes from './history.module.css'

import stores from '../../stores'
import {
  ERROR,
  GET_SWAP_HISTORY,
  SWAP_HISTORY_RETURNED,
} from '../../stores/constants'

function History({ theme }) {

  const [ swapHistory, setSwapHistory ] = useState([])

  useEffect(function() {
    const swapHistoryReturned = (history) => {
      setSwapHistory(history)
    }

    stores.emitter.on(SWAP_HISTORY_RETURNED, swapHistoryReturned)

    return () => {
      stores.emitter.removeListener(SWAP_HISTORY_RETURNED, swapHistoryReturned)

    }
  },[]);

  return (
    <Paper elevation={ 2 } className={ classes.swapContainer }>
      <HistoryTable swapHistory={ swapHistory }/>
    </Paper>
  )

}

export default History
