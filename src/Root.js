import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ajaxHandler from './middleware/ajaxHandler';
import stateValidator from './middleware/stateValidator';
import reducers from 'reducers';

export default ({ children, initialState = {} }) => {
  const store = createStore(
    reducers,
    initialState,
    applyMiddleware(ajaxHandler, stateValidator)
  );

  return <Provider store={store}>{children}</Provider>;
};
