import { User } from "../schema";

export const mockStudent: User = {
  id: "user1",
  name: "John Doe",
  email: "john.doe@example.com",
  role: "student",
};

export const mockStaff: User = {
  id: "user2",
  name: "Jane Smith",
  email: "jane.smith@example.com",
  role: "staff",
};

export const users = [mockStaff, mockStudent];