import z from 'zod';
import { createValidate } from '../utils/validation';

export const CourseSchema = z.object({
    name: z.string(),
    courseId: z.string()
}); 

export type Course = z.infer<typeof CourseSchema>;

export const validateCourse = createValidate(CourseSchema);