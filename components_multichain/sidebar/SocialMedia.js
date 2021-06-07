import React from 'react';
import config from '../../config';
import styles from './sideBar.module.scss';
/** Renders array of social media links */
function SocialMedia() {
  const { socialMedia } = config;
  return (
    <div className={styles.socialMedia}>
      {socialMedia.map((sm) => (
        <a href={sm.href} key={sm.name}>
          <img
            className={styles.socialMediaIcon}
            src={`/images/socialmedia/${sm.name}.svg`}
            alt={sm.name}
            key={sm.name}
          />
        </a>
      ))}
    </div>
  );
}
export default SocialMedia;
