import { Router } from "express";
import { httpLogger } from "../../utils/middlewares.js";
import { UserDal } from "./dal.js";
import * as handlers from "./handlers.js";
import {
  createAuthMiddleware,
  requireStaff,
} from "../../services/auth/middleware.js";

export const createUserRouter = (dal: UserDal, authService: any) => {
  const router = Router();
  const authMiddleware = createAuthMiddleware(authService);
  const decoratedHandlers = createDecoratedUserHandlers(dal);

  router.get(
    "/",
    authMiddleware,
    requireStaff,
    decoratedHandlers.getAllUsersHandler,
  );
  router.get(
    "/:id",
    authMiddleware,
    requireStaff,
    decoratedHandlers.getUserById,
  );
  router.put(
    "/:id",
    authMiddleware,
    requireStaff,
    decoratedHandlers.updateUser,
  );

  return router;
};

export const createDecoratedUserHandlers = (dal: UserDal) => ({
  getAllUsersHandler: httpLogger(
    handlers.getAllUsersHandler(dal),
    "getAllUsersHandler",
  ),
  getUserById: httpLogger(handlers.getUserById(dal), "getUserById"),
  updateUser: httpLogger(handlers.updateUser(dal), "updateUser"),
});
