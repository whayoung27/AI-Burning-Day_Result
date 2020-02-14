import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import rootReducer from '../modules';
import rootSaga from '../sagas';

export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();

const logger = createLogger({
  collapsed: true,
});

const configureStore = () => {
  const store = createStore(
    rootReducer(history),
    composeWithDevTools(
      applyMiddleware(
        sagaMiddleware,
        logger,
        routerMiddleware(history),
      ),
    ),
  );

  sagaMiddleware.run(rootSaga);

  return store;
};

export default configureStore;