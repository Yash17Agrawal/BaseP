import { ACTION_TYPES } from "constants/actionTypes";
import { ICartItem } from "interfaces/commonInterfaces";

export const setCartItems = (
  items: ICartItem,
  itemsCartSequence: Array<number>
) => {
  return {
    type: ACTION_TYPES.SET_CART_ITEMS,
    payload: {
      items,
      itemsCartSequence,
    },
  };
};
