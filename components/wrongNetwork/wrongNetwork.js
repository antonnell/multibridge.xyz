import React, { useState, useEffect } from 'react';

import { Typography, Switch, Button, IconButton } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import { withTheme } from '@material-ui/core/styles';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import {
} from '../../stores/constants'

import stores from '../../stores'

import {
  CHANGE_NETWORK
} from '../../stores/constants'

import classes from './wrongNetwork.module.css'


function WrongNetwork(props) {

  const storeChainIDMapping = stores.accountStore.getStore('chainIDMapping')
  const selectedChainID = stores.accountStore.getStore('selectedChainID')

  const onCopy = (event, field) => {
    event.stopPropagation();
    navigator.clipboard.writeText(storeChainIDMapping[selectedChainID][field]).then(() => {

    });
  }

  return (
    <div className={ classes.changeNetworkContainer }>
      <Typography variant='h2' className={ classes.sectionHeading }>Setup your connection to { (storeChainIDMapping && selectedChainID) ? storeChainIDMapping[selectedChainID].name : '' }</Typography>
      <div className={ classes.infoText }>
        <Typography>If you have already configured this network in MetaMask, then open <b>MetaMask -> Network Dropdown</b> at the top of MetaMask and select <b>{ (storeChainIDMapping && selectedChainID) ? storeChainIDMapping[selectedChainID].name : '' }</b>.</Typography>
      </div>
      <div className={ classes.infoText }>
        <Typography>If you have not configured this network, then open <b>Metamask -> Settings -> Networks -> Add Network</b> and paste the settings below.</Typography>
      </div>
      <div className={ classes.settingsContainer }>
        <div className={ classes.settingContainer}>
          <div className={ classes.setting }>
            <Typography className={ classes.title } variant='h5'>Network Name</Typography>
            <Typography className={ classes.value }>{ storeChainIDMapping[selectedChainID].name }</Typography>
          </div>
          <IconButton aria-label="copy" onClick={ (event) => { onCopy(event, 'name') } }>
            <FileCopyIcon />
          </IconButton>
        </div>
        <div className={ classes.settingContainer}>
          <div className={ classes.setting }>
            <Typography className={ classes.title} variant='h5'>RPC URL</Typography>
            <Typography className={ classes.value }>{ storeChainIDMapping[selectedChainID].rpcURL }</Typography>
          </div>
          <IconButton aria-label="copy" onClick={ (event) => { onCopy(event,  'rpcURL') } }>
            <FileCopyIcon />
          </IconButton>
        </div>
        <div className={ classes.settingContainer}>
          <div className={ classes.setting }>
            <Typography className={ classes.title} variant='h5'>Chain ID</Typography>
            <Typography className={ classes.value }>{ storeChainIDMapping[selectedChainID].chainID }</Typography>
          </div>
          <IconButton aria-label="copy" onClick={ (event) => { onCopy(event, 'chainID') } }>
            <FileCopyIcon />
          </IconButton>
        </div>
        <div className={ classes.settingContainer}>
          <div className={ classes.setting }>
            <Typography className={ classes.title} variant='h5'>Symbol</Typography>
            <Typography className={ classes.value }>{ storeChainIDMapping[selectedChainID].symbol }</Typography>
          </div>
          <IconButton aria-label="copy" onClick={ (event) => { onCopy(event, 'symbol') } }>
            <FileCopyIcon />
          </IconButton>
        </div>
        <div className={ classes.settingContainer}>
          <div className={ classes.setting }>
            <Typography className={ classes.title} variant='h5'>Explorer URL</Typography>
            <Typography className={ classes.value }>{ storeChainIDMapping[selectedChainID].explorer }</Typography>
          </div>
          <IconButton aria-label="copy" onClick={ (event) => { onCopy(event,  'explorer') } }>
            <FileCopyIcon />
          </IconButton>
        </div>
      </div>
    </div>
  )
}

export default withTheme(WrongNetwork)
