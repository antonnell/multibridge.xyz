import React, { Component } from "react";

import Transaction from './swapTransaction.jsx'

import {
  TX_HASH,
  TX_RECEIPT,
  TX_CONFIRMED,
  CLEARN_LISTENERS
} from '../../stores/constants'

import stores from "../../stores";
const emitter = stores.emitter

class TransactionController extends Component {

  constructor(props) {
    super()

    this.state = {
      open: true,
      swaps: [],
    }
  }

  componentWillMount() {
    emitter.on(TX_HASH, this.txHash);
    emitter.on(TX_RECEIPT, this.txReceipt)
    emitter.on(TX_CONFIRMED, this.txConfirmation);
  }

  componentWillUnmount() {
    emitter.removeListener(TX_HASH, this.txHash);
    emitter.removeListener(TX_RECEIPT, this.txReceipt)
    emitter.removeListener(TX_CONFIRMED, this.txConfirmation);
  };

  txHash = (tx, fromAsset, toAsset, amount, pair) => {
    console.log('TX_HASH emitted', tx, fromAsset, toAsset, amount)
    const { swaps } = this.state

    let newSwaps = swaps

    newSwaps.push({
      pair: pair,
      fromAsset: fromAsset,
      toAsset: toAsset,
      amount: amount,
      from: {
        transactionHash: tx
      },
      to: null
    })

    this.setState({ swaps: newSwaps })
  }

  txReceipt = (tx, originalTX, type) => {
    console.log('TX_RECEIPT emitted', tx, originalTX, type)
    const { swaps } = this.state

    let newSwaps = swaps

    if(!type || type === 'FROM') {
      // ignoring receipt for from tx, it comes through randomly for FTM chain and interrupts the confirmation process.
      // newSwaps = swaps.map((swap) => {
      //   if(swap.from.transactionHash === tx.transactionHash) {
      //     swap.from = tx
      //   }
      //
      //   return swap
      // })
    } else {
      newSwaps = swaps.map((swap) => {
        console.log(swap.from.transactionHash)
        console.log(originalTX)
        if(swap.from.transactionHash === originalTX) {
          swap.to = tx
        }

        return swap
      })
    }

    this.setState({ swaps: newSwaps })
  }

  txConfirmation = (tx, confirmationNumber, type) => {
    console.log('TX_CONFIRMED emitted', tx, confirmationNumber, type)
    const { swaps } = this.state

    let newSwaps = swaps

    if(!type || type === 'FROM') {
      newSwaps = swaps.map((swap) => {
        if(swap.from.transactionHash === tx.transactionHash) {
          swap.from = tx
          swap.from.confirmationNumber = confirmationNumber
        }

        return swap
      })
    } else {
      newSwaps = swaps.map((swap) => {
        if(!swap.to) {
          swap.to = tx
          swap.to.confirmationNumber = confirmationNumber
        } else if(swap.to.transactionHash === tx.transactionHash) {
          swap.to = tx
          swap.to.confirmationNumber = confirmationNumber
        }

        return swap
      })
    }

    this.setState({ swaps: newSwaps })
  }

  handleClose = (swap) => {
    const { swaps } = this.state
    const pos = swaps.map(function(e) { return e.from.transactionHash; }).indexOf(swap.from.transactionHash);
    if(pos != -1) {
      const newSwaps = swaps.splice(pos, 1)
      this.setState({ swaps: swaps.splice(pos, 1) })
    }

    //should somehow chose which listener to clear actually.
    stores.dispatcher.dispatch({ type: CLEARN_LISTENERS })
  }

  render() {
    const {
      swaps,
      open
    } = this.state

    if(open) {
      return (
        swaps.map((swap) => {
          return <Transaction swap={ swap } open={ true } handleClose={ this.handleClose } />
        })
      )
    } else {
      return <div></div>
    }
  };
}

export default TransactionController;
