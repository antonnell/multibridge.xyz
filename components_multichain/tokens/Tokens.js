import React, { useState } from 'react';
import styles from './tokens.module.scss';
import ImageTextCell from '../common/imagetextcell/ImageTextCell';
import {
  contractRenderer,
  chainRenderer,
  statusRenderer,
} from '../common/grid/Renderers';
import Grid from '../common/grid/Grid';
/**
 * Renders tokens grid
 */
export default function Tokens() {
  const rowDataInitial = [];
  // TODO: API: Replace with data source
  for (let i = 0; i < 101; i += 1) {
    rowDataInitial.push({
      sent: {
        icon: '/images/USDT.svg',
        text: 'Token',
      },
      symbol: '8',
      decimals: 8,
      sourceChain: {
        icon: '/images/BSCMainNetIcon.svg',
        text: `${i}`,
      },
      destinationChain: {
        icon: '/images/BSCMainNetIcon.svg',
        text: `${i + 100}`,
      },
      sourceContract: '12345678901234567890',
      destinationContract: '12345678901234567890',
      mpcContract: '12345678901234567890',
      status: true,
    });
  }

  const [rowData] = useState(rowDataInitial);

  const sentCellRenderer = ({ value: { icon, text } }) => (
    <ImageTextCell icon={icon} title={text} />
  );
  const columnDefs = [
    {
      field: 'sent',
      cellRenderer: 'sentCellRenderer',
      headerClass: styles.sentHeader,
    },
    {
      field: 'symbol',
      width: 125,
    },
    {
      field: 'decimals',
      width: 125,
    },
    {
      headerName: 'Src Chain',
      field: 'sourceChain',
      cellRenderer: 'chainRenderer',
    },
    {
      headerName: 'Dest Chain',
      field: 'destinationChain',
      cellRenderer: 'chainRenderer',
    },
    {
      headerName: 'Src Contract',
      field: 'sourceContract',
      cellRenderer: 'contractRenderer',
      flex: 1,
    },
    {
      headerName: 'Dest Contract',
      field: 'destinationContract',
      cellRenderer: 'contractRenderer',
      flex: 1,
    },
    {
      headerName: 'MPC Contract',
      field: 'mpcContract',
      cellRenderer: 'contractRenderer',
      flex: 1,
    },
    {
      field: 'status',
      cellRenderer: 'statusRenderer',
      width: 100,
    },
  ];
  const frameworkComponents = {
    sentCellRenderer,
    contractRenderer,
    chainRenderer,
    statusRenderer,
  };
  const defaultColDef = {
    width: 150,
  };
  return (
    <Grid
      className={styles.tokens}
      rowData={rowData}
      frameworkComponents={frameworkComponents}
      columnDefs={columnDefs}
      defaultColDef={defaultColDef}
    />
  );
}
