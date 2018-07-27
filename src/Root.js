import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ajaxHandler from './middleware/ajaxHandler';
import reducers from 'reducers';

export default ({ children, initialState = {} }) => {
  const store = createStore(
    reducers,
    initialState,
    applyMiddleware(ajaxHandler)
  );

  return <Provider store={store}>{children}</Provider>;
};
