import type { UserRole } from "./definitions";

export interface Link {
  to: string;
  label: string;
  icon: React.ElementType;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

interface StaffStatistics {
  coursesAmount: number;
  openAssignmentsAmount: number;
  submissionAmount: number;
}

interface StudentStatistics {
  assignmentsToSubmitAmount: number;
  submissionsGivenAmount: number;
  submissionsRecievedAmount: number;
}

export type Statistics = StaffStatistics | StudentStatistics;

export interface Course {
  id: string;
  name: string;
  enrolledStudents: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
