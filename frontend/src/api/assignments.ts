import type { Assignment, Field } from "@/types";
import api from "./axiosInstance";

export const assignments = async (): Promise<Assignment[]> => {
  const { data } = await api.get("/assignments");
  return data.data as Assignment[];
};

export const assignment = async (assignmentId: string): Promise<Assignment> => {
  const { data } = await api.get(`/assignments/${assignmentId}`);
  return data.data as Assignment;
};

export const createAssignment = async ({
  title,
  description,
  courseId,
  deadline,
  fields,
}: {
  title: string;
  description: string;
  courseId: string;
  deadline: string;
  fields: Field[];
}): Promise<Assignment> => {
  const { data } = await api.post("/assignments", {
    title,
    description,
    courseId,
    deadline,
    fields,
  });
  return data.data as Assignment;
};

export const updateAssignment = async ({
  assignmentId,
  title,
  description,
  deadline,
  fields,
}: {
  assignmentId: string;
  title: string;
  description: string;
  deadline: string;
  fields: Field[];
}): Promise<Assignment> => {
  const { data } = await api.put(`/assignments/${assignmentId}`, {
    title,
    description,
    deadline,
    fields,
  });
  return data.data as Assignment;
};

export const deleteAssignment = async (assignmentId: string): Promise<void> => {
  await api.delete(`/assignments/${assignmentId}`);
};
