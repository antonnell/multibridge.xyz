import Head from 'next/head'
import Layout from '../../components/layout/layout.js'
import {
  Typography,
  Paper,
} from '@material-ui/core'
import classes from './tokens.module.css'
import TokensComponent from '../../components/tokens'

function Tokens({ changeTheme }) {

  return (
    <Layout changeTheme={ changeTheme }>
      <Head>
        <title>Swaps</title>
      </Head>
      <div className={ classes.historyContainer }>
        <TokensComponent />
      </div>
    </Layout>
  )
}

export default Tokens
