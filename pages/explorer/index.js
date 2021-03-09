import Head from 'next/head'
import Layout from '../../components/layout/layout.js'
import {
  Typography,
  Paper,
} from '@material-ui/core'
import classes from './explorer.module.css'
import ExplorerComponent from '../../components/explorer'

function Explorer({ changeTheme }) {

  return (
    <Layout changeTheme={ changeTheme }>
      <Head>
        <title>Swaps</title>
      </Head>
      <div className={ classes.historyContainer }>
        <ExplorerComponent />
      </div>
    </Layout>
  )
}

export default Explorer

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
