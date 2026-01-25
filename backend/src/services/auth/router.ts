import { Router } from "express";
import { httpLogger } from "../../utils/middlewares";
import { AuthService } from "./AuthService";
import * as handlers from './handlers';
import { createAuthMiddleware } from "./middleware";

export const createAuthRouter = (authService: AuthService) => {
    const router = Router();
    const authMiddleware = createAuthMiddleware(authService);
    const decoratedHandlers = createDecoratedAuthHandlers(authService);

    router.post('/register', decoratedHandlers.registerHandler);
    router.post('/login', decoratedHandlers.loginHandler);
    router.get('/me', authMiddleware, decoratedHandlers.getCurrentUserHandler);

    return router;
}

export const createDecoratedAuthHandlers = (authService: AuthService) => ({
    registerHandler: httpLogger(handlers.registerHandler(authService), 'registerHandler'),
    loginHandler: httpLogger(handlers.loginHandler(authService), 'loginHandler'),
    getCurrentUserHandler: httpLogger(handlers.getCurrentUserHandler(authService), 'getCurrentUserHandler'),
});