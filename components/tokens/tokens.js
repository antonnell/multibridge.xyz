import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  TextField,
  InputAdornment
} from '@material-ui/core';

import SearchIcon from '@material-ui/icons/Search';
import TokensTable from './tokensTable'

import classes from './tokens.module.css'

import stores from '../../stores'
import {
  ERROR,
  GET_SWAP_TOKENS,
  SWAP_TOKENS_RETURNED,
} from '../../stores/constants'

function Tokesns({ theme }) {

  const [ swapTokens, setSwapTokens ] = useState(null)
  const [ search, setSearch ] = useState('')
  const [ filteredSwapTokens, setFilteredSwapTokens ] = useState(null)

  useEffect(function() {
    const swapTokensReturned = () => {
      setSwapTokens(stores.swapStore.getStore('swapTokens'))
      setFilteredSwapTokens(stores.swapStore.getStore('swapTokens'))
    }

    stores.emitter.on(SWAP_TOKENS_RETURNED, swapTokensReturned)
    stores.dispatcher.dispatch({ type: GET_SWAP_TOKENS })

    return () => {
      stores.emitter.removeListener(SWAP_TOKENS_RETURNED, swapTokensReturned)
    }
  },[]);


  const onSearchChanged = (event) => {
    setSearch(event.target.value)

    setFilteredSwapTokens(swapTokens.filter((token) => {
      const search = event.target.value

      if(!search || search === '') {
        return true
      }

      return token.name.toLowerCase().includes(search.toLowerCase()) ||
            token.symbol.toLowerCase().includes(search.toLowerCase()) ||
            token.srcChainID.toLowerCase().includes(search.toLowerCase()) ||
            token.destChainID.toLowerCase().includes(search.toLowerCase()) ||
            token.srcContract.address.toLowerCase().includes(search.toLowerCase()) ||
            token.destContract.address.toLowerCase().includes(search.toLowerCase()) ||
            token.mpc.address.toLowerCase().includes(search.toLowerCase())
    }))
  }

  const chainMap = stores.accountStore.getStore('chainIDMapping')

  return (
    <Paper elevation={ 0 } className={ classes.historyContainer }>
      <div className={ classes.filters }>
        <a href='https://dard6erxu8t.typeform.com/to/C7RwF08A' target="_blank" className={ classes.link }><Typography>Can't find a token? Request to add it</Typography></a>
        <TextField
          className={ classes.searchContainer }
          variant="outlined"
          placeholder="ETH, FTM, ..."
          value={ search }
          onChange={ onSearchChanged }
          InputProps={{
            startAdornment: <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>,
          }}
        />
      </div>
      <TokensTable swapTokens={ filteredSwapTokens } chainMap={ chainMap }/>
    </Paper>
  )
}

export default Tokesns
