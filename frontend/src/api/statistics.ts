import type { Statistics } from "@/types";
import api from "./axiosInstance";

export const statistics = async (): Promise<Statistics> => {
  const { data } = await api.get("/statistics");
  return data.data as Statistics;
};
