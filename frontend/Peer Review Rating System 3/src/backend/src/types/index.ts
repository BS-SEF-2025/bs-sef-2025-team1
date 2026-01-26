// User types
export type UserRole = 'staff' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // hashed
  role: UserRole;
  groupId?: string; // For students - which group they belong to
  createdAt: Date;
  updatedAt: Date;
}

// Field types
export type FieldType = 'text' | 'scale';

export interface Field {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  weight: number; // 0 for feedback, >0 for criteria
  scaleMin?: number; // for scale type
  scaleMax?: number; // for scale type
  description?: string;
}

// Course model
export interface Course {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  enrolledStudents: string[]; // User IDs
  createdBy: string; // Staff user ID
}

// Group model
export interface Group {
  id: string;
  name: string;
  courseId: string;
  members: string[]; // User IDs
  createdAt: Date;
  updatedAt: Date;
}

// Assignment model
export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string; // Linked to a course
  deadline: Date;
  fields: Field[];
  shareableLink: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // Staff user ID
}

// Submission models
export interface SubmissionAnswer {
  fieldId: string;
  value: string | number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string; // User ID of submitter
  reviewedGroupId: string; // The group being reviewed
  answers: SubmissionAnswer[];
  calculatedScore: number;
  submittedAt: Date;
}

// Request types (with JWT payload)
export interface AuthRequest extends Express.Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Query params for filtering
export interface SubmissionQuery {
  assignmentId?: string;
  studentId?: string;
  reviewedGroupId?: string;
  courseId?: string;
}

export interface AssignmentQuery {
  courseId?: string;
  createdBy?: string;
}
