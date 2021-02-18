import { useRouter } from 'next/router'
import { Typography } from '@material-ui/core'
import { withTheme } from '@material-ui/core/styles';
import classes from './configure.module.css'

function Configure({ theme }) {
  const router = useRouter()

  return (
    <div className={ classes.configureContainer }>
      <img src='/favicon.png' width={ 100 } height={ 100 } />
      <div className={ theme.palette.type === 'light' ? classes['dot-pulse'] : classes['dot-pulse-dark'] }></div>
    </div>
  )
}

export default withTheme(Configure)
