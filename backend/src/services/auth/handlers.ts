import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "./middleware";

export const getCurrentUserHandler =
  () => async (req: Request, res: Response) => {
    try {
      const user = (req as AuthenticatedRequest).user;

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
