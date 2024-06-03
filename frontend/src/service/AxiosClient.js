import axios from "axios";

const AxiosClient = axios.create();

AxiosClient.defaults.baseURL = import.meta.env.VITE_BACKEND_URL_SLACK;

AxiosClient.defaults.headers = {
  "Content-Type": "application/json",
};

AxiosClient.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default AxiosClient;
