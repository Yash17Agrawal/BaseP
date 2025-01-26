import axios from "axios";
import { APP_URLS, localStorageProperties } from "constants/common";
import {
  ICuisinePayload,
  IItemRegisterPayload,
  ISignupCredentials,
} from "interfaces/commonInterfaces";
import { getFullUrl } from "./EcommerceAPIs";
// import { loadCookie } from 'utils/utilities';

export const defaultConfig = () => {
  // headers: {
  //   "X-CSRFTOKEN"?: string | null;
  //   Authorization?: string;
  //   "Content-type": string | boolean;
  // };
  return {
    headers: {
      // "X-CSRFTOKEN": checkOrGetCookie("csrftoken"),
      // Authorization: `Bearer ${localStorage.getItem(
      //   localStorageProperties.accessToken
      // )}`,
      "Content-type": "application/json",
    },
  };
};

export const get = (url: string, params = {}, config = defaultConfig()) => {
  return axios({
    ...config,
    url: url,
    method: "get",
    params: params,
  }).catch((error: any) => {
    throw error;
  });
};

export const post = (
  url: string,
  data: Object,
  config = defaultConfig()
): Promise<any> => {
  return axios({
    ...config,
    url: url,
    method: "post",
    data: data,
  }).catch((error: any) => {
    throw error;
  });
};

export const patch = (url: string, data: Object, config = defaultConfig()) => {
  return axios({
    ...config,
    url: url,
    method: "patch",
    data: data,
  }).catch((error: any) => {
    throw error;
  });
};

export const deleteFn = (
  url: string,
  data: Object,
  config = defaultConfig()
) => {
  return axios({
    ...config,
    url: url,
    method: "delete",
    data: data,
  }).catch((error: any) => {
    throw error;
  });
};

export const uploadFile = (payload: any, vertical: string) => {
  var data = new FormData();
  let url = "";
  if (payload.subTaskId !== undefined) {
    data.append("subTaskId", payload.subTaskId);
  }
  data.append("file", payload.file, payload.fileName);
  data.append("userName", payload.userName);
  data.append("propertyName", payload.propertyName);
  data.append("taskId", payload.taskId);
  url = "/dpa/rest/v1/uploadFile";
  return post(url, data, {
    headers: {
      // Authorization: `Bearer ${localStorage.getItem(
      //   localStorageProperties.accessToken
      // )}`,
      "Content-type": "false",
    },
  });
};

export const uploadMultipleFile = (payload: any) => {
  var data = new FormData();
  let url = "/dpa/rest/v1/uploadFiles";
  for (let i = 0; i < payload.files.length; i++) {
    data.append("files", payload.files[i]);
  }
  data.append("userName", payload.userName);
  data.append("propertyName", payload.propertyName);
  data.append("taskId", payload.taskId);

  return post(url, data, {
    headers: {
      // Authorization: `Bearer ${localStorage.getItem(
      //   localStorageProperties.accessToken
      // )}`,
      "Content-type": "multipart/form-data",
    },
  });
};

export const put = (url: string, data: Object, config = defaultConfig()) => {
  return axios({
    ...config,
    url: url,
    method: "put",
    data: data,
  }).catch((error: any) => {
    throw error;
  });
};

export const registerItemsp = (items: Array<IItemRegisterPayload>) => {
  return post("/item/", items);
};

/******Orders *******/
export const getUserOrders = (userId: number) => {
  return get(`/get-user-orders/${userId}`);
};
