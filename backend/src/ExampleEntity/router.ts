import { Router } from "express";
import { ExampleEntityDal } from "./dal.js";
import * as handlers from './handlers.js';

export const createExampleEntityRouter = (dal: ExampleEntityDal) => {
    const router = Router();

    router.get('/', handlers.getAllExampleEntitiesHandler(dal));
    router.get('/:id', handlers.getExampleEntityById(dal));
    router.post('/', handlers.addExampleEntity(dal));
    router.delete('/:id', handlers.deleteExampleEntityById(dal));

    return router;
}