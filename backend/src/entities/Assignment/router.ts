import { Router } from "express";
import { httpLogger } from "../../utils/middlewares.js";
import { AssignmentDal } from "./dal.js";
import * as handlers from "./handlers.js";
import {
  createAuthMiddleware,
  requireStaff,
} from "../../services/auth/middleware.js";
import { SubmissionDal } from "../Submission/dal.js";

export const createAssignmentRouter = (
  dal: AssignmentDal,
  submissionDal: SubmissionDal,
  authService: any,
) => {
  const router = Router();
  const authMiddleware = createAuthMiddleware(authService);
  const decoratedHandlers = createDecoratedAssignmentHandlers(
    dal,
    submissionDal,
  );

  router.get("/", authMiddleware, decoratedHandlers.getAllAssignmentsHandler);
  router.get(
    "/:id",
    authMiddleware,
    decoratedHandlers.getAssignmentByIdHandler,
  );
  router.post(
    "/",
    authMiddleware,
    requireStaff,
    decoratedHandlers.createAssignmentHandler,
  );
  router.put(
    "/:id",
    authMiddleware,
    requireStaff,
    decoratedHandlers.updateAssignmentHandler,
  );
  router.delete(
    "/:id",
    authMiddleware,
    requireStaff,
    decoratedHandlers.deleteAssignmentHandler,
  );

  return router;
};

export const createDecoratedAssignmentHandlers = (
  dal: AssignmentDal,
  submissionDal: SubmissionDal,
) => ({
  getAllAssignmentsHandler: httpLogger(
    handlers.getAllAssignmentsHandler(dal),
    "getAllAssignmentsHandler",
  ),
  getAssignmentByIdHandler: httpLogger(
    handlers.getAssignmentByIdHandler(dal),
    "getAssignmentByIdHandler",
  ),
  createAssignmentHandler: httpLogger(
    handlers.createAssignmentHandler(dal),
    "createAssignmentHandler",
  ),
  updateAssignmentHandler: httpLogger(
    handlers.updateAssignmentHandler(dal, submissionDal),
    "updateAssignmentHandler",
  ),
  deleteAssignmentHandler: httpLogger(
    handlers.deleteAssignmentHandler(dal),
    "deleteAssignmentHandler",
  ),
});
