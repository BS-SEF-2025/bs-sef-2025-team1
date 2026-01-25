import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserDal } from '../../entities/User/dal';
import { RegisterUser, LoginUser, UserResponse } from '../../entities/User/schema';

export class AuthService {
  constructor(
    private userDal: UserDal,
    private jwtSecret: string
  ) {}

  async register(userData: RegisterUser): Promise<{ user: UserResponse; token: string }> {
    // Check if user already exists
    const existingUser = await this.userDal.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Create user
    const user = await this.userDal.addUser({
      ...userData,
      password: hashedPassword,
    });

    // Get user response
    const userResponse = await this.userDal.getUserResponseById(user.id);

    // Generate token
    const token = this.generateToken(userResponse);

    return { user: userResponse, token };
  }

  async login(credentials: LoginUser): Promise<{ user: UserResponse; token: string }> {
    // Find user
    const user = await this.userDal.getUserByEmail(credentials.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const isValidPassword = await bcrypt.compare(credentials.password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Get user response
    const userResponse = await this.userDal.getUserResponseById(user.id);

    // Generate token
    const token = this.generateToken(userResponse);

    return { user: userResponse, token };
  }

  async getCurrentUser(userId: string): Promise<UserResponse> {
    return this.userDal.getUserResponseById(userId);
  }

  private generateToken(user: UserResponse): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      this.jwtSecret,
      { expiresIn: '7d' }
    );
  }

  verifyToken(token: string): { id: string; email: string; role: string } {
    try {
      return jwt.verify(token, this.jwtSecret) as { id: string; email: string; role: string };
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}