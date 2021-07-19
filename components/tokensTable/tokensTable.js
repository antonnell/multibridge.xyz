import React, { useState } from "react";
import styles from "./tokens.module.scss";
import ImageTextCell from "../../components_multichain/common/imagetextcell/ImageTextCell";

import Grid from "../../components_multichain/common/grid/Grid";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { lighten, makeStyles } from "@material-ui/core/styles";
import { formatCurrency, formatAddress } from '../../utils'
import stores from '../../stores';
import {
  ERROR
} from '../../stores/constants'
import useBreakpoints from '../../framework/useBreakpoints';
/**
 * Renders tokens grid
 */

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    padding: "0px 24px",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  inline: {
    display: "flex",
    position: "relative",
    alignItems: "center",
    "&:hover": {
      "& $metamaskButton": {
        display: "block",
      },
      "& $metamaskButtonPlaceholder": {
        display: "none",
      },
    },
  },
  metamaskButton: {
    display: "none",
    alignItems: "center",
  },
  metamaskButtonPlaceholder: {
    width: "40px",
    height: "40px",
  },
  icon: {
    marginRight: "12px",
  },
  textSpaced: {
    lineHeight: "1.5",
    display: "flex",
    alignItems: "center",
  },
  textSpacedCursor: {
    lineHeight: "1.5",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  textSpacedQueued: {
    color: "rgb(255, 144, 41)",
    lineHeight: "1.5",
    display: "flex",
    alignItems: "center",
  },
  textSpacedLive: {
    color: "#4eaf0a",
    lineHeight: "1.5",
    display: "flex",
    alignItems: "center",
  },
  cell: {
    padding: "24px",
  },
  cellAddress: {
    padding: "24px",
    cursor: "pointer",
  },
  aligntRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  skelly: {
    marginBottom: "12px",
    marginTop: "12px",
  },
  skelly1: {
    marginBottom: "12px",
    marginTop: "24px",
  },
  skelly2: {
    margin: "12px 6px",
  },
  tableBottomSkelly: {
    display: "flex",
    justifyContent: "flex-end",
  },
}));
export const tokenCellRenderer = (value) => {
  var img_url = value.value.url;
  var title = value.node.data.name;
  return (
    <div className={styles.imageTextCell}>
      <img src={img_url} className={styles.img} alt="icon" />
      <div className={styles.text}>
        <div className={styles.subtitle}>{title}</div>
      </div>
    </div>
  );
};
export const statusRenderer = (value) => {
  const classes = useStyles();

  var status = value.value;
  return (
    <div className={styles.imageTextCell}>
     
      <div className={styles.text}>
        <div className={ status === 'Queued' || status === 'Pending' ? classes.textSpacedQueued : classes.textSpacedLive }>{status}</div>
      </div>
    </div>
  );
};

export const chainRenderer = (value) => {
  const classes = useStyles();

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

  const toHex = (num) => {
    return '0x'+parseInt(num).toString(16)
  }


  var row = value.value;
  var title =
    row.name !== undefined
      ? "Add " + row.name + " to MetaMask"
      : "Add - to metaMask";
      var coldef = value.colDef.field;
  var answ = coldef.includes('srcChain') ? 'src': 'dest';
  var chainInfo = answ.includes('src') ?  value.data.srcChain : value.data.dstChain;
  // console.log(answ, chainInfo, row);
  return (
    //  null
    <div className={classes.cell}>
      <div className={classes.inline}>
    
        <img
          src={`/blockchains/${row.icon}`}
          width={30}
          height={30}
          className={classes.icon}
          alt="icon"
        />
        <div className={classes.textSpaced}>{row.chainID}</div>
        {row.chainID !== "1" ? (
          <Tooltip title={title}>
            <div>
              <div style={{ width: "40px", height: "40px" }}></div>
              <IconButton
                className={classes.metamaskButton}
                onClick={() => {
                  addToNetwork(row, answ, chainInfo);
                }}
                style={{ marginTop: "-100%" }}
              >
                <img
                  src={`/connectors/icn-metamask.svg`}
                  width={10}
                  height={10}
                  alt=""
                />
              </IconButton>
            </div>
          </Tooltip>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export const contractRenderer = (value) => {
  const classes = useStyles();
  var row = value.value;
  var data =value.data

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
    // if(!accounts || accounts.length === 0) {
      return stores.emitter.emit(ERROR, 'Function error')
    // }

    // window.ethereum.request({
    //   method: 'wallet_watchAsset',
    //   params: params,
    // })
    // .then((result) => {
    //   console.log(result)
    // })
    // .catch((error) => {
    //   stores.emitter.emit(ERROR, error.message ? error.message : error)
    //   console.log(error)
    // });
  }
  const addressClicked = (url) => {
    window.open(url, '_blank')
  }

  return (
    <div className={classes.cell} style={{flexDirection: 'row'}}>
      <div className={classes.inline}  style={{flexDirection: 'row'}}>
      <Tooltip title={`View in explorer`}>
      <div className={classes.textSpaced} onClick={ () => { addressClicked(data.srcContract.url) }}>{ data.srcContract.address === 'Native' ? 'Native' : formatAddress(data.srcContract.address) }</div>
      </Tooltip>
      { data.srcContract.address && data.srcContract.address != 'Native' && data.srcContract.address != '0x0' ?
                          <Tooltip title={`Add ${data.name} on ${data.srcChain.name} to MetaMask`}>
                            <div>
                              <div className={ classes.metamaskButtonPlaceholder}></div>
                              <IconButton
                                className={ classes.metamaskButton }
                                onClick={ () => { addToTokenList(data, 'src') } }
                                >
                                <img src={`/connectors/icn-metamask.svg`} width={ 10 } height={ 10 } alt='' />
                              </IconButton>
                            </div>
                          </Tooltip>
                          :
                          ''
                        }

      </div>
    </div>
  );
};
export const mpcRenderer = (value) => {
  const classes = useStyles();
  const addressClicked = (url) => {
    window.open(url, '_blank')
  }
  var row = value.value;
  return (
    <div className={styles.imageTextCell}>
     
      <div className={styles.text}>
        <div className={ classes.textSpacedCursor  } onClick={ () => { addressClicked(row.url) } }>{ row.address === 'Native' ? 'Native' : formatAddress(row.address) }</div>
      </div>
    </div>
  );
};

export default function TokensTable({ swapTokens, chainMap }) {
  const classes = useStyles();

  const rowDataInitial = [];

  // console.log('tokens- ', swapTokens);

  const mapChainIDToChain = (chainID, row) => {
    let c = chainMap[chainID];

    if (c) {
      return chainMap[chainID];
    } else {
      switch (row.symbol) {
        case "BTC":
          return {
            icon: "BTC.png",
            chainID: "BTC",
          };
        case "FTM":
          return {
            icon: "FTM.png",
            chainID: "FTM",
          };
        case "MATIC":
          return {
            icon: "MATIC.png",
            chainID: "MATIC",
          };
        case "xDAI":
          return {
            icon: "STAKE.png",
            chainID: "xDAI",
          };
        case "BLOCK":
          return {
            icon: "BLOCK.png",
            chainID: "BLOCK",
          };
        case "LTC":
          return {
            icon: "LTC.png",
            chainID: "LTC",
          };
        case "HT":
          return {
            icon: "HT.svg",
            chainID: "HT",
          };
        default:
          return {};
      }
    }
  };

  var temp_tok = swapTokens.map((row) => {
    const srcChain = mapChainIDToChain(row.srcChainID, row);
    const dstChain = mapChainIDToChain(row.destChainID, row);
    return {
      ...row,
      srcChain: srcChain,
      dstChain: dstChain,
    };
  });
  const [rowData] = useState(temp_tok);
   // Do not use flex:1 for mobile form factor. This shrinks the columns
  // to unreadable state. use fixed width instead, to allow horizontal scroll
  const { isMobile } = useBreakpoints();
  const columnWidthProps = isMobile ? { minWidth: 200 } : { flex: 1 };
  const columnDefs = [
    {
      headerName: "Token",
      field: "logo",
      cellRenderer: "tokenCellRenderer",
      headerClass: styles.sentHeader,
      width: 150,
    },
    {
      headerName: "Symbol",
      field: "symbol",
      width: 80,
    },
    {
      field: "decimals",
      width: 80,
    },
    {
      headerName: "Src Chain",
      field: "srcChain",
      cellRenderer: "chainRenderer",
      width: 110,

    },
    {
      headerName: "Dest Chain",
      field: "dstChain",
      cellRenderer: "chainRenderer",
      width: 110,

    },
    {
      headerName: "Src Contract",
      field: "srcContract",
      cellRenderer: "contractRenderer",
      ...columnWidthProps,
    },
    {
      headerName: "Dest Contract",
      field: "destContract",
      cellRenderer: "contractRenderer",
      ...columnWidthProps,
    },
    {
      headerName: 'MPC Contract',
      field: 'mpc',
      cellRenderer: 'mpcRenderer',
      ...columnWidthProps,
    },
    {
      field: 'status',
      cellRenderer: 'statusRenderer',
      width: 100,
    },
  ];
  const frameworkComponents = {
    tokenCellRenderer,
    chainRenderer,
    contractRenderer,
    statusRenderer,
    mpcRenderer
    
  };
  const defaultColDef = {
    width: 100,
    sortable: true,
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
