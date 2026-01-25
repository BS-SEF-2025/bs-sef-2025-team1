import { Router } from "express";
import { httpLogger } from "../../utils/middlewares";
import { GroupDal } from "./dal";
import * as handlers from './handlers';
import { createAuthMiddleware, requireStaff } from "../../services/auth/middleware";

export const createGroupRouter = (dal: GroupDal, authService: any) => {
    const router = Router();
    const authMiddleware = createAuthMiddleware(authService);
    const decoratedHandlers = createDecoratedGroupHandlers(dal);

    router.get('/', authMiddleware, decoratedHandlers.getAllGroupsHandler);
    router.get('/:id', authMiddleware, decoratedHandlers.getGroupByIdHandler);
    router.post('/', authMiddleware, requireStaff, decoratedHandlers.createGroupHandler);
    router.put('/:id', authMiddleware, requireStaff, decoratedHandlers.updateGroupHandler);
    router.delete('/:id', authMiddleware, requireStaff, decoratedHandlers.deleteGroupHandler);

    return router;
}

export const createDecoratedGroupHandlers = (dal: GroupDal) => ({
    getAllGroupsHandler: httpLogger(handlers.getAllGroupsHandler(dal), 'getAllGroupsHandler'),
    getGroupByIdHandler: httpLogger(handlers.getGroupByIdHandler(dal), 'getGroupByIdHandler'),
    createGroupHandler: httpLogger(handlers.createGroupHandler(dal), 'createGroupHandler'),
    updateGroupHandler: httpLogger(handlers.updateGroupHandler(dal), 'updateGroupHandler'),
    deleteGroupHandler: httpLogger(handlers.deleteGroupHandler(dal), 'deleteGroupHandler'),
});