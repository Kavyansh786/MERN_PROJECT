import axios from "axios";
import { API_BASE_URL, rewriteApiUrl } from "../config/api";

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

instance.interceptors.request.use((config) => {
  if (config?.url) {
    config.url = rewriteApiUrl(config.url);
  }

  return config;
});

export default instance;
