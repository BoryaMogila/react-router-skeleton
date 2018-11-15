import thunkMiddleware from 'redux-thunk';
import reduxMulti from 'redux-multi';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import promiseMiddleware from 'redux-promise-middleware';
import promiseErrorLogger from './middlewares/promiseErrorLogger';
import reducers from './reducers';

export function configureStore(history, initialState, middlewares) {
  // підключаємо dev tools
  const devTools = typeof window === 'object' && window.devToolsExtension
    ? window.devToolsExtension() : f => f;
  return createStore(
    combineReducers(reducers),
    initialState,
    compose(
      applyMiddleware(
        routerMiddleware(history),
        thunkMiddleware,
        promiseErrorLogger,
        promiseMiddleware(),
        reduxMulti,
        ...middlewares,
      ),
      devTools,
    ),
  );
}
