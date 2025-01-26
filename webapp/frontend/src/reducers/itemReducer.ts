import { ACTION_TYPES } from "constants/actionTypes";
import { IItemReducer } from "interfaces/commonInterfaces";

const initialState: IItemReducer = {
  items: [],
  categorys: [],
};

export function itemReducer(state = initialState, action: any) {
  switch (action.type) {
    case ACTION_TYPES.SET_ITEMS:
      return {
        ...state,
        items: action.payload.items,
        couponName: action.payload.couponName
      };
    case ACTION_TYPES.SET_CATEGORYS:
      return {
        ...state,
        categorys: action.payload.categorys,
      };
    default:
      return state;
  }
}
