import { Router } from "express";
import { ExampleEntityDal } from "./dal.js";
import * as handlers from './handlers.js';
import { httpLogger } from "../../utils/middlewares.js";

export const createExampleEntityRouter = (dal: ExampleEntityDal) => {
    const router = Router();

    const decoratedHandlers = createDecoratedExampleEntityHandlers(dal)

    router.get('/', decoratedHandlers.getAllExampleEntitiesHandler);
    router.get('/:id', decoratedHandlers.getExampleEntityById);
    router.post('/', decoratedHandlers.addExampleEntity);
    router.delete('/:id', decoratedHandlers.deleteExampleEntityById);

    return router;
}

export const createDecoratedExampleEntityHandlers = (dal: ExampleEntityDal) => ({
    getAllExampleEntitiesHandler: httpLogger(handlers.getAllExampleEntitiesHandler(dal), 'getAllExampleEntitiesHandler'),
    getExampleEntityById: httpLogger(handlers.getExampleEntityById(dal), 'getExampleEntityById'),
    addExampleEntity: httpLogger(handlers.addExampleEntity(dal), 'addExampleEntity'),
    deleteExampleEntityById: httpLogger(handlers.deleteExampleEntityById(dal), 'deleteExampleEntityById'),
});