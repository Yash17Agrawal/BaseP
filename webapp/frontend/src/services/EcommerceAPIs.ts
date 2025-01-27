import { getAppBaseURL } from "constants/common";
import { ILoginCredentials } from "interfaces/commonInterfaces";
import {
  ICheckPincodeAPIRequest,
  ICreateAddressAPIPayload,
  ISendContactUsDataAPIRequest,
  IUpdateCartItemsAPIRequest,
  IUpdateUserProfile,
} from "interfaces/ecommerceInterfaces";
import { get, post } from "./APIService";

// getAppBaseURL
export const getWithBaseUrl = (baseUrl: string) => (apiEndPoint: string) =>
  `${baseUrl}/api${apiEndPoint}`;

export const getFullUrl = getWithBaseUrl(getAppBaseURL());

export const getCities = () => {
  return get(getFullUrl(`/cities/`));
};

export const getRegionForCity = (city: string) => {
  return get(getFullUrl(`/region/`), { city });
};

export const getEcommerceItems = () => {
  return get(getFullUrl(`/items/`));
};

export const getMedia = (type: string, group: string) => {
  return get(getFullUrl(`/media/`), { type, group });
};

export const getEcommerceItemDetails = (itemId: number) => {
  return get(getFullUrl(`/item/${itemId}/`));
};

export const searchEcommerceItems = (payload: {
  type: string;
  value: string;
}) => {
  return get(getFullUrl(`/search/`), payload);
};

// Unused
export const getCategoryGroupedItems = () => {
  return get(getFullUrl(`/category/`));
};

export const getCategorys = () => {
  return get(getFullUrl(`/categorys/`));
};

export const getEcommerceCouponItems = (couponName: string) => {
  return get(getFullUrl(`/coupon/${couponName}/`));
};

export const getAddresses = () => {
  return get(getFullUrl(`/address/`));
};

export const createAddress = (payload: ICreateAddressAPIPayload) => {
  return post(getFullUrl(`/address/`), payload);
};

export const updateCartItems = (payload: IUpdateCartItemsAPIRequest) => {
  return post(getFullUrl(`/cart/`), { ...payload });
};

export const getCartItems = () => {
  return get(getFullUrl(`/cart/`));
};

export const getAppDetails = () => {
  return get(getFullUrl(`/app-details/`));
};

export const getCheckoutData = (couponName?: string) => {
  if (couponName) {
    return getEcommerceCouponItems(couponName);
  } else {
    return get(getFullUrl(`/checkout/`));
  }
};

export const updateCheckoutAddress = (deliveryAddress: number) => {
  return post(getFullUrl(`/checkout/address/`), {
    deliveryAddress,
  });
};

// const; //= placeOrder(couponName: string) =>{
//   return post(getFullUrl(`/place-order/`), {
//     couponName,
//   });
// }

export const createRazorpayOrder = () => {
  return post(getFullUrl(`/razorpay_order/`), {});
};

export const removeCouponFromUserCartOrder = () => {
  return post(getFullUrl(`/coupon/`), {});
};

export const getAllOrders = (pageSize: number, pageNo: number) => {
  return post(getFullUrl(`/orders/`), {
    pageSize,
    pageNo,
  });
};

export const getOrderDetails = (orderId: number) => {
  return get(getFullUrl(`/order/${orderId}/`));
};

export const login = (credentials: ILoginCredentials) => {
  return post(getFullUrl(`/login/`), credentials);
};

export const getUserProfile = () => {
  return get(getFullUrl(`/user-profile/`));
};

export const updateUserProfile = (payload: IUpdateUserProfile) => {
  return post(getFullUrl(`/user-profile/`), payload);
};

export const sendContactUsData = (payload: ISendContactUsDataAPIRequest) => {
  return post(getFullUrl(`/contact-us/`), payload);
};

export const checkPincode = (payload: ICheckPincodeAPIRequest) => {
  return post(getFullUrl(`/check-pincode/`), payload);
};

export const verifyEmail = (token: string) => {
  return post(getFullUrl(`/verify-email/${token}/`), {});
};
