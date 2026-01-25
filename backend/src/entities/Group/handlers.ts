import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { GroupDal } from "./dal";
import { validateCreateGroup, validateUpdateGroup } from "./schema";

export const getAllGroupsHandler =
  (dal: GroupDal) => async (req: Request, res: Response) => {
    const courseId = req.query.courseId as string;
    const groups = courseId
      ? await dal.getGroupsByCourse(courseId)
      : await dal.getAllGroups();

    res.status(StatusCodes.OK).json({
      success: true,
      data: groups,
    });
  };

export const getGroupByIdHandler =
  (dal: GroupDal) => async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const group = await dal.getGroupById(id);

    res.status(StatusCodes.OK).json({
      success: true,
      data: group,
    });
  };

export const createGroupHandler =
  (dal: GroupDal) => async (req: Request, res: Response) => {
    const groupData = validateCreateGroup(req.body);
    const group = await dal.addGroup(groupData);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: group,
    });
  };

export const updateGroupHandler =
  (dal: GroupDal) => async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const updates = validateUpdateGroup(req.body);
    const group = await dal.updateGroup(id, updates);

    res.status(StatusCodes.OK).json({
      success: true,
      data: group,
    });
  };

export const deleteGroupHandler =
  (dal: GroupDal) => async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await dal.deleteGroup(id);

    res.sendStatus(StatusCodes.NO_CONTENT);
  };