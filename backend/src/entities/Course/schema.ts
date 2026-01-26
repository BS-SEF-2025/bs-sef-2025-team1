import z from 'zod';
import { createValidate } from '../../utils/validation.js';

export const CourseSchema = z.object({
    id: z.string(),
    name: z.string().min(2).max(200),
    enrolledStudents: z.array(z.string()).default([]),
    createdBy: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type Course = z.infer<typeof CourseSchema>;

export const validateCourse = createValidate(CourseSchema);

export const CreateCourseSchema = z.object({
    name: z.string().min(2).max(200),
    enrolledStudents: z.array(z.string()).optional(),
});
export const validateCreateCourse = createValidate(CreateCourseSchema);
export type CreateCourse = z.infer<typeof CreateCourseSchema>;

export const UpdateCourseSchema = z.object({
    name: z.string().min(2).max(200).optional(),
    enrolledStudents: z.array(z.string()).optional(),
});
export const validateUpdateCourse = createValidate(UpdateCourseSchema);
export type UpdateCourse = z.infer<typeof UpdateCourseSchema>;