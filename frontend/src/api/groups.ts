import type { Group } from "@/types";
import api from "./axiosInstance";

export const groups = async (): Promise<Group[]> => {
  const { data } = await api.get("/groups");
  return data.data as Group[];
};

export const createGroup = async ({
  name,
  courseId,
  members,
}: {
  name: string;
  courseId: string;
  members: string[];
}): Promise<Group> => {
  const { data } = await api.post("/groups", {
    name: name.trim(),
    courseId,
    members,
  });
  return data.data as Group;
};

export const updateGroup = async ({
  groupId,
  name,
  members,
}: {
  groupId: string;
  name: string;
  members: string[];
}): Promise<Group> => {
  const { data } = await api.put(`/groups/${groupId}`, {
    name: name.trim(),
    members,
  });
  return data.data as Group;
};

export const deleteGroup = async (groupId: string): Promise<void> => {
  await api.delete(`/groups/${groupId}`);
};
