import React, { useState, useEffect } from 'react';
import { Paper, Typography } from '@material-ui/core';

import HistoryTable from './historyTable'

import classes from './history.module.css'

import stores from '../../stores'
import {
  ERROR,
  GET_EXPLORER,
  EXPLORER_RETURNED,
} from '../../stores/constants'

function History({ theme }) {

  const [ swapHistory, setSwapHistory ] = useState(null)

  useEffect(function() {
    const swapHistoryReturned = (history) => {
      setSwapHistory(history)
    }

    stores.emitter.on(EXPLORER_RETURNED, swapHistoryReturned)
    stores.dispatcher.dispatch({ type: GET_EXPLORER })

    return () => {
      stores.emitter.removeListener(EXPLORER_RETURNED, swapHistoryReturned)
    }
  },[]);

  return (
    <Paper elevation={ 0 } className={ classes.historyContainer }>
      <HistoryTable swapHistory={ swapHistory }/>
    </Paper>
  )

}

export default History
