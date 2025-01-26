import { combineReducers } from "redux";
import { itemReducer } from 'reducers/itemReducer';
import modalReducer from 'reducers/modalReducer';
import { cartReducer } from 'reducers/cartReducer';
import { addressReducer } from "./addressReducer";
import { notificationReducer } from "./notificationReducer";

const appReducer = combineReducers({
  itemReducer,
  modalReducer,
  cartReducer,
  addressReducer,
  notificationReducer
});

const rootReducer = (state: any, action: any) => {
  return appReducer(state, action);
};

export default rootReducer;
