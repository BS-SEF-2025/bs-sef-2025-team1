import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from '../auth/AuthService';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export const createAuthMiddleware = (authService: AuthService) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          error: 'Authorization header missing or invalid',
        });
        return;
      }

      const token = authHeader.substring(7); // Remove 'Bearer '
      const user = authService.verifyToken(token);

      (req as AuthenticatedRequest).user = user;
      next();
    } catch (error) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        error: 'Invalid or expired token',
      });
    }
  };
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthenticatedRequest).user;

    if (!user || !allowedRoles.includes(user.role)) {
      res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        error: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
};

export const requireStaff = requireRole(['staff']);
export const requireStudent = requireRole(['student']);