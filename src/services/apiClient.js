import axios from "axios";
import { getStoredToken } from "../utils/storage";

const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/$/,
  "",
);
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

export default apiClient;
