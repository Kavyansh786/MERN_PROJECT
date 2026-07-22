import axios from "axios";
import { rewriteApiUrl } from "../config/api";

const AXIOS_CONFIGURED_FLAG = "__apiUrlConfigured";

if (!axios.interceptors.request[AXIOS_CONFIGURED_FLAG]) {
  axios.interceptors.request.use((config) => {
    if (config?.url) {
      config.url = rewriteApiUrl(config.url);
    }

    return config;
  });

  axios.interceptors.request[AXIOS_CONFIGURED_FLAG] = true;
}
