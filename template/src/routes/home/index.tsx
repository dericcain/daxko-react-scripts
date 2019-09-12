import React from 'react';
import { RouteComponentProps } from '@reach/router';

import { connect } from '../../utils/connect';
import styles from './home.module.scss';

// RouteComponentProps comes from @types/reach__router
type HomeProps = RouteComponentProps & {
  appVersion: string;
};

const Home: React.FC<HomeProps> = ({ appVersion }) => (
  <div className={styles.home}>
    <h4>Your app is bootstrapped and ready to go...</h4>
    <code style={{ color: styles.codeColor }}>App version: {appVersion}</code>
  </div>
);

// Hook up the MobX root store and pass in the props we need
export default connect(({ store }) => ({
  appVersion: store.appVersion,
}))(Home);
