import React, { Component } from "react";
import {
  Snackbar,
  IconButton,
  Button,
  Typography,
  SvgIcon,
  CircularProgress,
  Tooltip
} from '@material-ui/core';

import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CloseIcon from '@material-ui/icons/Close';

import { formatCurrency } from '../../utils'
import stores from '../../stores'

import classes from './swap.module.css'
import { colors } from "../../theme/coreTheme";

const iconStyle = {
  fontSize: '22px',
  marginRight: '10px',
  verticalAlign: 'middle'
}

class Transaction extends Component {

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.props.handleClose(this.props.swap)
  };

  onCopy = (event, val) => {
    event.stopPropagation();
    navigator.clipboard.writeText(val).then(() => {

    });
  };

  onViewTX = (event, val, asset) => {
    event.stopPropagation();
    const chainIDMapping = stores.accountStore.getStore('chainIDMapping')
    window.open(`${chainIDMapping[asset.chainID].explorer.tx}${val}`, '_blank')
  }

  render() {
    const { swap, theme } = this.props

    const success = (swap && swap.to && (swap.to.transactionHash || swap.to.hash)) ? true : false

    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={ this.props.open }
        onClose={this.handleClose}
        message={
          <div className={ `${ classes.swapStatusContainer } ${ success ? classes.success : classes.info }` }>
            <Tooltip title="Stop tracking transactions" className={ classes.closeIcon }>
              <IconButton size="small"  onClick={ (event) => { this.handleClose(event) }}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
            <div className={ classes.headerContainer } >
              <div>
                <Typography variant='subtitle1'>{`${swap.fromAsset.chainMetadata?.name} -> ${swap.toAsset.chainMetadata?.name}`}</Typography>
                <Typography variant='h1' className={ classes.swapHeader } >{ formatCurrency(swap.amount) } { swap.fromAsset.tokenMetadata?.symbol }</Typography>
              </div>
              <div className={ classes.swapDirection }>
                <div className={ classes.assetSelectMenuItem }>
                  <div className={ `${classes.displayDualIconContainerSmall} ${classes.marginRightNone}` }>
                    <img
                      className={ classes.displayAssetIconSmall }
                      alt=""
                      src={ (swap.fromAsset) ? swap.fromAsset.tokenMetadata?.icon : '' }
                      height='60px'
                      onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
                    />
                    <img
                      className={ classes.displayChainIconSmall }
                      alt=""
                      src={ (swap.fromAsset) ? `${swap.fromAsset.chainMetadata?.logoUrl}` : '' }
                      height='30px'
                      width='30px'
                      onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
                    />
                  </div>
                </div>
                <ArrowRightAltIcon className={ classes.rightArrow } />
                <div className={ classes.assetSelectMenuItem }>
                  <div className={ `${classes.displayDualIconContainerSmall} ${classes.marginRightNone}` }>
                    <img
                      className={ classes.displayAssetIconSmall }
                      alt=""
                      src={ (swap.toAsset) ? swap.toAsset.tokenMetadata?.icon : '' }
                      height='60px'
                      onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
                    />
                    <img
                      className={ classes.displayChainIconSmall }
                      alt=""
                      src={ (swap.toAsset) ? `${swap.toAsset.chainMetadata?.logoUrl}` : '' }
                      height='30px'
                      width='30px'
                      onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={ `${classes.addressField}` }>
              { !!(swap && swap.from && (!swap.from.confirmationNumber || swap.from.confirmationNumber === 0)) &&
                (
                  <React.Fragment>
                    <CircularProgress size={ 20 } />
                    <Typography>Deposit transaction is pending ...</Typography>
                    <div></div>
                  </React.Fragment>
                )
              }
              { !!(swap && swap.from && swap.from.confirmationNumber && swap.from.confirmationNumber > 0 && swap.from.confirmationNumber < 3) &&
                (
                  <React.Fragment>
                    <CircularProgress size={ 20 } />
                    <Tooltip title="View transaction">
                      <Typography onClick={ (event) => { this.onViewTX(event, swap.from.transactionHash, swap.fromAsset) } }>Waiting for {3-swap.from.confirmationNumber} more block confirmations</Typography>
                    </Tooltip>
                    <Tooltip title="Copy transaction hash">
                      <IconButton size="small"  onClick={ (event) => { this.onCopy(event, swap.from.transactionHash) }}>
                        <FileCopyIcon />
                      </IconButton>
                    </Tooltip>
                  </React.Fragment>
                )
              }
              { !!(swap && swap.from && swap.from.confirmationNumber && swap.from.confirmationNumber >= 3) &&
                (
                  <React.Fragment>
                    <CheckCircleOutlineIcon color='primary' />
                    <Tooltip title="View transaction">
                      <Typography onClick={ (event) => { this.onViewTX(event, swap.from.transactionHash, swap.fromAsset) } }>Deposit transaction successful</Typography>
                    </Tooltip>
                    <Tooltip title="Copy transaction hash">
                      <IconButton size="small"  onClick={ (event) => { this.onCopy(event, swap.from.transactionHash) }}>
                        <FileCopyIcon />
                      </IconButton>
                    </Tooltip>
                  </React.Fragment>
                )
              }
            </div>
            { !!((swap && swap.from && swap.from.confirmationNumber && swap.from.confirmationNumber >= 3) || (swap && swap.to && (swap.to.transactionHash || swap.to.hash))) &&
              <div className={ `${classes.addressField}` }>
                { !!(swap && (!swap.to || !(swap.to.transactionHash || swap.to.hash))) &&
                  (
                    <React.Fragment>
                      <CircularProgress size={ 20 } />
                      <Typography>Transfer transaction is pending ...</Typography>
                      <div></div>
                    </React.Fragment>
                  )
                }
                { !!(swap && swap.to && (swap.to.transactionHash || swap.to.hash)) &&
                  (
                    <React.Fragment>
                      <CheckCircleOutlineIcon color='primary' />
                      <Tooltip title="View transaction">
                        <Typography onClick={ (event) => { this.onViewTX(event, (swap.to.transactionHash ? swap.to.transactionHash : swap.to.hash), swap.toAsset) } }>Transfer transaction successful</Typography>
                      </Tooltip>
                      <Tooltip title="Copy transaction hash">
                        <IconButton size="small"  onClick={ (event) => { this.onCopy(event, swap.to.transactionHash ? swap.to.transactionHash : swap.to.hash) }}>
                          <FileCopyIcon />
                        </IconButton>
                      </Tooltip>
                    </React.Fragment>
                  )
                }
              </div>
            }
          </div>
        }
      />
    );
  }
}

export default Transaction;
