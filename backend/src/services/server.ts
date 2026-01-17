import z from "zod";
import type { StoppableService } from "./types";
import express, {Express, json, Request, Response} from 'express';
import http from 'http';
import logger from "../utils/logger";
import { StatusCodes } from "http-status-codes";
import { createExampleEntityRouter } from "../ExampleEntity/router";
import { Firestore } from "firebase-admin/firestore";
import { ExampleEntityDal } from "../ExampleEntity/dal";
import { createCourseRouter } from "../Course/router";
import { CourseDal } from "../Course/dal";

export const ServerConfigSchema = z.object({
    PORT: z.coerce.number().positive(),
});

export type ServerConfig = z.infer<typeof ServerConfigSchema>

export class Server implements StoppableService {
    private app: Express;
    private server?: http.Server;

    constructor(private config: ServerConfig, firestore: Firestore) {
        this.app = express()
        this.registerMiddlewares();
        this.registerRoutes(firestore);
    }

    private registerMiddlewares = () => {
        this.app.use(json());
    }

    private registerRoutes = (firestore: Firestore) => {
        this.app.use('/courses', createCourseRouter(new CourseDal(firestore)));
        this.app.use('/entities', createExampleEntityRouter(new ExampleEntityDal(firestore)));
        this.app.get('/health', (_: Request, res: Response) => { res.sendStatus(StatusCodes.OK); });
    }

    start = () => {
        this.server = this.app.listen(this.config.PORT, () => {
            logger.info(`server running on port ${this.config.PORT}`);
        });
    };

    stop = () => {
        this.server?.close(() => {
            logger.info(`server gracefully closed`);
        });
    };
}