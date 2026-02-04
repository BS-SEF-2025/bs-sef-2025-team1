import z from "zod";
import { createValidate } from "../../utils/validation.js";

const userRoles = ["STAFF", "STUDENT"] as const;
export type UserRole = (typeof userRoles)[number];

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(100),
  email: z.email(),
  role: z.enum(userRoles),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const validateUser = createValidate(UserSchema);
export type User = z.infer<typeof UserSchema>;

export const PartialUserSchema = UserSchema.partial();
export const validatePartialUser = createValidate(PartialUserSchema);
export type PartialUser = z.infer<typeof PartialUserSchema>;

export const AddUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email(),
  role: z.enum(userRoles),
});
export const validateAddUser = createValidate(AddUserSchema);
export type AddUser = z.infer<typeof AddUserSchema>;
