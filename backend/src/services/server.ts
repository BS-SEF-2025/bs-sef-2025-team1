import z from "zod";
import type { StoppableService } from "./types.js";
import express, {Express, json, Request, Response} from 'express';
import http from 'http';
import logger from "../utils/logger.js";
import { StatusCodes } from "http-status-codes";
import { createExampleEntityRouter } from "../ExampleEntity/router.js";
import { Firestore } from "firebase-admin/firestore";
import { ExampleEntityDal } from "../ExampleEntity/dal.js";

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

    private registerRoutes = (firebase: Firestore) => {
        this.app.use('/entities', createExampleEntityRouter(new ExampleEntityDal(firebase)));
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