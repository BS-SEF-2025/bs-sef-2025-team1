import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { GroupDal } from "./dal.js";
import { CourseDal } from "../Course/dal.js";
import { validateCreateGroup, validateUpdateGroup } from "./schema.js";

const validateGroupMembers = async (courseDal: CourseDal, courseId: string, memberIds: string[]) => {
  const course = await courseDal.getCourseById(courseId);
  const enrolledStudentIds = course.enrolledStudents;
  
  for (const memberId of memberIds) {
    if (!enrolledStudentIds.includes(memberId)) {
      throw new Error(`Student ${memberId} is not enrolled in course ${courseId}`);
    }
  }
};

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
  (dal: GroupDal, courseDal: CourseDal) => async (req: Request, res: Response) => {
    const groupData = validateCreateGroup(req.body);
    
    // Validate that all members are enrolled in the course
    if (groupData.members && groupData.members.length > 0) {
      await validateGroupMembers(courseDal, groupData.courseId, groupData.members);
    }
    
    const group = await dal.addGroup(groupData);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: group,
    });
  };

export const updateGroupHandler =
  (dal: GroupDal, courseDal: CourseDal) => async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const updates = validateUpdateGroup(req.body);
    
    // If members are being updated, validate they are enrolled in the course
    if (updates.members) {
      const group = await dal.getGroupById(id);
      await validateGroupMembers(courseDal, group.courseId, updates.members);
    }
    
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