import type { User, UserRole } from "@/types";
import api from "./axiosInstance";

export const users = async (): Promise<User[]> => {
  const { data } = await api.get("/users");
  return data.data as User[];
};

export const updateUserRole = async (
  userId: string,
  role: UserRole,
): Promise<User> => {
  const { data } = await api.put(`/users/${userId}`, { role });
  return data.data as User;
};
