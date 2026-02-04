import { User } from "../schema.js";

export const mockStudent: User = {
  id: "student1",
  name: "John Doe",
  email: "john.doe@example.com",
  role: "STUDENT",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockStaff: User = {
  id: "staff1",
  name: "Jane Smith",
  email: "jane.smith@example.com",
  role: "STAFF",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const users = [mockStaff, mockStudent];
