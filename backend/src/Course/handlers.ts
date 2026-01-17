import { Request, Response } from "express";
import { CourseDal } from "./dal";
import { validateCourse } from "./schema";
import { StatusCodes } from "http-status-codes";

export const getAllCoursesHandler =
  (dal: CourseDal) => async (_: Request, res: Response) => {
    const courses = await dal.getAllCourses();

    res.json(courses);
  };

export const addCourseHandler =
  (dal: CourseDal) => async (req: Request, res: Response) => {
    const newCourseData = validateCourse(req.body);

    const newCourse = await dal.addCourse(newCourseData);

    res.status(StatusCodes.CREATED).json(newCourse);
  };

export const renameCourseHandler =
  (dal: CourseDal) => async (req: Request, res: Response) => {
    //TODO
  };

export const deleteCourseHandler =
  (dal: CourseDal) => (req: Request, res: Response) => {
    //TODO
  };
