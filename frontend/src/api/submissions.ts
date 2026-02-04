import type { Submission, SubmissionAnswer } from "@/types";
import api from "./axiosInstance";

export const submissions = async (): Promise<Submission[]> => {
  const { data } = await api.get("/submissions");
  return data.data as Submission[];
};

export const createSubmission = async (
  assignmentId: string,
  reviewedGroupId: string,
  answers: SubmissionAnswer[],
): Promise<Submission> => {
  const { data } = await api.post("/submissions", {
    assignmentId,
    reviewedGroupId,
    answers,
  });
  return data.data as Submission;
};
