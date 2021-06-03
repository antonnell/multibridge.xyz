import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Panel from '../panel/Panel';
import styles from './progress.module.scss';

const progressIcon = '/images/progress.svg';
const doneIcon = '/images/certified-ribbon.svg';
/**
 * Intermediate screen to show progress/completion status
 * done:true - No animation displayed, else in progress animation shown
 * Optionally can display child components/actions at the end of panel
 */

function Progress({ text, done, children }) {
  const imageClasses = classNames(styles.progressImage, {
    [styles.animate]: !done,
  });
  return (
    <Panel classNames={styles.progressPanel}>
      <div className={styles.progress}>
        <img
          data-testid="progress-img"
          src={done ? doneIcon : progressIcon}
          className={imageClasses}
          alt={done ? 'Completed' : 'In Progress'}
        />
        <div className={styles.progressText}>{text}</div>
      </div>
      <div className={styles.children}>{children}</div>
    </Panel>
  );
}
Progress.propTypes = {
  text: PropTypes.string,
  done: PropTypes.bool,
  children: PropTypes.node,
};
Progress.defaultProps = {
  text: null,
  done: false,
  children: null,
};
export default Progress;
