import { Router } from "express";
import { httpLogger } from "../../utils/middlewares.js";
import { GroupDal } from "./dal.js";
import { CourseDal } from "../Course/dal.js";
import * as handlers from './handlers.js';
import { createAuthMiddleware, requireStaff } from "../../services/auth/middleware.js";

export const createGroupRouter = (dal: GroupDal, courseDal: CourseDal, authService: any) => {
    const router = Router();
    const authMiddleware = createAuthMiddleware(authService);
    const decoratedHandlers = createDecoratedGroupHandlers(dal, courseDal);

    router.get('/', authMiddleware, decoratedHandlers.getAllGroupsHandler);
    router.get('/:id', authMiddleware, decoratedHandlers.getGroupByIdHandler);
    router.post('/', authMiddleware, requireStaff, decoratedHandlers.createGroupHandler);
    router.put('/:id', authMiddleware, requireStaff, decoratedHandlers.updateGroupHandler);
    router.delete('/:id', authMiddleware, requireStaff, decoratedHandlers.deleteGroupHandler);

    return router;
}

export const createDecoratedGroupHandlers = (dal: GroupDal, courseDal: CourseDal) => ({
    getAllGroupsHandler: httpLogger(handlers.getAllGroupsHandler(dal), 'getAllGroupsHandler'),
    getGroupByIdHandler: httpLogger(handlers.getGroupByIdHandler(dal), 'getGroupByIdHandler'),
    createGroupHandler: httpLogger(handlers.createGroupHandler(dal, courseDal), 'createGroupHandler'),
    updateGroupHandler: httpLogger(handlers.updateGroupHandler(dal, courseDal), 'updateGroupHandler'),
    deleteGroupHandler: httpLogger(handlers.deleteGroupHandler(dal), 'deleteGroupHandler'),
});