interface IMedia extends IGetMediaAPIResponse {
  id: string;
}

export interface IItem {
  id: number;
  name: string;
  price: string;
  offerPrice: string;
  media?: IMedia[];
  category: {
    name: string;
    id: number;
  };
  description: string;
  unitsPerOrder: number;
}

export interface IItemReducer {
  items: Array<IItem>;
}

export interface ICityAPIResponseObject {
  name: string; // city name
}

export interface IUserProfile {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  isEmailVerified: boolean;
  emailVerificationCode: string;
}

export interface IUpdateUserProfile {
  type: "email" | "password" | "name" | "phone";
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export interface IUserProfileAPIResponseObject {
  user: IUserProfile;
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface IAddressAPIResponse {
  id: number;
  city: {
    name: string;
    state: string;
  };
  kind: string;
  name: string;
  addressFirstLine: string;
  addressSecondLine: string | null;
  pincode: number;
  phone: string;
}

export interface IAddressReducer {
  selectedData: IAddressAPIResponse;
}

export interface IGetCartItemsAPIResponse {
  id: number; // item id
  quantity: number;
}

export interface IUpdateCartItemsAPIRequest {
  items: IGetCartItemsAPIResponse[];
}

export interface ISendContactUsDataAPIRequest {
  name: string;
  contact: string;
  query: string;
  address: string;
}

export interface ICheckPincodeAPIRequest {
  item: number;
  pincode: number;
}

export interface IGetCheckoutItemAPIResponse {
  id: number;
  name: string;
  offerPrice: string;
  quantity: number;
  description: string;
  unitsPerOrder: number;
  totalOfferPrice: number; // offerPrice * quantity
}
export interface IGetCheckoutDataAPIResponse {
  deliveryAddress: IAddressAPIResponse;
  deliveryCharge: number;
  items: IGetCheckoutItemAPIResponse[];
  payment: number;
  total: number;
  discount: number;
  availabilityErrors: {
    [itemId: number]: string;
  };
  appliedCoupon?: string;
}

export interface IGetOrdersAPIResponse {
  data: {
    id: number;
    status: string;
    payment: string;
    invoiceLocation: string;
    createdDate: string;
    modifiedDate: string;
    totalBill: string;
    items: {
      id: number;
      name: string;
      price: number;
      newPrice?: number;
      media: IMedia[] | null;
      description: string;
    }[];
    deliveryAddress: {
      city: {
        name: string;
        state: string;
      };
      name: string;
      addressFirstLine: string;
      addressSecondLine: string | null;
      pincode: number;
    };
  }[];
  totalRecords: number;
  pageSize: number;
  pageNo: number;
}

export interface IGetMediaAPIResponse {
  file: string;
  description: string | null;
  label: string | null;
  orientation: "LANDSCAPE" | "PORTRAIT";
  group: string;
}

export interface ICreateAddressAPIPayload {
  city: string;
  kind: string;
  name: string;
  addressFirstLine: string;
  addressSecondLine: string;
  pincode: string;
  phone: string;
}

export interface IGoogleSigninAPIResponsePayload {
  Ca: string;
  accessToken: string;
  googleId: string;
  tokenId: string;
  tokenObj: string;
  profileObj: {
    email: string;
    familyName: string;
    givenName: string;
    googleId: string;
    imageUrl: string;
    name: string;
  };
  wt: any;
  xc: any;
}

export interface IAppDetails {
  version: string;
}
