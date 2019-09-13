import React from 'react';
import { RouteComponentProps } from '@reach/router';

import { connect } from 'Utils/connect';
import styles from './home.module.scss';
import Button, { ButtonType } from 'Components/button';

// RouteComponentProps comes from @types/reach__router
type HomeProps = RouteComponentProps & {
  appVersion: string;
};

function onClick()  {
  alert('Clicked!');
}

const Home: React.FC<HomeProps> = ({ appVersion }) => (
  <div className={styles.home}>
    <h4>Your app is bootstrapped and ready to go...</h4>
    <code style={{ color: styles.codeColor }}>App version: {appVersion}</code>
    <hr />
    <Button onClick={onClick}>Click me!</Button>
    <Button onClick={onClick} type={ButtonType.Primary}>Click me too!</Button>
  </div>
);

// Hook up the MobX root store and pass in the props we need
export default connect(({ store }) => ({
  appVersion: store.appVersion,
}))(Home);
