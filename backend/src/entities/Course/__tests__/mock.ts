import { Course } from "../schema";

export const courses: Course[] = [
    {
        id: 'course1',
        name: 'Linear Algebra',
        enrolledStudents: ['student1', 'student2'],
        createdBy: 'staff1',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
    },
    {
        id: 'course2',
        name: 'OOP',
        enrolledStudents: ['student3'],
        createdBy: 'staff1',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
    }
];