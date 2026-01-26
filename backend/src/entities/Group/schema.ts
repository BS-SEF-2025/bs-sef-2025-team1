import z from 'zod';
import { createValidate } from '../../utils/validation.js';

export const GroupSchema = z.object({
    id: z.string(),
    name: z.string().min(2).max(100),
    courseId: z.string(),
    members: z.array(z.string()).default([]),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type Group = z.infer<typeof GroupSchema>;

export const validateGroup = createValidate(GroupSchema);

export const CreateGroupSchema = z.object({
    name: z.string().min(2).max(100),
    courseId: z.string(),
    members: z.array(z.string()).optional(),
});
export const validateCreateGroup = createValidate(CreateGroupSchema);
export type CreateGroup = z.infer<typeof CreateGroupSchema>;

export const UpdateGroupSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    members: z.array(z.string()).optional(),
});
export const validateUpdateGroup = createValidate(UpdateGroupSchema);
export type UpdateGroup = z.infer<typeof UpdateGroupSchema>;