export enum CITIES {
  DELHI = "DELHI",
  BANAGALORE = "BANAGALORE",

  Texas = "Texas",
}

export enum COUNTRIES {
  INDIA = "INDIA",
  AMERICA = "AMERICA",
}

export enum States {
  UP = "UP",
  KARNATAKA = "KARNATAKA",

  NEVADA = "NEVADA",
}

export const COUNTRIES_WITH_STATES_WITH_CITIES = {
  [COUNTRIES.INDIA]: {
    [States.UP]: [CITIES.DELHI],
    [States.KARNATAKA]: [CITIES.BANAGALORE],
  },
  [COUNTRIES.AMERICA]: {
    [States.NEVADA]: [CITIES.Texas],
  },
};

export const localStorageProperties = {
  accessToken: "access_token",
  refreshToken: "refresh_token",
  type: "type",
};

export const getAppBaseURL = (): string => {
  // const env = getEnv();
  // console.log(env);
  // switch (env) {
  //   case "development":
  //     return "";
  //   case "production":
  //     return "http://localhost:8000";
  //   default:
  //     return ""
  // }

  if (window.location.origin === "http://localhost:3000") {
    return "http://localhost:3000";
  } else {
    return window.location.origin;
  }

  //   if (window.location.origin === "http://localhost:3000") {
  //   axios.defaults.baseURL = "http://127.0.0.1:8000";
  // } else {
  //   axios.defaults.baseURL = window.location.origin;
  // }
};

export const APP_URLS = {
  root: "/signin",
  dashboard: "/dashboard",
  home: "/home",
  // signin: '/signin',
  signup: "/signup",
  pricing: "/pricing",
  items: "/items",
  contactUs: "/contact",

  // Ecommerce
  ecommDashboard: "/",
  ecommAddress: "/ecomm/address",
  ecommReview: "/ecomm/review",
  ecommComplete: "/ecomm/complete/:id/",
  ecommOrders: "/ecomm/orders",
  specialOffers: "/ecomm/special-offers/",
  ecommItemDetails: "/ecomm/item/:id/", // :path(\\w+)
  ecommOrderDetails: "/ecomm/order/:id/", // :path(\\w+)

  userAccount: "/user-account/",
  loginSecurity: "/login-security/",
  changeName: "/change-name/",
  changeEmail: "/change-email/",
  changeMobile: "/change-mobile-number/",
  changePassword: "/change-password/",
};

export const MESSAGES = {
  companyName: "BP Ecommerce",
};

export const SYMBOLS = {
  Rupee: "Rs. ",
};
