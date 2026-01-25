import z from "zod";
import { createValidate } from "../../utils/validation";

const userRoles = ['staff', 'student'] as const;
export type UserRole = typeof userRoles[number];

export const UserSchema = z.object({
    id: z.string(),
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(6), // hashed
    role: z.enum(userRoles),
    groupId: z.string().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const validateUser = createValidate(UserSchema);
export type User = z.infer<typeof UserSchema>;

export const PartialUserSchema = UserSchema.partial();
export const validatePartialUser = createValidate(PartialUserSchema);
export type PartialUser = z.infer<typeof PartialUserSchema>;

export const RegisterUserSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(userRoles),
    groupId: z.string().optional(),
});
export const validateRegisterUser = createValidate(RegisterUserSchema);
export type RegisterUser = z.infer<typeof RegisterUserSchema>;

export const LoginUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});
export const validateLoginUser = createValidate(LoginUserSchema);
export type LoginUser = z.infer<typeof LoginUserSchema>;

export const UserResponseSchema = UserSchema.omit({ password: true });
export const validateUserResponse = createValidate(UserResponseSchema);
export type UserResponse = z.infer<typeof UserResponseSchema>;