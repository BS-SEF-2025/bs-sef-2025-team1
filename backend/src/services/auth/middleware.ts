import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "../auth/AuthService.js";
import { User } from "../../entities/User/schema.js";

export interface AuthenticatedRequest extends Request {
  user: User;
}

// const ALLOWED_DOMAINS = ["sce.ac.il", "ac.sce.ac.il"];

export const createAuthMiddleware = (authService: AuthService) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          error: "Authorization header missing or invalid",
        });
        return;
      }

      const token = authHeader.substring(7); // Remove 'Bearer '
      const decoded = await authService.verifyToken(token);

      const email = decoded.email || "";

      // ✅ Domain validation
      // const domain = email.split("@")[1]!;

      // if (!ALLOWED_DOMAINS.includes(domain)) {
      //   await authService.removeUser(decoded.uid);

      //   res.status(StatusCodes.UNAUTHORIZED).json({
      //     success: false,
      //     error: "Unauthorized domain",
      //   });

      //   return;
      // }

      const user = await authService.findOrCreateUser(email, decoded);

      (req as AuthenticatedRequest).user = user;
      next();
    } catch (error) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        error: "Invalid or expired token",
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
        error: "Insufficient permissions",
      });
      return;
    }

    next();
  };
};

export const requireStaff = requireRole(["STAFF"]);
export const requireStudent = requireRole(["STUDENT"]);
