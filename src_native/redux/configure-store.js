import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers/index'
import thunk from 'redux-thunk'
import promise from 'redux-promise-middleware'

const store = createStore(rootReducer, applyMiddleware(thunk, promise));

export default function configureStore() {

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./reducers/index').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store
}