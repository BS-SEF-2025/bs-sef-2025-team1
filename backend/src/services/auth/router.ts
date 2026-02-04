import { Router } from "express";
import { httpLogger } from "../../utils/middlewares.js";
import { AuthService } from "./AuthService.js";
import * as handlers from "./handlers.js";
import { createAuthMiddleware } from "./middleware.js";

export const createAuthRouter = (authService: AuthService) => {
  const router = Router();
  const authMiddleware = createAuthMiddleware(authService);
  const decoratedHandlers = createDecoratedAuthHandlers();

  router.get("/me", authMiddleware, decoratedHandlers.getCurrentUserHandler);

  return router;
};

export const createDecoratedAuthHandlers = () => ({
  getCurrentUserHandler: httpLogger(
    handlers.getCurrentUserHandler(),
    "getCurrentUserHandler",
  ),
});
