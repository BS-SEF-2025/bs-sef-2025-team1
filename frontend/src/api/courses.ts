import type { Course } from "@/types";
import api from "./axiosInstance";

export const courses = async (): Promise<Course[]> => {
  const { data } = await api.get("/courses");
  return data.data as Course[];
};

export const createCourse = async ({
  name,
  studentIds,
}: {
  name: string;
  studentIds: string[];
}): Promise<Course> => {
  const { data } = await api.post("/courses", {
    name: name.trim(),
    enrolledStudents: studentIds,
  });
  return data.data as Course;
};

export const updateCourse = async ({
  courseId,
  name,
  studentIds,
}: {
  courseId: string;
  name: string;
  studentIds: string[];
}): Promise<Course> => {
  const { data } = await api.put(`/courses/${courseId}`, {
    name: name.trim(),
    enrolledStudents: studentIds,
  });
  return data.data as Course;
};

export const deleteCourse = async (courseId: string): Promise<void> => {
  await api.delete(`/courses/${courseId}`);
};
