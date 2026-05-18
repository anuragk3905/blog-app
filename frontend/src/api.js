import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "https://blog-app-n4a9.onrender.com";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default api;
