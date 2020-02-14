import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'; // initialized i18next instance
import './i18n';
import './index.css';
import store from './store';

const persistor = persistStore(store);
ReactDOM.render(
  // <I18nextProvider i18n={i18n}>
  <Suspense>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </Suspense>,
  // </I18nextProvider>
  document.getElementById('root')
);
//
// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
