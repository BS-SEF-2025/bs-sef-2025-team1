import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { SubmissionDal } from "./dal.js";
import { validateCreateSubmission, validateUpdateSubmission, SubmissionQuery } from "./schema.js";

export const getAllSubmissionsHandler =
  (dal: SubmissionDal) => async (req: Request, res: Response) => {
    const query: SubmissionQuery = {
      assignmentId: req.query.assignmentId as string,
      studentId: req.query.studentId as string,
      reviewedGroupId: req.query.reviewedGroupId as string,
      courseId: req.query.courseId as string,
    };

    const submissions = await dal.getAllSubmissions(query);

    res.status(StatusCodes.OK).json({
      success: true,
      data: submissions,
    });
  };

export const getSubmissionByIdHandler =
  (dal: SubmissionDal) => async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const submission = await dal.getSubmissionById(id);

    res.status(StatusCodes.OK).json({
      success: true,
      data: submission,
    });
  };

export const createSubmissionHandler =
  (dal: SubmissionDal) => async (req: Request, res: Response) => {
    const submissionData = validateCreateSubmission(req.body);
    const studentId = (req as any).user.id; // From auth middleware
    const submission = await dal.addSubmission(submissionData, studentId);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: submission,
    });
  };

export const updateSubmissionHandler =
  (dal: SubmissionDal) => async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const updates = validateUpdateSubmission(req.body);
    const submission = await dal.updateSubmission(id, updates);

    res.status(StatusCodes.OK).json({
      success: true,
      data: submission,
    });
  };

export const deleteSubmissionHandler =
  (dal: SubmissionDal) => async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await dal.deleteSubmission(id);

    res.sendStatus(StatusCodes.NO_CONTENT);
  };

export const getSubmissionStatsHandler =
  (dal: SubmissionDal) => async (req: Request, res: Response) => {
    const assignmentId = req.params.assignmentId as string;
    const stats = await dal.getSubmissionStats(assignmentId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: stats,
    });
  };