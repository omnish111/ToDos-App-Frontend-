import axios from "axios";
import { getStoredToken } from "../utils/storage";

const configuredBaseUrl = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  ""
).replace(/\/$/, "");
const fallbackBaseUrl = import.meta.env.DEV ? "http://localhost:5001/api" : "/api";

const apiClient = axios.create({
  baseURL: configuredBaseUrl || fallbackBaseUrl,
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiMessage = error.response?.data?.message;
    const statusText = error.response?.statusText;

    error.userMessage =
      apiMessage ||
      statusText ||
      (error.code === "ERR_NETWORK"
        ? "Network error: unable to reach API server"
        : "Request failed");

    return Promise.reject(error);
  },
);

export default apiClient;
