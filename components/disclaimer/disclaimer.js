import { Typography, Paper } from '@material-ui/core'
import { withTheme } from '@material-ui/core/styles';

import classes from './disclaimer.module.css'

function Disclaimer(props) {
  return (
    <div className={ classes.footerContainer }>
      <Paper elevation={0} className={ `${classes.beta}` }>
        <Typography variant='h5' color='textPrimary'>This project is in beta. Use at your own risk.</Typography>
      </Paper>
    </div>
  )
}

export default withTheme(Disclaimer)
