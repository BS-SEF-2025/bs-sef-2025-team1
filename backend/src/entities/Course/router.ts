import { Router } from "express";
import { httpLogger } from "../../utils/middlewares";
import { CourseDal } from "./dal";
import * as handlers from './handlers';

export const createCourseRouter = (dal: CourseDal) => {
    const router = Router();
    const decoratedHandlers = createDecoratedCourseHandlers(dal);

    router.get('/', decoratedHandlers.getAllCoursesHandler);
    router.post('/', decoratedHandlers.addCourseHandler);
    router.put('/:id', decoratedHandlers.renameCourseHandler);
    router.delete('/:id', decoratedHandlers.deleteCourseHandler);

    return router;
}

export const createDecoratedCourseHandlers = (dal: CourseDal) => ({
    getAllCoursesHandler: httpLogger(handlers.getAllCoursesHandler(dal), 'getAllCoursesHandler'),
    addCourseHandler: httpLogger(handlers.addCourseHandler(dal), 'addCourseHandler'),
    renameCourseHandler: httpLogger(handlers.renameCourseHandler(dal), 'renameCourseHandler'),
    deleteCourseHandler: httpLogger(handlers.deleteCourseHandler(dal), 'deleteCourseHandler'),
});