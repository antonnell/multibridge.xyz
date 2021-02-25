import { Typography, Paper } from '@material-ui/core'
import { withTheme } from '@material-ui/core/styles';

import classes from './disclaimer.module.css'

import WarningRoundedIcon from '@material-ui/icons/WarningRounded';

function Disclaimer(props) {
  return (
    <div className={ classes.footerContainer }>
      <div className={ `${classes.beta}` }>
        <WarningRoundedIcon style={{ marginRight: '12px' }} />
        <Typography variant='h5' color='textPrimary'>This project is in beta. Use at your own risk.</Typography>
      </div>
    </div>
  )
}

export default withTheme(Disclaimer)
