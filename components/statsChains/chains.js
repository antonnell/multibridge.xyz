import React, { useState } from 'react';
import { Paper } from '@material-ui/core/'
import ChainsTable from './chainsTable'

import classes from './stats.module.css'

import stores from '../../stores'

function Stats({ theme }) {

  const [ blockchains, setBlockchains ] = useState(stores.accountStore.getStore('chains'))

  return (
    <div className={ classes.statsDashboard} >
      <Paper elevation={2} className={ classes.tableContainer }>
        <ChainsTable blockchains={ blockchains } />
      </Paper>
    </div>
  )

}

export default Stats
