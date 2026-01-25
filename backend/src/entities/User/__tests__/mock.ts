import { User } from "../schema";

export const mockStudent: User = {
  id: "student1",
  name: "John Doe",
  email: "john.doe@example.com",
  password: "hashedpassword",
  role: "student",
  groupId: "group1",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockStaff: User = {
  id: "staff1",
  name: "Jane Smith",
  email: "jane.smith@example.com",
  password: "hashedpassword",
  role: "staff",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const users = [mockStaff, mockStudent];