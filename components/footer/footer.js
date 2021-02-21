import React, { useState, useEffect } from 'react';

import { Typography, Switch, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import { withTheme } from '@material-ui/core/styles';

import classes from './footer.module.css'

import stores from '../../stores'
import {
  SWAP_UPDATED,
} from '../../stores/constants'

import { formatCurrency } from '../../utils'

function Header(props) {

  const [ totalLocked, setTotalLocked ] = useState(0)

  useEffect(function() {
    const swapUpdated = () => {
      console.log(stores.swapStore.getStore('totalLocked'))
      const storeTotalLocked = stores.swapStore.getStore('totalLocked')

      setTotalLocked(storeTotalLocked)
    }

    stores.emitter.on(SWAP_UPDATED, swapUpdated)
    return () => {
      stores.emitter.removeListener(SWAP_UPDATED, swapUpdated)
    }
  },[]);

  return (
    <div className={ classes.footerContainer }>
      <div className={ classes.link }>
        <Typography variant='h5' className={ classes.auditText } color='textPrimary'>$ { formatCurrency(totalLocked) } Locked</Typography>
      </div>
      <a className={ classes.link } href='https://github.com/anyswap/Anyswap-Audit/blob/master/SlowMist/AnySwap%20CrossChain-Bridge%20Security%20Audit%20Report.pdf' target='_blank' rel="noreferrer">
        <Typography variant='h5' className={ classes.auditText } color='textPrimary'><img src='/slowmist.png' alt='' height={ 20 } width={ 20 } style={{marginRight: 12 }}/> Security Audit</Typography>
      </a>
    </div>
  )
}

export default withTheme(Header)
