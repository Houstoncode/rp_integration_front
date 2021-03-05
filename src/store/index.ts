import { createStore, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { combinedWebAppReducer } from './reducers';

export * from './reducers';

export const composeEnhancers =
  (window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export const store = createStore(combinedWebAppReducer, composeWithDevTools());
