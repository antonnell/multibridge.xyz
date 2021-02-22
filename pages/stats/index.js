import Head from 'next/head'
import Layout from '../../components/layout/layout.js'
import {
  Typography,
  Paper,
} from '@material-ui/core'
import classes from './stats.module.css'
import StatsComponent from '../../components/stats'

function History({ changeTheme }) {

  return (
    <Layout changeTheme={ changeTheme }>
      <Head>
        <title>Swaps</title>
      </Head>
      <div className={ classes.swapContainer }>
        <StatsComponent />
      </div>
    </Layout>
  )
}

export default History

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
