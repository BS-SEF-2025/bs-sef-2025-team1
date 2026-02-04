import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AssignmentDal } from "./dal.js";
import {
  validateCreateAssignment,
  validateUpdateAssignment,
} from "./schema.js";
import { SubmissionDal } from "../Submission/dal.js";

export const getAllAssignmentsHandler =
  (dal: AssignmentDal) => async (req: Request, res: Response) => {
    const courseId = req.query.courseId as string;
    const assignments = courseId
      ? await dal.getAssignmentsByCourse(courseId)
      : await dal.getAllAssignments();

    res.status(StatusCodes.OK).json({
      success: true,
      data: assignments,
    });
  };

export const getAssignmentByIdHandler =
  (dal: AssignmentDal) => async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const assignment = await dal.getAssignmentById(id);

    res.status(StatusCodes.OK).json({
      success: true,
      data: assignment,
    });
  };

export const createAssignmentHandler =
  (dal: AssignmentDal) => async (req: Request, res: Response) => {
    const assignmentData = validateCreateAssignment(req.body);
    const createdBy = (req as any).user.id; // From auth middleware
    const assignment = await dal.addAssignment(assignmentData, createdBy);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: assignment,
    });
  };

export const updateAssignmentHandler =
  (dal: AssignmentDal, submissionDal: SubmissionDal) =>
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const updates = validateUpdateAssignment(req.body);
    const assignment = await dal.updateAssignment(id, updates);

    await submissionDal.updateSubmissionsScore(assignment);

    res.status(StatusCodes.OK).json({
      success: true,
      data: assignment,
    });
  };

export const deleteAssignmentHandler =
  (dal: AssignmentDal) => async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await dal.deleteAssignment(id);

    res.sendStatus(StatusCodes.NO_CONTENT);
  };
