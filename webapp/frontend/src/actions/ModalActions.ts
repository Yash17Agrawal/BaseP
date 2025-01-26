import { ACTION_TYPES } from "constants/actionTypes";
import { ModalType } from "constants/modalTypes";
import { IDispatchAction } from "interfaces/commonInterfaces";

export interface IModalAction extends IDispatchAction {
  modalType: ModalType;
  params?: any;
  headers?: any;
}

export const SHOW_MODAL = (
  type: ModalType,
  params?: any,
  headers?: any
): IModalAction => {
  return {
    type: ACTION_TYPES.SHOW_MODAL,
    modalType: type,
    params,
    headers
  };
};

export const HIDE_MODAL = () => {
  return {
    type: ACTION_TYPES.HIDE_MODAL
  };
};

