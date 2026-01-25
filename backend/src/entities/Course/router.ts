import { Router } from "express";
import { httpLogger } from "../../utils/middlewares";
import { CourseDal } from "./dal";
import * as handlers from './handlers';
import { createAuthMiddleware, requireStaff } from "../../services/auth/middleware";

export const createCourseRouter = (dal: CourseDal, authService: any) => {
    const router = Router();
    const authMiddleware = createAuthMiddleware(authService);
    const decoratedHandlers = createDecoratedCourseHandlers(dal);

    router.get('/', authMiddleware, decoratedHandlers.getAllCoursesHandler);
    router.get('/:id', authMiddleware, decoratedHandlers.getCourseByIdHandler);
    router.post('/', authMiddleware, requireStaff, decoratedHandlers.createCourseHandler);
    router.put('/:id', authMiddleware, requireStaff, decoratedHandlers.updateCourseHandler);
    router.delete('/:id', authMiddleware, requireStaff, decoratedHandlers.deleteCourseHandler);

    return router;
}

export const createDecoratedCourseHandlers = (dal: CourseDal) => ({
    getAllCoursesHandler: httpLogger(handlers.getAllCoursesHandler(dal), 'getAllCoursesHandler'),
    getCourseByIdHandler: httpLogger(handlers.getCourseByIdHandler(dal), 'getCourseByIdHandler'),
    createCourseHandler: httpLogger(handlers.createCourseHandler(dal), 'createCourseHandler'),
    updateCourseHandler: httpLogger(handlers.updateCourseHandler(dal), 'updateCourseHandler'),
    deleteCourseHandler: httpLogger(handlers.deleteCourseHandler(dal), 'deleteCourseHandler'),
});