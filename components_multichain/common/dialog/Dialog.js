import React from 'react';
import PropTypes from 'prop-types';
import MaterialUIDialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import styles from './dialog.module.scss';
import useBreakpoints from '../../../framework/useBreakpoints';

const closeIcon = '/images/closeIcon.svg';
/**
 * Launches Dialog of fixed width rendering children
 * Leverages Material-UI Dialog
 * For mobile, renders as full screen
 */
function Dialog(props) {
  const { children, title, className, open, onClose } = props;
  const { isMobile } = useBreakpoints();
  const classNames = `${styles.dialog} ${className} ${
    isMobile && styles.isMobile
  }`;
  return (
    <div className={styles.dialogWrapper}>
      <MaterialUIDialog
        open={open}
        onClose={onClose}
        aria-labelledby="dialog"
        className={classNames}
        fullScreen={isMobile}
      >
        <DialogTitle id="dialog-title">
          <div className={styles.dialogTitle}>
            <div className={styles.titleText}>{title}</div>
            <div
              role="button"
              className={styles.closeIcon}
              onKeyDown={onClose}
              onClick={onClose}
              tabIndex="0"
            >
              <img alt="close" src={closeIcon} />
            </div>
          </div>
        </DialogTitle>
        <DialogContent>{children}</DialogContent>
      </MaterialUIDialog>
    </div>
  );
}

Dialog.propTypes = {
  children: PropTypes.node,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  className: PropTypes.string,
};
Dialog.defaultProps = {
  children: null,
  open: false,
  onClose: () => null,
  title: null,
  className: null,
};
export default Dialog;
