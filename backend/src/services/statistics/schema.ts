import z from "zod";

export const StaffStatisticsSchema = z.object({
  coursesAmount: z.number().nonnegative(),
  openAssignmentsAmount: z.number().nonnegative(),
  submissionAmount: z.number().nonnegative(),
});

export type StaffStatistics = z.infer<typeof StaffStatisticsSchema>;

export const StudentStatisticsSchema = z.object({
  assignmentsToSubmitAmount: z.number().nonnegative(),
  submissionsGivenAmount: z.number().nonnegative(),
  submissionsRecievedAmount: z.number().nonnegative(),
});

export type StudentStatistics = z.infer<typeof StudentStatisticsSchema>;

export type Statistics = StaffStatistics | StudentStatistics;
