import { Request, Response } from "express";
import { ExampleEntityDal } from "./dal.js";
import { validateExampleEntity } from "./schema.js";
import { StatusCodes } from "http-status-codes";

export const getAllExampleEntitiesHandler = (dal: ExampleEntityDal) =>
    async (_: Request, res: Response) => {
        const exampleEntities = await dal.getAllExampleEntities();

        res.status(StatusCodes.OK).json(exampleEntities);
    };

export const getExampleEntityById = (dal: ExampleEntityDal) => 
    async (req: Request, res: Response) => {
        const id = req.params.id!.toString();

        const exampleEntity = await dal.getById(id);

        res.status(StatusCodes.OK).json(exampleEntity);
    };

export const addExampleEntity = (dal: ExampleEntityDal) => 
    async (req: Request, res: Response) => {
        const exampleEntity = validateExampleEntity(req.body);
        const id = await dal.addExampleEntity(exampleEntity);

        res.status(StatusCodes.CREATED).json({ id, ...exampleEntity });
    };

export const deleteExampleEntityById = (dal: ExampleEntityDal) => 
    async (req: Request, res: Response) => {
        const id = req.params.id!.toString();

        await dal.deleteExampleEntity(id);

        res.sendStatus(StatusCodes.OK);
    };
