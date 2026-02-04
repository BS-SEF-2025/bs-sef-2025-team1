// api/axios.ts
import axios from "axios";
import { auth } from "@/firebase";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken(); // 🔥 always fresh
    console.log("Attaching token to request:", token);
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
