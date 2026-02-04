import type { FieldType, UserRole } from "./definitions";

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

export interface Group {
  id: string;
  name: string;
  courseId: string;
  members: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Field {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  weight: number;
  scaleMin?: number;
  scaleMax?: number;
  description?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  deadline: Date;
  fields: Field[];
  shareableLink: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface SubmissionAnswer {
  fieldId: string;
  value: string | number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  reviewedGroupId: string;
  answers: SubmissionAnswer[];
  calculatedScore: number;
  submittedAt: Date;
}
