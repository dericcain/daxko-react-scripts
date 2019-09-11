import React, { Suspense } from 'react';
import { FeatureSwitch, Else } from 'react-tiny-feature-switch';

import Routes from './routes';

const App: React.FC = () => {
  return (
    <FeatureSwitch features="routes">
      <Suspense fallback={<div>Loading...</div>}>
        <Routes />
      </Suspense>
      <Else>
        <div>Looks like you don't have the "routes" feature enabled. Enable it in the features.json file.</div>
      </Else>
    </FeatureSwitch>
  );
}

export default App;
