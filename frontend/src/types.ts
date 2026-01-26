

export type UserRole = 'admin' | 'staff' | 'student';
export type FieldType = 'text' | 'scale';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    groupId?: string;
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

export interface Course {
    id: string;
    name: string;
    createdAt: Date;
    enrolledStudents: string[];
}

export interface Group {
    id: string;
    name: string;
    courseId: string;
    members: string[];
    createdAt: Date;
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