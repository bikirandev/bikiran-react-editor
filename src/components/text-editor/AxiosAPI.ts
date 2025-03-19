import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export interface CurrentUser {
  currentUser?: {
    userUid?: string;
    refreshToken?: string;
  };
}

class AxiosAPI {
  url: string = "";

  setHeaders = (): this => {
    axios.defaults.headers.common["content-type"] = "multipart/form-data";
    axios.defaults.headers.common["client-time"] = new Date().toISOString();
    return this;
  };

  currentUserAuth = ({ currentUser }: CurrentUser): this => {
    axios.defaults.headers.common["user-uid"] = currentUser?.userUid || "";
    axios.defaults.headers.common["refresh-token"] =
      currentUser?.refreshToken || "";
    return this;
  };

  setUrl = (url: string, query: { [key: string]: string } = {}): this => {
    // Base URL assignment
    this.url = url;

    // If query object is not empty, append query parameters to the URL
    const queryKeys = Object.keys(query);
    if (queryKeys.length > 0) {
      const queryString = queryKeys
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`
        )
        .join("&");
      this.url += `?${queryString}`;
    }

    return this;
  };

  getUrl = (): string => this.url;

  put = (params: any, options?: AxiosRequestConfig): Promise<AxiosResponse> => {
    this.setHeaders();
    return new Promise((resolve, reject) => {
      axios
        .put(this.url, params, options)
        .then((response: any) => {
          resolve(response);
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  };
}

const AxiosAuth = new AxiosAPI();

export default AxiosAuth;
