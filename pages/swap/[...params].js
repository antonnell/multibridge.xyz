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
