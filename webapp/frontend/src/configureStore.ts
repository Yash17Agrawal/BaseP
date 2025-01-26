import { applyMiddleware, compose, createStore } from "redux";
import { thunk } from "redux-thunk";
import rootReducer from "reducers/rootReducer";
import { getEnv } from "settings";

declare var window: {
  [key: string]: any;
  prototype: Window;
  new (): Window;
};

const createAppStore = compose(
  applyMiddleware(thunk),
  window.__REDUX_DEVTOOLS_EXTENSION__ && getEnv() === "development"
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : (noop: any) => noop
);

export default function configureStore(initialState: object) {
  const store = createStore(rootReducer, initialState, createAppStore);
  return store;
}
