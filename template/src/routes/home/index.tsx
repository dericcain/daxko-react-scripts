import React from 'react';

import { connect } from '../../utils/connect';
import { IRootStore } from '../../stores';

// RouteComponentProps comes from @types/reach__router
type HomeProps = RouteComponentProps & {
  store: IRootStore
};

const Home: React.FC<HomeProps> = ({ store }) => (
  <div>
    <h4>
      Your app is bootstrapped and ready to go..
    </h4>
    <code>App version: {store.appVersion}</code>
  </div>
);

// Hook up the MobX root store and pass in the props we need
export default connect(({ store }) => store)(Home);
