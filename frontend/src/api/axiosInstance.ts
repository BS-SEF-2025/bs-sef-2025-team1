// api/axios.ts
import axios from "axios";
import { auth } from "@/firebase";
import { convertTimestamps } from "@/utils/transformers";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use((response) => {
  response.data = convertTimestamps(response.data);
  return response;
});

export default api;
