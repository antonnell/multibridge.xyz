import React, { useState } from "react";
import styles from "./tokens.module.scss";
import ImageTextCell from "../../components_multichain/common/imagetextcell/ImageTextCell";

import Grid from "../../components_multichain/common/grid/Grid";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { lighten, makeStyles } from "@material-ui/core/styles";
import { formatCurrency, formatAddress } from '../../utils'
import stores from '../../stores';

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

  var row = value.value;
  var title =
    row.name !== undefined
      ? "Add " + row.name + " to MetaMask"
      : "Add - to metaMask";
  //  console.log('cell render ',row.name);
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
                  addToNetwork(row, "src", srcChain);
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

  return (
    <div className={classes.cell}>
      <div className={classes.inline}>
      <div className={classes.textSpaced}>{ row.address === 'Native' ? 'Native' : formatAddress(row.address) }</div>
      { row.address && row.address != 'Native' && row.address != '0x0' ?
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

  var row = value.value;
  return (
    <div className={styles.imageTextCell}>
     
      <div className={styles.text}>
        <div className={ classes.textSpacedCursor  }>{ row.address === 'Native' ? 'Native' : formatAddress(row.address) }</div>
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
      width: 125,
    },
    {
      field: "decimals",
      width: 125,
    },
    {
      headerName: "Src Chain",
      field: "srcChain",
      cellRenderer: "chainRenderer",
    },
    {
      headerName: "Dest Chain",
      field: "dstChain",
      cellRenderer: "chainRenderer",
    },
    {
      headerName: "Src Contract",
      field: "srcContract",
      cellRenderer: "contractRenderer",
      flex: 1,
    },
    {
      headerName: "Dest Contract",
      field: "destContract",
      cellRenderer: "contractRenderer",
      flex: 1,
    },
    {
      headerName: 'MPC Contract',
      field: 'mpc',
      cellRenderer: 'mpcRenderer',
      flex: 1,
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
