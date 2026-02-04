import type { User } from "@/types";
import api from "./axiosInstance";

export const me = async (): Promise<User> => {
  const { data } = await api.get("/auth/me");
  return data.data as User;
};
