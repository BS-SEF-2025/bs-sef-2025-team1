export const UserRole = {
  STAFF: "STAFF",
  STUDENT: "STUDENT",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export type DashboardStatKey =
  | "managedCourses"
  | "activeAssignments"
  | "studentGroups"
  | "receivedSubmissions"
  | "submittedReviews"
  | "enrolledCourses"
  | "pendingAssignments";

export type DashboardStatsResponse = Record<DashboardStatKey, number>;
