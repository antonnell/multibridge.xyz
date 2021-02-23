import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { withTheme } from '@material-ui/core/styles';
import { Paper, Typography, Grid, Button } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import TimelineIcon from '@material-ui/icons/Timeline';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import LinkIcon from '@material-ui/icons/Link';
import BlurOnIcon from '@material-ui/icons/BlurOn';

import { formatCurrency } from '../../utils'

import classes from './stats.module.css'

import stores from '../../stores'
import {
  ERROR,
  GET_BRIDGE_INFO,
  BRIDGE_INFO_RETURNED,
} from '../../stores/constants'

function Stats({ theme }) {
  const router = useRouter()

  const [ totalLocked, setTotalLocked ] = useState(null)
  const [ bridgedAssets, setBridgedAssets ] = useState(null)
  const [ blockchains, setBlockchains ] = useState(null)
  const [ nodes, setNodes ] = useState(null)

  useEffect(function() {
    const bridgeInfoReturned = (history) => {
      setTotalLocked(stores.swapStore.getStore('totalLocked'))
      setBridgedAssets(stores.swapStore.getStore('bridgedAssets'))
      setBlockchains(stores.swapStore.getStore('bridgeBlockchains'))
      setNodes(stores.swapStore.getStore('nodes'))
    }

    stores.emitter.on(BRIDGE_INFO_RETURNED, bridgeInfoReturned)
    stores.dispatcher.dispatch({ type: GET_BRIDGE_INFO })

    return () => {
      stores.emitter.removeListener(BRIDGE_INFO_RETURNED, bridgeInfoReturned)
    }
  },[]);

  const onNavigateChains = () => {
    router.push('/stats/chains')
  }

  const onNavigateAssets = () => {
    router.push('/stats/assets')
  }

  const isDark = theme.palette.type === 'dark'

  return (
    <div className={ classes.statsDashboard} >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={9}>
          <Paper elevation={ 2 } className={ classes.stat }>
            <div className={ `${classes.lockedIconContainer} ${isDark?classes.darkIcon:classes.lightIcon}` }>
              <AttachMoneyIcon className={ `${classes.lockedIcon}`} />
            </div>
            <div>
              <Typography variant='h1' className={ classes.totalLocked }>{ totalLocked === null ? <Skeleton /> : `${formatCurrency(totalLocked)}` }</Typography>
              <Typography variant='h5' color='textSecondary'>Total Value Locked</Typography>
            </div>
            <BubbleChartIcon className={ classes.backgroundIcon } />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
          <Paper elevation={ 2 } className={ classes.stat }>
            <div>
              <Typography variant='h1'>{ nodes === null ? <Skeleton /> : nodes } Nodes</Typography>
              <Typography variant='h5' color='textSecondary'>Securing the network</Typography>
            </div>
            <TimelineIcon className={ classes.backgroundIcon } />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={8} lg={9} xl={6}>
          <Paper elevation={ 2 } className={ classes.stat }>
            <div className={ classes.blockchains }>
              <img src={'/blockchains/ETH.svg'} className={ `${classes.blockchain} ${classes.blockchain1}` }/>
              <img src={'/blockchains/FTM.png'} className={ `${classes.blockchain} ${classes.blockchain2}` }/>
              <img src={'/blockchains/BTC.png'} className={ `${classes.blockchain} ${classes.blockchain3}` }/>
              <img src={'/blockchains/FSN.svg'} className={ `${classes.blockchain} ${classes.blockchain4}` }/>
              <div className={ `${classes.blockchain} ${classes.blockchain5}` }>
                <MoreHorizIcon className={ classes.elipsis } />
              </div>
            </div>
            <div className={ `${classes.statsValues} ${classes.statsValuesRight}` }>
              <Typography variant='h1'>{ blockchains === null ? <Skeleton /> : blockchains } Chains</Typography>
              <Typography variant='h5' color='textSecondary' >Connected via the bridged</Typography>
            </div>
            <LinkIcon className={ classes.backgroundIcon } />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
          <Paper elevation={ 2 } className={ classes.stat }>
            <div className={ classes.statsValues }>
              <Typography variant='h1'>{ bridgedAssets === null ? <Skeleton /> : bridgedAssets } Assets</Typography>
              <Typography variant='h5' color='textSecondary'>Supported</Typography>
            </div>
            <div className={ classes.blockchains }>
              <img src={'/tokens/BTC.png'} className={ `${classes.blockchain} ${classes.blockchain1}` }/>
              <img src={'/tokens/KP3R.png'} className={ `${classes.blockchain} ${classes.blockchain2}` }/>
              <img src={'/tokens/RIO.png'} className={ `${classes.blockchain} ${classes.blockchain3}` }/>
              <img src={'/tokens/YFI.png'} className={ `${classes.blockchain} ${classes.blockchain4}` }/>
              <div className={ `${classes.blockchain} ${classes.blockchain5}` }>
                <MoreHorizIcon className={ classes.elipsis } />
              </div>
            </div>
            <BlurOnIcon className={ classes.backgroundIcon } />
          </Paper>
        </Grid>
      </Grid>
    </div>
  )

}

export default withTheme(Stats)
