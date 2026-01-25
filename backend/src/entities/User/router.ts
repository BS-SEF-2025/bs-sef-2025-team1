import { Router } from "express";
import { httpLogger } from "../../utils/middlewares";
import { UserDal } from "./dal";
import * as handlers from './handlers';

export const createUserRouter = (dal: UserDal) => {
    const router = Router();
    const decoratedHandlers = createDecoratedUserHandlers(dal);

    router.get('/', decoratedHandlers.getAllUsersHandler);
    router.post('/', decoratedHandlers.addUserHandler);
    router.get('/:id', decoratedHandlers.getUserById);
    router.put('/:id', decoratedHandlers.updateUser);
    router.delete('/:id', decoratedHandlers.deleteUser);

    return router;
}

export const createDecoratedUserHandlers = (dal: UserDal) => ({
    getAllUsersHandler: httpLogger(handlers.getAllUsersHandler(dal), 'getAllUsersHandler'),
    addUserHandler: httpLogger(handlers.addUserHandler(dal), 'addUserHandler'),
    getUserById: httpLogger(handlers.getUserById(dal), 'getUserById'),
    updateUser: httpLogger(handlers.updateUser(dal), 'updateUser'),
    deleteUser: httpLogger(handlers.deleteUser(dal), 'deleteUser'),
});