import { ACTION_TYPES } from "constants/actionTypes";
import { ICartItem, ICartReducer } from "interfaces/commonInterfaces";

const initialState: ICartReducer = {
  items: {} as ICartItem,
  itemsCartSequence: [],
}

export function cartReducer(state = initialState, action: any) {
  switch (action.type) {
    case ACTION_TYPES.SET_CART_ITEMS:
      return {
        ...state,
        items: action.payload.items,
        itemsCartSequence: action.payload.itemsCartSequence
      }
    default:
      return state;
  }
}