import { SnackbarMessage } from "components/Notification";
import { CITIES, COUNTRIES, States } from "constants/common";
import { ModalType } from "constants/modalTypes";
import { IModalState } from "reducers/modalReducer";
import { IAddressReducer, IItem as EcommItem, IUserProfile } from "./ecommerceInterfaces";

export interface IItemRegisterPayload {
  name: string;
  description: string;
  price: number;
  discount: number;
  cuisine: number;
}
export interface IItem extends IItemRegisterPayload {
  id: number;
  quantityUnit: string;
}

export interface ICartItem {
  [id: number]: number; // id: quantity
}

export interface ICartReducer {
  items: ICartItem;
  itemsCartSequence: Array<number>;
}

export interface Categorys {
  name: string; // categoryName
}
export interface IItemReducer {
  items: Array<IItem | EcommItem>;
  categorys: Categorys[];
}

export interface ICuisine extends ICuisinePayload {
  id: number;
}
export interface ICuisineReducer {
  cuisines: Array<ICuisine>;
}

export interface IUserReducer {
  firstName: string | undefined;
}

export interface IChartData {
  x: string;
  y: string;
}

export interface IChartReducer {
  data: Array<IChartData>;
}

export interface IRegisterVendor {
  name: string;
  address: string;
  isDelivering: boolean;
}

export interface IVendor extends IRegisterVendor {
  id: number;
  deliveryCharge: number;
}

export interface IUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface IVendorOrderDetails {
  id: number;
  status: string;
  totalDiscount: number;
  totalPrice: number;
  finalPrice: number;
  createdDate: string;
  orderDetail: [
    {
      item: IItem;
      quantity: number;
    }
  ];
  customer: IUser;
}

export interface IVendorOrders {
  data: Array<IVendorOrderDetails>;
  pageSize: number;
  pageNo: number;
  totalRecords: number;
}

export interface IVendorReducer {
  vendors: Array<IVendor>;
  selectedVendor: number;
  vendorOrders: IVendorOrders;
  profile: IVendor;

  /***Regsitering */
  name: string;
  address: string;
  city: CITIES;
  state: States;
  country: COUNTRIES;
  pincode: string;
}

export interface INotificationReducer {
  messages: SnackbarMessage[];
}
export interface IReducers {
  itemReducer: IItemReducer;
  vendorReducer: IVendorReducer;
  modalReducer: IModalState;
  chartReducer: IChartReducer;
  userReducer: IUserReducer | IUserProfile;
  cuisineReducer: ICuisineReducer;
  cartReducer: ICartReducer;
  addressReducer: IAddressReducer;
  notificationReducer: INotificationReducer;
}

export interface IModalActions {
  showModal: (modalType: ModalType, params?: any) => void;
  hideModal: () => void;
}

export interface IDispatchAction {
  type: string;
  payload?: any;
}

export interface ILoginCredentials {
  username: string;
  password: string;
}

export interface ISignupCredentials {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  type: "email" | "gmail";
}

export interface ICuisinePayload {
  name: string;
  description: string;
  discount: number;
  vendor: number;
}
