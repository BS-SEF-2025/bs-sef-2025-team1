import { Router } from "express";
import { httpLogger } from "../../utils/middlewares.js";
import { SubmissionDal } from "./dal.js";
import * as handlers from "./handlers.js";
import {
  createAuthMiddleware,
  requireStaff,
  requireStudent,
} from "../../services/auth/middleware.js";
import { AssignmentDal } from "../Assignment/dal.js";

export const createSubmissionRouter = (
  dal: SubmissionDal,
  assignmentDal: AssignmentDal,
  authService: any,
) => {
  const router = Router();
  const authMiddleware = createAuthMiddleware(authService);
  const decoratedHandlers = createDecoratedSubmissionHandlers(
    dal,
    assignmentDal,
  );

  router.get("/", authMiddleware, decoratedHandlers.getAllSubmissionsHandler);
  router.get(
    "/:id",
    authMiddleware,
    decoratedHandlers.getSubmissionByIdHandler,
  );
  router.post(
    "/",
    authMiddleware,
    requireStudent,
    decoratedHandlers.createSubmissionHandler,
  );
  router.put(
    "/:id",
    authMiddleware,
    requireStudent,
    decoratedHandlers.updateSubmissionHandler,
  );
  router.delete(
    "/:id",
    authMiddleware,
    decoratedHandlers.deleteSubmissionHandler,
  );
  router.get(
    "/stats/:assignmentId",
    authMiddleware,
    requireStaff,
    decoratedHandlers.getSubmissionStatsHandler,
  );

  return router;
};

export const createDecoratedSubmissionHandlers = (
  dal: SubmissionDal,
  assignmentDal: AssignmentDal,
) => ({
  getAllSubmissionsHandler: httpLogger(
    handlers.getAllSubmissionsHandler(dal),
    "getAllSubmissionsHandler",
  ),
  getSubmissionByIdHandler: httpLogger(
    handlers.getSubmissionByIdHandler(dal),
    "getSubmissionByIdHandler",
  ),
  createSubmissionHandler: httpLogger(
    handlers.createSubmissionHandler(dal, assignmentDal),
    "createSubmissionHandler",
  ),
  updateSubmissionHandler: httpLogger(
    handlers.updateSubmissionHandler(dal, assignmentDal),
    "updateSubmissionHandler",
  ),
  deleteSubmissionHandler: httpLogger(
    handlers.deleteSubmissionHandler(dal),
    "deleteSubmissionHandler",
  ),
  getSubmissionStatsHandler: httpLogger(
    handlers.getSubmissionStatsHandler(dal),
    "getSubmissionStatsHandler",
  ),
});
