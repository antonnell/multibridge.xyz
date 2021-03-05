import React, { useState, useEffect } from 'react';
import { Typography, Paper, Switch, Button } from '@material-ui/core'
import { withTheme } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';

import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import BarChartIcon from '@material-ui/icons/BarChart';
import SwapVerticalCircleOutlinedIcon from '@material-ui/icons/SwapVerticalCircleOutlined';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import WbSunnyOutlinedIcon from '@material-ui/icons/WbSunnyOutlined';
import Brightness2Icon from '@material-ui/icons/Brightness2';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SwapCallsIcon from '@material-ui/icons/SwapCalls';
import ListIcon from '@material-ui/icons/List';

import { useRouter } from 'next/router'

import Unlock from '../unlock'
import Footer from '../footer'

import stores from '../../stores'
import { formatAddress } from '../../utils'

import classes from './navigation.module.css'

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

function Navigation(props) {
  const router = useRouter()


  const account = stores.accountStore.getStore('account')

  const [ darkMode, setDarkMode ] = useState(props.theme.palette.type === 'dark' ? true : false);
  const [ unlockOpen, setUnlockOpen ] = useState(false);
  const [ menuOpen, setMenuOpen ] = useState(false)

  function handleNavigate(route) {
    router.push(route)
  }

  const onMenuClicked = () => {
    setMenuOpen(!menuOpen)
  }

  const handleToggleChange = (event, val) => {
    setDarkMode(val)
    props.changeTheme(val)
  }

  const onAddressClicked = () => {
    setUnlockOpen(true)
  }

  const closoeUnlock = () => {
    setUnlockOpen(false)
  }

  useEffect(function() {
    const localStorageDarkMode = window.localStorage.getItem('yearn.finance-dark-mode')
    setDarkMode(localStorageDarkMode ? localStorageDarkMode === 'dark' : false)
  },[]);


  const activePath = router.pathname

  const renderNavs = () => {
    return (<React.Fragment>
      <div className={ (activePath.includes('/swap') || activePath === '/') ? classes.navigationOptionActive : classes.navigationOption } onClick={ () => { handleNavigate('/swap') }}>
        <SwapCallsIcon className={ (activePath.includes('/swap') || activePath === '/') ? (props.theme.palette.type === 'light' ? classes.navigationOptionIconBlue : classes.navigationOptionIconWhite) : classes.navigationOptionIcon } />
        <Typography variant='h2' className={ (activePath.includes('/swap') || activePath === '/') ? (props.theme.palette.type === 'light' ? classes.colorBlue : classes.colorWhite) : null }>Swap</Typography>
      </div>
      { account && account.address &&
        <div className={ activePath.includes('/history') ? classes.navigationOptionActive : classes.navigationOption } onClick={ () => { handleNavigate('/history') }}>
          <ListIcon className={ activePath.includes('/history') ? (props.theme.palette.type === 'light' ? classes.navigationOptionIconBlue : classes.navigationOptionIconWhite) : classes.navigationOptionIcon } />
          <Typography variant='h2' className={ activePath.includes('/history') ? (props.theme.palette.type === 'light' ? classes.colorBlue : classes.colorWhite) : null }>History</Typography>
        </div>
      }
      <div className={ activePath.includes('/tokens') ? classes.navigationOptionActive : classes.navigationOption } onClick={ () => { handleNavigate('/tokens') }}>
        <SwapVerticalCircleOutlinedIcon className={ activePath.includes('/tokens') ? (props.theme.palette.type === 'light' ? classes.navigationOptionIconBlue : classes.navigationOptionIconWhite) : classes.navigationOptionIcon } />
        <Typography variant='h2' className={ activePath.includes('/tokens') ? (props.theme.palette.type === 'light' ? classes.colorBlue : classes.colorWhite) : null }>Tokens</Typography>
      </div>
      <div className={ activePath.includes('/stats') ? classes.navigationOptionActive : classes.navigationOption } onClick={ () => { handleNavigate('/stats') }}>
        <BarChartIcon className={ activePath.includes('/stats') ? (props.theme.palette.type === 'light' ? classes.navigationOptionIconBlue : classes.navigationOptionIconWhite) : classes.navigationOptionIcon } />
        <Typography variant='h2' className={ activePath.includes('/stats') ? (props.theme.palette.type === 'light' ? classes.colorBlue : classes.colorWhite) : null }>Stats</Typography>
      </div>
    </React.Fragment>)
  }

  return (
    <div className={ classes.navigationContainer }>
      <div className={ classes.navigationHeading }>
        <img src='/favicon.png' width={ 60 } height={ 60 } />
      </div>

      <div className={ classes.navigationContent }>
        { renderNavs() }
      </div>

      <Footer />

      { menuOpen && <Paper elevation={ 0  } className={ classes.navigationContentMobile }>
        <div className={ classes.menuIcon }>
          <Button
            color={ props.theme.palette.type === 'light' ? 'primary' : 'secondary' }
            onClick={ onMenuClicked }
            disableElevation
            >
            <CloseIcon fontSize={ 'large' } />
          </Button>
        </div>
        <div className={ classes.navigationHeading }>
          <img src='/favicon.png' width={ 60 } height={ 60 } />
        </div>
        <div className={ classes.navigationContentNavs }>
          { renderNavs() }
        </div>
        <div className={ classes.headerThings }>

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
            onClick={ onAddressClicked }
            >
            <div className={ `${classes.accountIcon} ${classes.metamask}` }></div>
            <Typography variant='h5'>{ account ? formatAddress(account.address) : 'Connect Wallet' }</Typography>
          </Button>

          { unlockOpen && (
            <Unlock modalOpen={ unlockOpen } closeModal={ closoeUnlock } />
          )}

        </div>
      </Paper> }

      <div className={ classes.menuIcon }>
        <Button
          color={ props.theme.palette.type === 'light' ? 'primary' : 'secondary' }
          onClick={ onMenuClicked }
          disableElevation
          >
          <MenuIcon fontSize={ 'large' } />
        </Button>
      </div>

      { props.backClicked && (
        <div className={ classes.backButtonContainer}>
          <div className={ classes.backButton }>
            <Button
              color={ props.theme.palette.type === 'light' ? 'primary' : 'secondary' }
              onClick={ props.backClicked }
              disableElevation
              >
              <ArrowBackIcon fontSize={ 'large' } />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}


export default withTheme(Navigation)
