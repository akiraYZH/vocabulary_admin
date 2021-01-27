import axios from "axios";
import qs from "qs";
axios.defaults.withCredentials = true;
axios.defaults.timeout = 5000; //Timeout time
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";
axios.defaults.baseURL =
  process.env.NODE_ENV == "development"
    ? "http://127.0.0.1:7001/"
    : "https://francais-api.akirayu.cn";

// add interceptor
axios.interceptors.request.use(
  function(config) {
    // before sending requests
    if (localStorage.getItem("authentication")) {
      config.headers["authentication"] =
        "bearer " + localStorage.getItem("authentication");
    }

    if (config.method === "post") {
      config.data = qs.stringify(config.data);
    }
    return config;
  },
  function(error) {
    // Error
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function(response) {
    // After received responses
    // save token
    if (response.headers.authentication) {
      localStorage.setItem("authentication", response.headers.authentication);
    }
    return response;
  },
  function(error) {
    // Error
    return Promise.reject(error);
  }
);

export default axios;
