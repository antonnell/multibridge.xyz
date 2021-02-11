import React, { Component } from "react";
import {
  DialogContent,
  Dialog,
  Slide
} from '@material-ui/core';

import ChangeNetwork from './changeNetwork.js';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ChangeNetworkModal extends Component {
  render() {
    const { closeModal, modalOpen } = this.props;

    const fullScreen = window.innerWidth < 576;

    return (
      <Dialog open={ modalOpen } onClose={ closeModal } fullWidth={ true } maxWidth={ 'xs' } TransitionComponent={ Transition } fullScreen={ fullScreen }>
        <DialogContent>
          <ChangeNetwork closeModal={ closeModal } />
        </DialogContent>
      </Dialog>
    )
  };
}

export default ChangeNetworkModal;
