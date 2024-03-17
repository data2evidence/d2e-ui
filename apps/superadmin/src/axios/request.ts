import { PublicClientApplication } from "@azure/msal-browser";
import axios, { AxiosRequestConfig } from "axios";
import { msalSharedInstance } from "../msalInstance";

const client = axios.create();

client.interceptors.request.use(
  async (config) => {
    const pathName = window.location.pathname;
    let token;
    if (pathName.startsWith("/superadmin")) {
      const scopes = ["openid", "email"];
      token = await getToken(scopes, msalSharedInstance);
    }
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const getToken = async (scopes: string[], msal: PublicClientApplication) => {
  const accounts = await msal.getAllAccounts();
  const response = await msal.acquireTokenSilent({
    scopes,
    account: accounts[0],
  });
  return response.idToken.toString();
};

const request = <T = any>(options: AxiosRequestConfig): Promise<T> => {
  const onSuccess = function (response: any) {
    console.debug("Request Successful!", response);
    return response.data;
  };

  const onError = function (error: any) {
    console.error("Request Failed:", error.config);

    if (error.response) {
      // Server response error
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      console.error("Headers:", error.response.headers);
    } else {
      // Request setup error
      console.error("Error Message:", error.message);
    }

    return Promise.reject(error.response || error.message);
  };

  return client(options).then(onSuccess).catch(onError);
};

export default request;
