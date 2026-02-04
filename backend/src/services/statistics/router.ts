import { Router } from "express";
import { httpLogger } from "../../utils/middlewares.js";
import { AuthService } from "../auth/AuthService.js";
import * as handlers from "./handlers.js";
import { createAuthMiddleware } from "../auth/middleware.js";
import { AssignmentDal } from "../../entities/Assignment/dal.js";
import { CourseDal } from "../../entities/Course/dal.js";
import { GroupDal } from "../../entities/Group/dal.js";
import { SubmissionDal } from "../../entities/Submission/dal.js";

export const createStatisticsRouter = (
  authService: AuthService,
  assignmentDal: AssignmentDal,
  courseDal: CourseDal,
  submissionDal: SubmissionDal,
  groupDal: GroupDal,
) => {
  const router = Router();
  const authMiddleware = createAuthMiddleware(authService);
  const decoratedHandlers = createDecoratedStatisticsHandlers(
    assignmentDal,
    courseDal,
    submissionDal,
    groupDal,
  );

  router.get("/", authMiddleware, decoratedHandlers.getStatistics);

  return router;
};

export const createDecoratedStatisticsHandlers = (
  assignmentDal: AssignmentDal,
  courseDal: CourseDal,
  submissionDal: SubmissionDal,
  groupDal: GroupDal,
) => ({
  getStatistics: httpLogger(
    handlers.getStatisticsHandler(
      assignmentDal,
      courseDal,
      submissionDal,
      groupDal,
    ),
    "getStatistics",
  ),
});
