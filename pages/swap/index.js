import Head from 'next/head'
import Layout from '../../components/layout/layout.js'
import {
  Typography,
  Paper,
} from '@material-ui/core'
import classes from './swap.module.css'
import SwapComponent from '../../components/swapComponent'

function Swap({ changeTheme }) {

  return (
    <Layout changeTheme={ changeTheme }>
      <Head>
        <title>Swaps</title>
      </Head>
      <div className={ classes.swapContainer }>
        <SwapComponent />
      </div>
    </Layout>
  )
}

export default Swap

/*

<div className={ classes.explanationContainer }>
  <div className={ classes.explanationHeader }>
    <Typography variant='h3'>YEARN</Typography>
    <Typography variant='h4'>swaps</Typography>
  </div>
  <div className={ classes.explanationSubheader }>
    <Typography variant='h2'>Cross-chain swaps, <span className={ classes.accentColor }>made simple</span>.</Typography>
  </div>
</div>

*/
