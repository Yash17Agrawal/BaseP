import { IModalAction } from "actions/ModalActions";
import { ModalType } from "constants/modalTypes";
import { ACTION_TYPES } from "constants/actionTypes";

export interface IModalState {
  show: boolean;
  type: ModalType;
  params: any;
  headers: any;
}

function init(): IModalState {
  return {
    show: false,
    type: ModalType.NONE,
    params: {},
    headers: {}
  };
}

const modalReducer = (
  state: IModalState = init(),
  action: IModalAction
): IModalState => {
  switch (action.type) {
    case ACTION_TYPES.SHOW_MODAL:
      return {
        ...state,
        show: true,
        type: action.modalType,
        params: action.params,
        headers: action.headers
      };
    case ACTION_TYPES.HIDE_MODAL:
      return {
        ...state,
        show: false
      };
    default:
      return state;
  }
};

export default modalReducer;
