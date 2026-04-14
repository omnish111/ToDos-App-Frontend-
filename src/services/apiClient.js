import axios from "axios";
import { getStoredToken } from "../utils/storage";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL;
const fallbackBaseUrl = "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: (configuredBaseUrl || fallbackBaseUrl).replace(/\/$/, ""),
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
