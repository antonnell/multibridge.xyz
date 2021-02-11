import React, { useState, useEffect } from 'react';

import { Typography, Switch, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import { withTheme } from '@material-ui/core/styles';

import WbSunnyOutlinedIcon from '@material-ui/icons/WbSunnyOutlined';
import Brightness2Icon from '@material-ui/icons/Brightness2';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import {
  CONNECT_WALLET,
  ACCOUNT_CONFIGURED,
  CONFIGURE_NETWORK,
  NETWORK_CHANGED,
  ACCOUNT_CHANGED
} from '../../stores/constants'

import Unlock from '../unlock'
import ChangeNetwork from '../changeNetwork'
import WrongNetwork from '../wrongNetwork'

import stores from '../../stores'
import { formatAddress } from '../../utils'

import classes from './header.module.css'

const StyledSwitch = withStyles((theme) => ({
  root: {
    width: 58,
    height: 32,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(28px)',
      color: '#212529',
      '& + $track': {
        backgroundColor: '#ffffff',
        opacity: 1,
      },
    },
    '&$focusVisible $thumb': {
      color: '#ffffff',
      border: '6px solid #fff',
    }
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 32 / 2,
    border: `1px solid #212529`,
    backgroundColor: '#212529',
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

function Header(props) {

  const [ selectedChainID, setSelectedChainID ] = useState(stores.accountStore.getStore('selectedChainID'))
  const [ account, setAccount ] = useState(stores.accountStore.getStore('account'))
  const [ chainID, setChainID ] = useState(stores.accountStore.getStore('chainID'))
  const [ chainIDMapping, setChainIDMapping ] = useState(stores.accountStore.getStore('chainIDMapping'))
  const [ darkMode, setDarkMode ] = useState(props.theme.palette.type === 'dark' ? true : false);
  const [ unlockOpen, setUnlockOpen ] = useState(false);
  const [ changeNetworkOpen, setChangeNetworkOpen ] = useState(false);
  const [ configureOpen, setConfigureOpen ] = useState(false);

  useEffect(() => {
    const accountConfigure = () => {
      const accountStore = stores.accountStore.getStore('account')
      const storeChainID = stores.accountStore.getStore('chainID')
      setAccount(accountStore)
      setChainID(storeChainID)
      closeUnlock()
    }
    const connectWallet = () => {
      onAddressClicked()
    }
    const configureNetwork = () => {
      onConfigureClicked()
    }
    const networkChanged = () => {
      closeChangeNetwork()
      setSelectedChainID(stores.accountStore.getStore('selectedChainID'))
      setChainID(stores.accountStore.getStore('chainID'))
    }

    stores.emitter.on(ACCOUNT_CONFIGURED, accountConfigure)
    stores.emitter.on(ACCOUNT_CHANGED, accountConfigure)
    stores.emitter.on(CONNECT_WALLET, connectWallet)
    stores.emitter.on(CONFIGURE_NETWORK, configureNetwork)
    stores.emitter.on(NETWORK_CHANGED, networkChanged)
    return () => {
      stores.emitter.removeListener(ACCOUNT_CONFIGURED, accountConfigure)
      stores.emitter.removeListener(ACCOUNT_CHANGED, accountConfigure)
      stores.emitter.removeListener(CONNECT_WALLET, connectWallet)
      stores.emitter.removeListener(CONFIGURE_NETWORK, configureNetwork)
      stores.emitter.removeListener(NETWORK_CHANGED, networkChanged)
    }
  }, [])

  const handleToggleChange = (event, val) => {
    setDarkMode(val)
    props.changeTheme(val)
  }

  const onAddressClicked = () => {
    setUnlockOpen(true)
  }

  const closeUnlock = () => {
    setUnlockOpen(false)
  }

  const onNetworkClicked = () => {
    setChangeNetworkOpen(true)
  }

  const closeChangeNetwork = () => {
    setChangeNetworkOpen(false)
  }

  const onConfigureClicked = () => {
    setConfigureOpen(true)
  }

  const closeConfigure = () => {
    setConfigureOpen(false)
  }

  const onChainIDChange = (event) => {
    setChainID(event.target.value)
    setChangeNetworkOpen(false)
  }

  useEffect(function() {
    const localStorageDarkMode = window.localStorage.getItem('yearn.finance-dark-mode')
    setDarkMode(localStorageDarkMode ? localStorageDarkMode === 'dark' : false)
  },[]);

  return (
    <div className={ classes.headerContainer }>
      { props.backClicked && (
        <div className={ classes.backButton }>
          <Button
          color={ props.theme.palette.type === 'light' ? 'primary' : 'secondary' }
          onClick={ props.backClicked }
            disableElevation
            >
            <ArrowBackIcon fontSize={ 'large' } />
          </Button>
        </div>
      )}
      <div className={ classes.themeSelectContainer }>
        <StyledSwitch
          icon={ <Brightness2Icon className={ classes.switchIcon }/> }
          checkedIcon={ <WbSunnyOutlinedIcon className={ classes.switchIcon }/> }
          checked={ darkMode }
          onChange={ handleToggleChange }
        />
      </div>
      <Button
        disableElevation
        className={ classes.accountButton }
        variant='contained'
        color='secondary'
        onClick={ onNetworkClicked }
        >
        { chainIDMapping[selectedChainID] && <img src={ `/blockchains/${ chainIDMapping[selectedChainID].icon }`} className={ classes.accountIcon } width={ 30 } height={ 30 } />}
        { chainIDMapping[selectedChainID] && <Typography variant='h5'>{ chainIDMapping[selectedChainID].name }</Typography> }
      </Button>
      {
        account && selectedChainID === chainID &&
        <Button
          disableElevation
          className={ classes.accountButton }
          variant='contained'
          color='secondary'
          onClick={ onAddressClicked }
          >
          { account && account.address && <div className={ `${classes.accountIcon} ${classes.metamask}` }></div> }
          { account && account.address && <Typography variant='h5'>{ formatAddress(account.address) }</Typography> }
        </Button>
      }
      {
        (!chainID || !account) &&
        <Button
          disableElevation
          className={ classes.accountButton }
          variant='contained'
          color='secondary'
          onClick={ onAddressClicked }
          >
          <Typography variant='h5'>Connect Wallet</Typography>
        </Button>
      }
      {
        account && chainID && selectedChainID && selectedChainID !== chainID &&
        <Button
          disableElevation
          className={ classes.errorButton }
          variant='contained'
          color='secondary'
          onClick={ onConfigureClicked }
          >
          <Typography variant='h5'>Configure Network</Typography>
        </Button>
      }


      { unlockOpen && (
        <Unlock modalOpen={ unlockOpen } closeModal={ closeUnlock } />
      )}
      { changeNetworkOpen && (
        <ChangeNetwork modalOpen={ changeNetworkOpen } closeModal={ closeChangeNetwork } onChainIDChange={ onChainIDChange } />
      )}
      { configureOpen && (
        <WrongNetwork modalOpen={ configureOpen } closeModal={ closeConfigure } />
      )}
    </div>
  )
}

export default withTheme(Header)
