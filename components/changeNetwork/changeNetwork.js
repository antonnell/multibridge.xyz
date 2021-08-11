import React, { useState, useEffect } from 'react';

import { Typography, Switch, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import { withTheme } from '@material-ui/core/styles';

import {
} from '../../stores/constants'

import stores from '../../stores'

import {
  CHANGE_NETWORK
} from '../../stores/constants'

import classes from './changeNetwork.module.css'


function ChangeNetwork(props) {

  const storeChainIDMapping = stores.accountStore.getStore('chainIDMapping')
  const objectKeys = Object.keys(storeChainIDMapping)

  const onChainSeleccted = (chain) => {
    stores.dispatcher.dispatch({ type: CHANGE_NETWORK, content: { network: chain } })
  }

  return (
    <div className={ classes.changeNetworkContainer }>
      <Typography variant='h2' className={ classes.sectionHeading }>Connect to a network</Typography>
      {
        objectKeys.map((key, index) => {
          const chain = storeChainIDMapping[key]
          return (<Button
            key={ index }
            size='large'
            onClick={ () => { onChainSeleccted(chain) } }
            className={ classes.chainContainer}>
            <img src={ `${chain.logoUrl}` } className={ classes.chainIcon } />
            <Typography variant='h5' className={ classes.buttonText }>{ chain.name }</Typography>
          </Button>)
        })
      }
    </div>
  )
}

export default withTheme(ChangeNetwork)
