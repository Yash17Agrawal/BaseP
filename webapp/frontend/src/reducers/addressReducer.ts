import { ACTION_TYPES } from "constants/actionTypes";
import { IAddressReducer } from "interfaces/ecommerceInterfaces";

const initialState: IAddressReducer = {
  selectedData: {
    id: -1,
    city: {
      name: "",
      state: "",
    },
    kind: "",
    name: "",
    addressFirstLine: "",
    addressSecondLine: "",
    pincode: 0,
    phone: ""
  },
};

export function addressReducer(state = initialState, action: any) {
  switch (action.type) {
    case ACTION_TYPES.SET_ADDRESS:
      return {
        ...state,
        selectedData: { ...action.payload },
      };
    case ACTION_TYPES.RESET_ADDRESS:
      return state;
    default:
      return state;
  }
}
