import type { Group } from "./entities";

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

export const FieldType = {
  TEXT: "text",
  SCALE: "scale",
} as const;

export type FieldType = (typeof FieldType)[keyof typeof FieldType];

export interface GroupResult {
  group: Group;
  avg: number;
  count: number;
}
