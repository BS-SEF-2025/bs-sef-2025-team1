import z from 'zod';
import { createValidate } from '../../utils/validation';

export const FieldTypeSchema = z.enum(['text', 'scale']);
export type FieldType = z.infer<typeof FieldTypeSchema>;

export const FieldSchema = z.object({
    id: z.string(),
    name: z.string().min(1).max(200),
    type: FieldTypeSchema,
    required: z.boolean(),
    weight: z.number().min(0).max(100),
    scaleMin: z.number().optional(),
    scaleMax: z.number().optional(),
    description: z.string().optional(),
});

export type Field = z.infer<typeof FieldSchema>;

export const AssignmentSchema = z.object({
    id: z.string(),
    title: z.string().min(2).max(200),
    description: z.string().min(10),
    courseId: z.string(),
    deadline: z.date(),
    fields: z.array(FieldSchema).min(1),
    shareableLink: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    createdBy: z.string(),
});

export type Assignment = z.infer<typeof AssignmentSchema>;

export const validateAssignment = createValidate(AssignmentSchema);

export const CreateAssignmentSchema = z.object({
    title: z.string().min(2).max(200),
    description: z.string().min(10),
    courseId: z.string(),
    deadline: z.union([z.date(), z.string()]),
    fields: z.array(FieldSchema).min(1),
});

export const validateCreateAssignment = createValidate(CreateAssignmentSchema);
export type CreateAssignment = z.infer<typeof CreateAssignmentSchema>;

export const UpdateAssignmentSchema = z.object({
    title: z.string().min(2).max(200).optional(),
    description: z.string().min(10).optional(),
    deadline: z.union([z.date(), z.string()]).optional(),
    fields: z.array(FieldSchema).min(1).optional(),
});

export const validateUpdateAssignment = createValidate(UpdateAssignmentSchema);
export type UpdateAssignment = z.infer<typeof UpdateAssignmentSchema>;