import { Request, Response } from "express";

import { StatusCodes } from "http-status-codes";
import { UserDal } from "./dal";
import { validatePartialUser, validateUser, User } from "./schema";

export const getAllUsersHandler =
  (dal: UserDal) => async (_: Request, res: Response) => {
    const users = await dal.getAllUsers();

    res.json(users);
  };

export const addUserHandler =
  (dal: UserDal) => async (req: Request, res: Response) => {
    const userData = validateUser(req.body);

    const newUser = await dal.addUser(userData);

    res.status(StatusCodes.CREATED).json(newUser);
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

    res.json(user);
  };

export const deleteUser = (dal: UserDal) => async (req: Request, res: Response) => {
  const id = req.params.id!.toString();

  await dal.deleteUser(id);

  res.sendStatus(StatusCodes.OK);
};
