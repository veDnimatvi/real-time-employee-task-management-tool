import axios from "axios";
import { KEY, getCookie, removeCookie } from "./cookie";
//import path from "../routes/path";

const service = axios.create({
  baseURL:
    "http://127.0.0.1:5001/employee-task-management-7589a/us-central1/app/api",
});

service.interceptors.request.use(
  (config) => {
    config.headers = {
      "Content-Type": "application/json",
      Authorization: getCookie(KEY.TOKEN)
        ? `Bearer ${getCookie(KEY.TOKEN)}`
        : undefined,
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        removeCookie(KEY.TOKEN);
        window.location.href = "/";
      } else {
        return Promise.reject(error);
      }
    }
  }
);

export default service;
