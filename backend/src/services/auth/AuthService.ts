import { UserDal } from "../../entities/User/dal.js";
import { User } from "../../entities/User/schema.js";
import { Auth, DecodedIdToken } from "firebase-admin/auth";

export class AuthService {
  constructor(
    private userDal: UserDal,
    private auth: Auth,
  ) {}

  async getCurrentUser(userId: string): Promise<User> {
    return this.userDal.getUserById(userId);
  }

  async findOrCreateUser(
    userEmail: string,
    userData: DecodedIdToken,
  ): Promise<User> {
    return this.userDal.findOrCreate(userEmail, userData);
  }

  async verifyToken(token: string): Promise<DecodedIdToken> {
    try {
      return await this.auth.verifyIdToken(token);
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  async removeUser(userId: string): Promise<void> {
    await this.auth.deleteUser(userId);
  }
}
