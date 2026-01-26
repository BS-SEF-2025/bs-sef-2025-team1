import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database';
import { Group } from '../types';
import { AuthRequest } from '../middleware/auth';
import { createGroupSchema, updateGroupSchema } from '../utils/validators';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

/**
 * Create a new group
 * POST /api/groups
 * Staff only
 */
export const createGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Validate request body
    const { error, value } = createGroupSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const { name, courseId, members } = value;

    // Check if course exists
    const course = await db.getCourseById(courseId);
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    // Validate that all members are enrolled in the course
    for (const memberId of members) {
      if (!course.enrolledStudents.includes(memberId)) {
        throw new AppError(`Student ${memberId} is not enrolled in this course`, 400);
      }
    }

    // Create group
    const group: Group = {
      id: uuidv4(),
      name,
      courseId,
      members,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.createGroup(group);

    // Update users' groupId
    for (const memberId of members) {
      await db.updateUser(memberId, { groupId: group.id });
    }

    logger.info(`Group created: ${name} in course ${courseId}`);

    res.status(201).json({
      success: true,
      data: group,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Get all groups (filtered by course if query param provided)
 * GET /api/groups?courseId=xxx
 */
export const getGroups = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.query;

    let groups: Group[];

    if (courseId) {
      groups = await db.getGroupsByCourse(courseId as string);
    } else {
      groups = await db.getAllGroups();
    }

    // Filter by access rights for students
    if (req.user!.role === 'student') {
      const user = await db.getUserById(req.user!.id);
      const allCourses = await db.getAllCourses();
      const userCourseIds = allCourses
        .filter(c => c.enrolledStudents.includes(req.user!.id))
        .map(c => c.id);
      groups = groups.filter(g => userCourseIds.includes(g.courseId));
    }

    res.json({
      success: true,
      data: groups,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Get group by ID
 * GET /api/groups/:id
 */
export const getGroupById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const group = await db.getGroupById(id);
    if (!group) {
      throw new AppError('Group not found', 404);
    }

    // Check access rights for students
    if (req.user!.role === 'student') {
      const course = await db.getCourseById(group.courseId);
      if (!course || !course.enrolledStudents.includes(req.user!.id)) {
        throw new AppError('Access denied to this group', 403);
      }
    }

    res.json({
      success: true,
      data: group,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Update group
 * PUT /api/groups/:id
 * Staff only
 */
export const updateGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate request body
    const { error, value } = updateGroupSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    // Check if group exists
    const group = await db.getGroupById(id);
    if (!group) {
      throw new AppError('Group not found', 404);
    }

    // Validate that all new members are enrolled in the course
    if (value.members) {
      const course = await db.getCourseById(group.courseId);
      if (!course) {
        throw new AppError('Course not found', 404);
      }

      for (const memberId of value.members) {
        if (!course.enrolledStudents.includes(memberId)) {
          throw new AppError(`Student ${memberId} is not enrolled in this course`, 400);
        }
      }

      // Remove old members' groupId
      for (const oldMemberId of group.members) {
        if (!value.members.includes(oldMemberId)) {
          await db.updateUser(oldMemberId, { groupId: undefined });
        }
      }

      // Update new members' groupId
      for (const newMemberId of value.members) {
        await db.updateUser(newMemberId, { groupId: id });
      }
    }

    // Update group
    const updatedGroup = await db.updateGroup(id, value);

    logger.info(`Group updated: ${id}`);

    res.json({
      success: true,
      data: updatedGroup,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Delete group
 * DELETE /api/groups/:id
 * Staff only
 */
export const deleteGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if group exists
    const group = await db.getGroupById(id);
    if (!group) {
      throw new AppError('Group not found', 404);
    }

    // Remove groupId from all members
    for (const memberId of group.members) {
      await db.updateUser(memberId, { groupId: undefined });
    }

    // Delete group (cascades to submissions)
    await db.deleteGroup(id);

    logger.info(`Group deleted: ${id}`);

    res.status(204).send();
  } catch (error) {
    throw error;
  }
};
