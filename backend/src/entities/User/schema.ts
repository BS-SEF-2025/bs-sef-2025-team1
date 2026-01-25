import z from "zod";
import { createValidate } from "../../utils/validation";

const userRoles = ['admin', 'staff', 'student'] as const;
export type UserRole = typeof userRoles[number];

export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.email(),
    role: z.enum(userRoles),
});
export const validateUser = createValidate(UserSchema);
export type User = z.infer<typeof UserSchema>;

export const PartialUserSchema = UserSchema.partial();
export const validatePartialUser = createValidate(PartialUserSchema);
export type PartialUser = z.infer<typeof PartialUserSchema>;