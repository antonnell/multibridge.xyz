import React, { useState } from 'react';
import moment from 'moment';
import Grid from '../common/grid/Grid';
import {
  addressRenderer,
  timeRenderer,
  statusRenderer,
  sentCellRenderer,
} from '../common/grid/Renderers';
import styles from './explorer.module.scss';
import useBreakpoints from '../../framework/useBreakpoints';

/**
 * Display Grid with transactions
 */

function TransactionList({ swapHistory }) {
  const rowDataInitial = [];

  const getStatus = (status) => {
    // let statusType = 'Pending';
    let statusType = false;
    if ([0, 5].includes(status)) {
      // statusType = 'Confirming';
      statusType = true;
    } else if ([8, 9].includes(status)) {
      // statusType = 'Success'; // fusionsuccess
      statusType = true;
    } else if ([10].includes(status)) {
      // statusType = 'Success'; // outnetsuccess
      statusType = true;
    } else if ([1, 2, 3, 4, 6, 11].includes(status)) {
      // statusType = 'Failure';
      statusType = false;
    } else if ([20].includes(status)) {
      // statusType = 'Timeout';
      statusType = false;
    } else {
      statusType = false;
      // statusType = 'Pending';
    }
    return statusType;
  };

  if (swapHistory !== null) {
    const hist = swapHistory.map((el) => ({
      ...el,
      sent: {
        value: el.value,
        tokenMetadata: el.tokenMetadata,
        swapvalue: el.swapvalue,
      },
      from: {
        network: el.fromDescription,
        coinIcon: el.fromChain?.icon
          ? el.fromChain?.icon
          : '/tokens/unknown-logo.png',
        address: el.txid,
      },
      to: {
        network: el.toDescription,
        coinIcon: el.toChain?.icon,
        address: el.swaptx,
      },
      datetime: el.txtime,
      status: getStatus(el.status),
    }));

    const [rowData] = useState(hist);

    // Do not use flex:1 for mobile form factor. This shrinks the columns
    // to unreadable state. use fixed width instead, to allow horizontal scroll
    const { isMobile } = useBreakpoints();
    const columnWidthProps = isMobile ? { minWidth: 350 } : { flex: 1 };

    const columnDefs = [
      {
        field: 'sent',
        cellRenderer: 'sentCellRenderer',
        headerClass: styles.sentHeader,
        ...columnWidthProps,
      },
      {
        field: 'from',
        cellRenderer: 'addressRenderer',
        ...columnWidthProps,
      },
      {
        field: 'to',
        cellRenderer: 'addressRenderer',
        ...columnWidthProps,
      },
      {
        headerName: 'Time',
        field: 'datetime',
        cellRenderer: 'timeRenderer',
        width: 150,
      },
      {
        field: 'status',
        cellRenderer: 'statusRenderer',
        width: 125,
      },
    ];

    const frameworkComponents = {
      sentCellRenderer,
      addressRenderer,
      timeRenderer,
      statusRenderer,
    };

    // const dC = rowData.map((el) => ({
    //   ...el,
    //   sent: {
    //     value: el.value,
    //     tokenMetadata: el.tokenMetadata,
    //     swapvalue: el.swapvalue,
    //   },
    //   from: {

    //   },
    // }));
    return (
      <Grid
        rowData={rowData}
        frameworkComponents={frameworkComponents}
        columnDefs={columnDefs}
      />
    );
  }else{
  return null;
  }
}

export default TransactionList;
