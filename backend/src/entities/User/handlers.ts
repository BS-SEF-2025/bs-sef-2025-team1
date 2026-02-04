import { Request, Response } from "express";

import { StatusCodes } from "http-status-codes";
import { UserDal } from "./dal.js";
import { validatePartialUser, User } from "./schema.js";

export const getAllUsersHandler =
  (dal: UserDal) => async (_: Request, res: Response) => {
    const users = await dal.getAllUsers();

    res.status(StatusCodes.OK).json({
      success: true,
      data: users,
    });
  };

export const updateUser =
  (dal: UserDal) => async (req: Request, res: Response) => {
    const id = req.params.id!.toString();
    const updates = validatePartialUser(req.body);

    await dal.updateUser(id, updates as Partial<User>);

    res.sendStatus(StatusCodes.NO_CONTENT);
  };

export const getUserById =
  (dal: UserDal) => async (req: Request, res: Response) => {
    const id = req.params.id!.toString();

    const user = await dal.getUserById(id);

    res.status(StatusCodes.OK).json({
      success: true,
      data: user,
    });
  };
