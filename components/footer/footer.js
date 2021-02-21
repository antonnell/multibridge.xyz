import React, { useState, useEffect } from 'react';

import { Typography, Switch, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import { withTheme } from '@material-ui/core/styles';

import classes from './footer.module.css'

function Header(props) {

  return (
    <div className={ classes.footerContainer }>
      <a className={ classes.link } href='https://www.fusion.org/products/dcrm' target='_blank' rel="noreferrer">
        <Typography variant='h5' className={ classes.auditText } color='textPrimary'><img className={ classes.icon } src='/blockchains/FSN.svg' alt='' height={ 20 } width={ 20 } style={{marginRight: 12 }}/> Powered by DCRM</Typography>
      </a>
      <a className={ classes.link } href='https://github.com/anyswap/Anyswap-Audit/blob/master/SlowMist/AnySwap%20CrossChain-Bridge%20Security%20Audit%20Report.pdf' target='_blank' rel="noreferrer">
        <Typography variant='h5' className={ classes.auditText } color='textPrimary'><img src='/slowmist.png' alt='' height={ 20 } width={ 20 } style={{marginRight: 12 }}/> Security Audit</Typography>
      </a>
    </div>
  )
}

export default withTheme(Header)
