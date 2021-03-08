import Head from 'next/head'
import Layout from '../../../../../components/layout/layout.js'
import {
  Typography,
  Paper,
} from '@material-ui/core'
import classes from '../../../swap.module.css'
import SwapComponent from '../../../../../components/swapComponent'

function Swap(props) {
  console.log(props)
  return (
    <Layout changeTheme={ props }>
      <Head>
        <title>Swaps</title>
      </Head>
      <div className={ classes.swapContainer }>
        <SwapComponent slug={ props.slug } />
      </div>
    </Layout>
  )
}

export async function getServerSideProps(ctx) {

  console.log(ctx.params)

  return {
    props: {
      slug: ctx.params
    }
  };
}

export default Swap
