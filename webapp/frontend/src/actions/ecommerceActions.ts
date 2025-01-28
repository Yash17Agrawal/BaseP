import { AxiosResponse } from "axios";
import { ACTION_TYPES } from "constants/actionTypes";
import { ModalType } from "constants/modalTypes";
import { Categorys, ICartItem } from "interfaces/commonInterfaces";
import {
  IAddressAPIResponse,
  IAppDetails,
  ICheckPincodeAPIRequest,
  ICityAPIResponseObject,
  ICreateAddressAPIPayload,
  IGetCartItemsAPIResponse,
  IGetCheckoutDataAPIResponse,
  IGetMediaAPIResponse,
  IGetOrdersAPIResponse,
  IItem,
  ISendContactUsDataAPIRequest,
  IUpdateCartItemsAPIRequest,
  IUpdateUserProfile,
  IUserProfile,
} from "interfaces/ecommerceInterfaces";
import { Dispatch } from "react";
import * as APIService from "services/EcommerceAPIs";
import { setCartItems } from "./cartActions";
import { SHOW_MODAL, HIDE_MODAL } from "./ModalActions";

export function showNotification(
  message: string,
  severity: "success" | "warning" | "error",
  duration?: number
) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.SET_NOTIFICATION,
      payload: { message, severity, duration },
    });
  };
}

export function getItems() {
  return async (dispatch: Dispatch<any>) => {
    dispatch(SHOW_MODAL(ModalType.LOADER, { hideModal: HIDE_MODAL }));
    await APIService.getEcommerceItems()
      .then((response) => {
        const action = {
          type: ACTION_TYPES.SET_ITEMS,
          payload: { items: response.data },
        };
        dispatch(action);
        dispatch(HIDE_MODAL());
      })
      .catch((error) => {
        dispatch(HIDE_MODAL());
        dispatch(showNotification(error.response.statusText, "error"));
      });
  };
}

export function getItemDetails(
  itemId: number,
  callback: (data: IItem) => void
) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(SHOW_MODAL(ModalType.LOADER, { hideModal: HIDE_MODAL }));
    APIService.getEcommerceItemDetails(itemId)
      .then((response: AxiosResponse<IItem>) => {
        callback(response.data);
        dispatch(HIDE_MODAL());
      })
      .catch((error) => {
        dispatch(HIDE_MODAL());
        dispatch(showNotification(error.response.statusText, "error"));
      });
  };
}

export function searchItems(keyword: string) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(SHOW_MODAL(ModalType.LOADER, { hideModal: HIDE_MODAL }));
    APIService.searchEcommerceItems({ type: "item", value: keyword })
      .then((response) => {
        const action = {
          type: ACTION_TYPES.SET_ITEMS,
          payload: { items: response.data },
        };
        dispatch(action);
        dispatch(HIDE_MODAL());
      })
      .catch((error) => {
        dispatch(HIDE_MODAL());
        dispatch(showNotification(error.response.statusText, "error"));
      });
  };
}

export function getCategorys() {
  return async (dispatch: Dispatch<any>) => {
    dispatch(SHOW_MODAL(ModalType.LOADER, { hideModal: HIDE_MODAL }));
    APIService.getCategorys()
      .then((response: AxiosResponse<Categorys[]>) => {
        dispatch({
          type: ACTION_TYPES.SET_CATEGORYS,
          payload: { categorys: response.data },
        });
        dispatch(HIDE_MODAL());
      })
      .catch((error) => {
        dispatch(HIDE_MODAL());
        dispatch(showNotification(error.response.statusText, "error"));
      });
  };
}

// export function getEcommerceCouponItems(couponName: string) {
//   return async (dispatch: Dispatch<any>) => {
//     APIService.getEcommerceCouponItems(couponName)
//       .then((response) => {
//         const action = {
//           type: ACTION_TYPES.SET_ITEMS,
//           payload: { items: response.data, couponName },
//         };
//         dispatch(action);
//         dispatch(HIDE_MODAL());
//       })
//       .catch((error) => {
//         dispatch(HIDE_MODAL());
//         console.log(error.response.statusText);
//         dispatch(showNotification("Invalid Coupon Code", "error"));
//       });
//   };
// }

export function getAddresses(callback: (data: IAddressAPIResponse[]) => void) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(SHOW_MODAL(ModalType.LOADER, { hideModal: HIDE_MODAL }));
    APIService.getAddresses()
      .then((response) => {
        callback(response.data);

        dispatch(HIDE_MODAL());
      })
      .catch((error) => {
        dispatch(HIDE_MODAL());
        dispatch(showNotification(error.response.statusText, "error"));
      });
  };
}

export function getCities(callback: (data: ICityAPIResponseObject[]) => void) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(SHOW_MODAL(ModalType.LOADER, { hideModal: HIDE_MODAL }));
    APIService.getCities()
      .then((response: AxiosResponse<ICityAPIResponseObject[]>) => {
        callback(response.data);
        dispatch(HIDE_MODAL());
      })
      .catch((error) => {
        dispatch(HIDE_MODAL());
        dispatch(showNotification(error.response.statusText, "error"));
      });
  };
}

export function getRegion(city: string, callback: (data: string) => void) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(SHOW_MODAL(ModalType.LOADER, { hideModal: HIDE_MODAL }));
    APIService.getRegionForCity(city)
      .then((response: AxiosResponse<string>) => {
        callback(response.data);
        dispatch(HIDE_MODAL());
      })
      .catch((error) => {
        dispatch(HIDE_MODAL());
        dispatch(showNotification(error.response.statusText, "error"));
      });
  };
}

export function createAddress(
  payload: ICreateAddressAPIPayload,
  callback: () => void
) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(SHOW_MODAL(ModalType.LOADER, { hideModal: HIDE_MODAL }));
    APIService.createAddress(payload)
      .then((response) => {
        callback();
        dispatch(HIDE_MODAL());
      })
      .catch((error) => {
        dispatch(HIDE_MODAL());
        console.log(error.response);
        dispatch(showNotification(error.response.statusText, "error"));
      });
  };
}

export function getCartItems() {
  return async (dispatch: Dispatch<any>) => {
    dispatch(SHOW_MODAL(ModalType.LOADER, { hideModal: HIDE_MODAL }));
    APIService.getCartItems()
      .then((response: AxiosResponse<IGetCartItemsAPIResponse[]>) => {
        let items: ICartItem = {};
        let itemsCartSequence: number[] = [];
        response.data.forEach((obj: IGetCartItemsAPIResponse) => {
          items[obj.id] = obj.quantity;
          itemsCartSequence = itemsCartSequence.concat(obj.id);
        });
        dispatch(setCartItems(items, itemsCartSequence));
        dispatch(HIDE_MODAL());
      })
      .catch((error) => {
        console.log(error);
        dispatch(HIDE_MODAL());
        dispatch(showNotification(error.response.statusText, "error"));
      });
  };
}

export function getAppDetails(callback: (data: IAppDetails) => void) {
  return async (dispatch: Dispatch<any>) => {
    // dispatch(SHOW_MODAL(ModalType.LOADER, { hideModal: HIDE_MODAL }));
    APIService.getAppDetails()
      .then((response: AxiosResponse<IAppDetails>) => {
        callback(response.data);
        // dispatch(HIDE_MODAL());
      })
      .catch((error) => {
        console.log(error);
        dispatch(HIDE_MODAL());
        dispatch(showNotification(error.response.statusText, "error"));
      });
  };
}

export function updateCartItems(payload: IUpdateCartItemsAPIRequest) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(SHOW_MODAL(ModalType.LOADER, { hideModal: HIDE_MODAL }));
    APIService.updateCartItems(payload)
      .then((response: AxiosResponse<IGetCartItemsAPIResponse[]>) => {
        let items: ICartItem = {};
        let itemsCartSequence: number[] = [];
        response.data.forEach((obj: IGetCartItemsAPIResponse) => {
          items[obj.id] = obj.quantity;
          itemsCartSequence = itemsCartSequence.concat(obj.id);
        });
        dispatch(setCartItems(items, itemsCartSequence));
        dispatch(showNotification(`done`, "success"));
        dispatch(HIDE_MODAL());
      })
      .catch((error) => {
        console.log(error.response);
        dispatch(HIDE_MODAL());
        dispatch(showNotification(error.response.statusText, "error"));
      });
  };
}

export function updateCartAddress(
  deliveryAddress: number,
  callback: () => void
) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(SHOW_MODAL(ModalType.LOADER, { hideModal: HIDE_MODAL }));
    APIService.updateCheckoutAddress(deliveryAddress)
      .then((response: AxiosResponse<IGetCartItemsAPIResponse[]>) => {
        callback();
        dispatch(HIDE_MODAL());
      })
      .catch((error) => {
        console.log(error.response);
        dispatch(HIDE_MODAL());
        dispatch(showNotification(error.response.statusText, "error"));
      });
  };
}
export function getCheckoutData(
  callback: (data: IGetCheckoutDataAPIResponse) => void,
  failCallback: () => void,
  couponName?: string
) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(SHOW_MODAL(ModalType.LOADER, { hideModal: HIDE_MODAL }));
    APIService.getCheckoutData(couponName)
      .then((response: AxiosResponse<IGetCheckoutDataAPIResponse>) => {
        if (response.status === 204) {
          dispatch(showNotification("No Cart Items found for user", "error"));
          failCallback();
        } else {
          callback(response.data);
        }
        dispatch(HIDE_MODAL());
      })
      .catch((error) => {
        console.log(error);
        dispatch(HIDE_MODAL());
        dispatch(showNotification(error.response.statusText, "error"));
      });
  };
}

export function getUsersOrders(
  pageSize: number,
  pageNo: number,
  callback: (data: IGetOrdersAPIResponse) => void
) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(SHOW_MODAL(ModalType.LOADER, { hideModal: HIDE_MODAL }));
    APIService.getAllOrders(pageSize, pageNo)
      .then((response: AxiosResponse<IGetOrdersAPIResponse>) => {
        callback(response.data);
        dispatch(HIDE_MODAL());
      })
      .catch((error) => {
        console.log(error);
        dispatch(HIDE_MODAL());
        dispatch(showNotification(error.response.statusText, "error"));
      });
  };
}

export function getMedia(
  type: string,
  group: string,
  callback: (data: IGetMediaAPIResponse[]) => void
) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(SHOW_MODAL(ModalType.LOADER, { hideModal: HIDE_MODAL }));
    // APIService.getMedia(type, group)
    //   .then((response: AxiosResponse<IGetMediaAPIResponse[]>) => {
    //     callback(response.data);
    //     dispatch(HIDE_MODAL());
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     dispatch(HIDE_MODAL());
    //     dispatch(showNotification(error.response.statusText, "error"));
    //   });
  };
}

export function getOrderDetails(
  orderId: number,
  callback: (data: IGetCheckoutDataAPIResponse) => void,
  failCallback: () => void
) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(SHOW_MODAL(ModalType.LOADER, { hideModal: HIDE_MODAL }));
    APIService.getOrderDetails(orderId)
      .then((response: AxiosResponse<IGetCheckoutDataAPIResponse>) => {
        if (response.status === 204) {
          dispatch(showNotification("Invalid OrderId for User", "error"));
          failCallback();
        } else {
          callback(response.data);
        }
        dispatch(HIDE_MODAL());
      })
      .catch((error) => {
        console.log(error);
        dispatch(HIDE_MODAL());
        dispatch(showNotification(error.response.statusText, "error"));
      });
  };
}

// export function placeUserOrder(couponName: string, callback: () => void) {
//   return async (dispatch: Dispatch<any>) => {
//     dispatch(SHOW_MODAL(ModalType.LOADER, { hideModal: HIDE_MODAL }));
//     APIService.placeOrder(couponName)
//       .then((response: AxiosResponse<IGetOrdersAPIResponse>) => {
//         callback();
//         dispatch(HIDE_MODAL());
//       })
//       .catch((error) => {
//         console.log(error);
//         dispatch(HIDE_MODAL());
//         dispatch(showNotification(error.response.statusText, "error"));
//       });
//   };
// }

export function sendContactUsData(
  payload: ISendContactUsDataAPIRequest,
  callback: () => void
) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(SHOW_MODAL(ModalType.LOADER, { hideModal: HIDE_MODAL }));
    APIService.sendContactUsData(payload)
      .then((response: AxiosResponse<IGetOrdersAPIResponse>) => {
        dispatch(HIDE_MODAL());
        dispatch(showNotification("Query Sent Successfully", "success"));
        callback();
      })
      .catch((error) => {
        console.log(error);
        dispatch(HIDE_MODAL());
        dispatch(showNotification(error.response.statusText, "error"));
      });
  };
}

export function checkPincode(
  payload: ICheckPincodeAPIRequest,
  callback: (available: boolean) => void
) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(SHOW_MODAL(ModalType.LOADER, { hideModal: HIDE_MODAL }));
    APIService.checkPincode(payload)
      .then((response: AxiosResponse<boolean>) => {
        dispatch(HIDE_MODAL());
        callback(response.data);
      })
      .catch((error) => {
        console.log(error);
        dispatch(HIDE_MODAL());
        dispatch(showNotification(error.response.statusText, "error"));
      });
  };
}

export function removeCouponFromUserOrder(
  callback: (data: IGetCheckoutDataAPIResponse) => void
) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(SHOW_MODAL(ModalType.LOADER, { hideModal: HIDE_MODAL }));
    APIService.removeCouponFromUserCartOrder()
      .then((response: AxiosResponse<string>) => {
        dispatch(HIDE_MODAL());
        dispatch(
          getCheckoutData(callback, () => {
            showNotification("Failed", "error");
          })
        );
      })
      .catch((error) => {
        console.log(error);
        dispatch(HIDE_MODAL());
        dispatch(showNotification(error.response.statusText, "error"));
      });
  };
}
