import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CourseDal } from "./dal";
import { validateCreateCourse, validateUpdateCourse } from "./schema";
import { AuthenticatedRequest } from "../../services/auth/middleware";

export const getAllCoursesHandler =
  (dal: CourseDal) => async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    let courses;
    if (user.role === 'staff') {
      courses = await dal.getCoursesByCreator(user.id);
    } else {
      courses = await dal.getCoursesByEnrolledStudent(user.id);
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: courses,
    });
  };

export const getCourseByIdHandler =
  (dal: CourseDal) => async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const course = await dal.getCourseById(id);

    res.status(StatusCodes.OK).json({
      success: true,
      data: course,
    });
  };

export const createCourseHandler =
  (dal: CourseDal) => async (req: Request, res: Response) => {
    const courseData = validateCreateCourse(req.body);
    const createdBy = (req as AuthenticatedRequest).user.id;
    const course = await dal.addCourse(courseData, createdBy);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: course,
    });
  };

export const updateCourseHandler =
  (dal: CourseDal) => async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const updates = validateUpdateCourse(req.body);
    const course = await dal.updateCourse(id, updates);

    res.status(StatusCodes.OK).json({
      success: true,
      data: course,
    });
  };

export const deleteCourseHandler =
  (dal: CourseDal) => async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await dal.deleteCourse(id);

    res.sendStatus(StatusCodes.NO_CONTENT);
  };
