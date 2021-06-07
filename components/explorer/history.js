import React, { useState, useEffect } from "react";
import { Paper, Typography, TextField, InputAdornment } from "@material-ui/core";

import HistoryTable from "./historyTable";
import SearchIcon from "@material-ui/icons/Search";

import classes from "./history.module.css";

import stores from "../../stores";
import { ERROR, GET_EXPLORER, EXPLORER_RETURNED } from "../../stores/constants";

function History({ theme }) {
  const [swapHistory, setSwapHistory] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(function () {
    const swapHistoryReturned = (history) => {
      console.log(history);
      setSwapHistory(history);
    };

    stores.emitter.on(EXPLORER_RETURNED, swapHistoryReturned);
    stores.dispatcher.dispatch({ type: GET_EXPLORER });

    return () => {
      stores.emitter.removeListener(EXPLORER_RETURNED, swapHistoryReturned);
    };
  }, []);

  const onSearchChanged = (event) => {
    setSearch(event.target.value);
  };

  const onSearchKeydown = (event) => {
    if(event.which === 13) {

      setSwapHistory(null)
      stores.dispatcher.dispatch({ type: GET_EXPLORER, content: { value: search } });
    }
  }
  return (
    <Paper elevation={0} className={classes.historyContainer}>
      <TextField
        className={classes.searchContainer}
        variant="outlined"
        fullWidth
        placeholder="search account"
        value={search}
        onChange={onSearchChanged}
        onKeyDown={onSearchKeydown}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <HistoryTable swapHistory={swapHistory} />
    </Paper>
  );
}

export default History;
