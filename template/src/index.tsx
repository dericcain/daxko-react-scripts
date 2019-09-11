import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { Features } from 'react-tiny-feature-switch';

import features from '../features.json';
import RootStore from './stores';
import App from './app';
import * as serviceWorker from './serviceWorker';
import './index.css';

const store = new RootStore();

ReactDOM.render(
  <Provider store={store}>
    <Features features={features}>
      <App />
    </Features>
  </Provider>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
