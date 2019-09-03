import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import testReducer from "./test/reducer";
import dataReducer from "./data/reducer";
import gridReducer from "./grid/reducer";

const rootReducer = combineReducers({
  data: dataReducer,
  grid: gridReducer,
  test: testReducer
});

const composeEnhancers =
  (process.env.NODE_ENV === "development"
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null) || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

if (process.env.NODE_ENV === "development") {
  window.store = store;
}

export default store;
