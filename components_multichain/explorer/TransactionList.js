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

function TransactionList() {
  const rowDataInitial = [];
  // TODO: API: Replace with data source
  for (let i = 0; i < 225; i += 1) {
    rowDataInitial.push({
      sent: {
        icon: '/images/USDT.svg',
        sentAmount: i + 0.1,
        receivedAmount: 0.0,
      },
      from: {
        network: 'ABCD Network',
        coin: 'Etherium',
        coinIcon: '/images/BSCMainNetIcon.svg',
        address: '123456789012345678901234567890123',
      },
      to: {
        network: 'ABCD Network',
        coin: 'Etherium',
        coinIcon: '/images/BSCMainNetIcon.svg',
        address: '123456789012345678901234567890123',
      },
      datetime: moment().toString(),
      status: true,
    });
  }

  const [rowData] = useState(rowDataInitial);

  // Do not use flex:1 for mobile form factor. This shrinks the columns
  // to unreadable state. use fixed width instead, to allow horizontal scroll
  const { isMobile } = useBreakpoints();
  const columnWidthProps = isMobile ? { minWidth: 200 } : { flex: 1 };

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
      width: 200,
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
  return (
    <Grid
      rowData={rowData}
      frameworkComponents={frameworkComponents}
      columnDefs={columnDefs}
    />
  );
}
export default TransactionList;
