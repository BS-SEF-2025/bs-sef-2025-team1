import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { createValidate } from "../utils/validation";
import { CourseDal } from "./dal";
import { validateCourse } from "./schema";

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

export const renameCourseSchema = z.object<Pick<Request, 'body'>>({
    body: z.object({
        name: z.string(),
    })
});

export const renameCourseHandler =
  (dal: CourseDal) => async (req: Request, res: Response) => {
    const courseId = req.params.id!.toString();
    const { body:{ name } } = createValidate(renameCourseSchema)(req);

    await dal.renameCourse(courseId, name);

    res.sendStatus(StatusCodes.NO_CONTENT);
  };

export const deleteCourseHandler =
  (dal: CourseDal) => async (req: Request, res: Response) => {
    const id = req.params.id!.toString();

    await dal.deleteCourse(id);

    res.sendStatus(StatusCodes.OK);
  };
