import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "./AuthService";
import { validateRegisterUser, validateLoginUser } from "../../entities/User/schema";

export const registerHandler = (authService: AuthService) =>
  async (req: Request, res: Response) => {
    try {
      const userData = validateRegisterUser(req.body);
      const result = await authService.register(userData);

      res.status(StatusCodes.CREATED).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      const statusCode = error.message.includes('already exists')
        ? StatusCodes.CONFLICT
        : StatusCodes.BAD_REQUEST;

      res.status(statusCode).json({
        success: false,
        error: error.message,
      });
    }
  };

export const loginHandler = (authService: AuthService) =>
  async (req: Request, res: Response) => {
    try {
      const credentials = validateLoginUser(req.body);
      const result = await authService.login(credentials);

      res.status(StatusCodes.OK).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        error: error.message,
      });
    }
  };

export const getCurrentUserHandler = (authService: AuthService) =>
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const user = await authService.getCurrentUser(userId);

      res.status(StatusCodes.OK).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: error.message,
      });
    }
  };