import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import PublishIcon from '@material-ui/icons/Publish';
import GetAppIcon from '@material-ui/icons/GetApp';
import Button from '@material-ui/core/Button';

import BigNumber from 'bignumber.js'

import stores from '../../stores'
import {
  ERROR
} from '../../stores/constants'

import { formatCurrency, formatAddress } from '../../utils'

import * as moment from 'moment'

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Token' },
  { id: 'symbol', numeric: false, disablePadding: false, label: 'Symbol' },
  { id: 'decimals', numeric: false, disablePadding: false, label: 'Decimals' },
  { id: 'srcChainID', numeric: false, disablePadding: false, label: 'Src Chain' },
  { id: 'destChainID', numeric: false, disablePadding: false, label: 'Dest Chain' },
  { id: 'srcContract', numeric: false, disablePadding: false, label: 'Src Contract' },
  { id: 'destContract', numeric: false, disablePadding: false, label: 'Dest Contract' },
  { id: 'mpc', numeric: false, disablePadding: false, label: 'MPC Contract' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={ 'default' }
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: '0px 24px'
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  inline: {
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    '&:hover': {
      "& $metamaskButton": {
        display: 'block'
      },
      "& $metamaskButtonPlaceholder": {
        display: 'none'
      }
   }
  },
  metamaskButton: {
    display: 'none',
  },
  metamaskButtonPlaceholder: {
    width: '40px',
    height: '40px'
  },
  icon: {
    marginRight: '12px'
  },
  textSpaced: {
    lineHeight: '1.5',
    display: 'flex',
    alignItems: 'center'
  },
  textSpacedCursor: {
    lineHeight: '1.5',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  },
  textSpacedQueued: {
    color: 'rgb(255, 144, 41)',
    lineHeight: '1.5',
    display: 'flex',
    alignItems: 'center'
  },
  textSpacedLive: {
    color: '#4eaf0a',
    lineHeight: '1.5',
    display: 'flex',
    alignItems: 'center'
  },
  cell: {
    padding: '24px'
  },
  cellAddress: {
    padding: '24px',
    cursor: 'pointer'
  },
  aligntRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  skelly: {
    marginBottom: '12px',
    marginTop: '12px'
  },
  skelly1: {
    marginBottom: '12px',
    marginTop: '24px'
  },
  skelly2: {
    margin: '12px 6px'
  },
  tableBottomSkelly: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
}));

export default function EnhancedTable({ swapTokens, chainMap }) {
  console.log(chainMap)
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if(!swapTokens) {
    let width = 1000
    if(window && window.innerWidth) {
      if(window.innerWidth > 1200) {
        width = window.innerWidth - 400
      } else {
        width = window.innerWidth - 100
      }
    }

    return(<div className={classes.root}>
      <Skeleton variant="rect" width={width} height={40} className={ classes.skelly1} />
      <Skeleton variant="rect" width={width} height={70} className={ classes.skelly} />
      <Skeleton variant="rect" width={width} height={70} className={ classes.skelly} />
      <Skeleton variant="rect" width={width} height={70} className={ classes.skelly} />
      <Skeleton variant="rect" width={width} height={70} className={ classes.skelly} />
      <Skeleton variant="rect" width={width} height={70} className={ classes.skelly} />
      <div className={ classes.tableBottomSkelly }>
        <Skeleton variant="rect" width={100} height={30} className={ classes.skelly2} />
        <Skeleton variant="rect" width={40} height={30} className={ classes.skelly2} />
        <Skeleton variant="rect" width={60} height={30} className={ classes.skelly2} />
        <Skeleton variant="rect" width={100} height={30} className={ classes.skelly2} />
      </div>
    </div>)
  }

  const addressClicked = (url) => {
    window.open(url, '_blank')
  }

  const mapChainIDToChain = (chainID, row) => {
    let c = chainMap[chainID]

    if(c) {
      return chainMap[chainID]
    } else {
      switch (row.symbol) {
        case 'BTC':
          return {
            icon: 'BTC.png',
            chainID: 'BTC'
          }
        case 'FTM':
          return {
            icon: 'FTM.png',
            chainID: 'FTM'
          }
        case 'MATIC':
          return {
            icon: 'MATIC.png',
            chainID: 'MATIC'
          }
        case 'xDAI':
          return {
            icon: 'STAKE.png',
            chainID: 'xDAI'
          }
        case 'BLOCK':
          return {
            icon: 'BLOCK.png',
            chainID: 'BLOCK'
          }
        case 'LTC':
          return {
            icon: 'LTC.png',
            chainID: 'LTC'
          }
        case 'HT':
          return {
            icon: 'HT.svg',
            chainID: 'HT'
          }
        default:
          return {}
      }
    }
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, swapTokens.length - (page * rowsPerPage));


  const toHex = (num) => {
    return '0x'+parseInt(num).toString(16)
  }

  const addToTokenList = async (token, srcOrDest) => {
    const web3Provder = await stores.accountStore.getWeb3Provider()
    const params = {
      type: 'ERC20',
      options: {
        address: srcOrDest === 'src' ? token.srcContract.address : token.destContract.address,
        symbol: token.symbol,
        decimals: token.decimals,
        image: token.logo.url,
      }
    }

    window.ethereum.request({
      method: 'wallet_watchAsset',
      params: params,
    })
    .then((result) => {
      console.log(result)
    })
    .catch((error) => {
      stores.emitter.emit(ERROR, error.message ? error.message : error)
      console.log(error)
    });
  }

  const addToNetwork = async (row, type, chain) => {
    const web3Provder = await stores.accountStore.getWeb3Provider()

    const params = {
      chainId: toHex(chain.chainID), // A 0x-prefixed hexadecimal string
      chainName: chain.name,
      nativeCurrency: {
        name: chain.symbol,
        symbol: chain.symbol, // 2-6 characters long
        decimals: chain.decimals,
      },
      rpcUrls: [chain.rpcURLdisplay],
      blockExplorerUrls: [chain.explorer]
    }

    web3Provder.eth.getAccounts((error, accounts) => {

      if(!accounts || accounts.length === 0) {
        return stores.emitter.emit(ERROR, 'Connect your account in MetaMask to add a chain')
      }

      window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [params, accounts[0]],
      })
      .then((result) => {
        console.log(result)
      })
      .catch((error) => {
        stores.emitter.emit(ERROR, error.message ? error.message : error)
        console.log(error)
      });
    })
  }


  const renderChainTooltip = (data, type) => {
    return (
      <div className={ classes.swapInfoContainer }>
        <Button
          variant='outlined'
        >
          Add to MetaMask
        </Button>
      </div>
    )
  }

  return (
    <div className={classes.root}>
      <TableContainer>
        <Table
          className={classes.table}
          aria-labelledby="tableTitle"
          size={'medium'}
          aria-label="enhanced table"
        >
          <EnhancedTableHead
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={swapTokens.length}
          />
          <TableBody>
            {stableSort(swapTokens, getComparator(order, orderBy))
              .slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
              .map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                const srcChain = mapChainIDToChain(row.srcChainID, row)
                const dstChain = mapChainIDToChain(row.destChainID, row)

                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={row.txid}
                  >
                    <TableCell className={ classes.cell }>
                      <div className={ classes.inline }>
                        <img src={`${row.logo.url}`} width={ 40 } height={ 40 } className={ classes.icon } />
                        <Typography variant='h5' className={ classes.textSpaced } >{ row.name }</Typography>
                      </div>
                    </TableCell>
                    <TableCell className={ classes.cell }>
                      <Typography variant='h5' className={ classes.textSpaced }>{ row.symbol }</Typography>
                    </TableCell>
                    <TableCell className={ classes.cell }>
                      <Typography variant='h5' className={ classes.textSpaced }>{ row.decimals }</Typography>
                    </TableCell>
                    <TableCell className={ classes.cell }>
                      <div className={ classes.inline }>
                        <img src={`/blockchains/${srcChain.icon}`} width={ 30 } height={ 30 } className={ classes.icon } />
                        <Typography variant='h5' className={ classes.textSpaced } >{ srcChain.chainID ? srcChain.chainID : row.srcChainID }</Typography>
                        { srcChain.chainID !== '1' ?
                          <Tooltip title={`Add ${srcChain.name} to MetaMask`}>
                            <div>
                              <div className={ classes.metamaskButtonPlaceholder}></div>
                              <IconButton
                                className={ classes.metamaskButton }
                                onClick={ () => { addToNetwork(row, 'src', srcChain) } }
                              >
                                <img src={`/connectors/icn-metamask.svg`} width={ 10 } height={ 10 } alt='' />
                              </IconButton>
                            </div>
                          </Tooltip>
                          :
                          ''
                        }
                      </div>
                    </TableCell>
                    <TableCell className={ classes.cell }>
                      <div className={ classes.inline }>
                        <img src={`/blockchains/${dstChain.icon}`} width={ 30 } height={ 30 } className={ classes.icon } />
                        <Typography variant='h5' className={ classes.textSpaced } >{ dstChain.chainID ? dstChain.chainID : row.destChainID }</Typography>
                        { dstChain.chainID !== '1' ?
                          <Tooltip title={`Add ${dstChain.name} to MetaMask`}>
                            <div>
                              <div className={ classes.metamaskButtonPlaceholder}></div>
                              <IconButton
                                className={ classes.metamaskButton }
                                onClick={ () => { addToNetwork(row, 'dest', dstChain) } }
                                >
                                <img src={`/connectors/icn-metamask.svg`} width={ 10 } height={ 10 } alt='' />
                              </IconButton>
                            </div>
                          </Tooltip>
                          :
                          ''
                        }
                      </div>
                    </TableCell>
                    <TableCell className={ classes.cell }>
                      <div className={ classes.inline }>
                        <Tooltip title={`View in explorer`}>
                          <Typography variant='h5' className={ classes.textSpacedCursor } onClick={ () => { addressClicked(row.srcContract.url) } }>{ row.srcContract.address === 'Native' ? 'Native' : formatAddress(row.srcContract.address) }</Typography>
                        </Tooltip>
                        { row.srcContract.address && row.srcContract.address != 'Native' && row.srcContract.address != '0x0' ?
                          <Tooltip title={`Add ${row.name} on ${srcChain.name} to MetaMask`}>
                            <div>
                              <div className={ classes.metamaskButtonPlaceholder}></div>
                              <IconButton
                                className={ classes.metamaskButton }
                                onClick={ () => { addToTokenList(row, 'src') } }
                                >
                                <img src={`/connectors/icn-metamask.svg`} width={ 10 } height={ 10 } alt='' />
                              </IconButton>
                            </div>
                          </Tooltip>
                          :
                          ''
                        }
                      </div>
                    </TableCell>
                    <TableCell className={ classes.cell }>
                      <div className={ classes.inline }>
                        <Tooltip title={`View in explorer`}>
                          <Typography variant='h5' className={ classes.textSpacedCursor } onClick={ () => { addressClicked(row.destContract.url) } }>{ row.destContract.address === 'Native' ? 'Native' : (row.destContract.address === '0x0' ? '0x0' : formatAddress(row.destContract.address)) }</Typography>
                        </Tooltip>
                        { row.destContract.address && row.destContract.address != 'Native' && row.destContract.address != '0x0' ?
                          <Tooltip title={`Add ${row.name} on ${dstChain.name} to MetaMask`}>
                            <div>
                              <div className={ classes.metamaskButtonPlaceholder}></div>
                              <IconButton
                                className={ classes.metamaskButton }
                                onClick={ () => { addToTokenList(row, 'dest') } }
                                >
                                <img src={`/connectors/icn-metamask.svg`} width={ 10 } height={ 10 } alt='' />
                              </IconButton>
                            </div>
                          </Tooltip>
                          :
                          ''
                        }
                      </div>
                    </TableCell>
                    <TableCell className={ classes.cell }>
                      <Tooltip title={`View in explorer`}>
                        <Typography variant='h5' className={ classes.textSpacedCursor } onClick={ () => { addressClicked(row.mpc.url) } }>{ row.mpc.address === 'Native' ? 'Native' : formatAddress(row.mpc.address) }</Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell className={ classes.cell }>
                      <Typography variant='h5' className={ row.status === 'Queued' || row.status === 'Pending' ? classes.textSpacedQueued : classes.textSpacedLive }>{ row.status }</Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={swapTokens.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
}
