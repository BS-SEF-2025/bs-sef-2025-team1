import z from "zod";
import type { StoppableService } from "./types.js";
import express, {Express, json, Request, Response} from 'express';
import http from 'http';
import logger from "../utils/logger.js";
import { StatusCodes } from "http-status-codes";
import { createExampleEntityRouter } from "../entities/ExampleEntity/router.js";
import { Firestore } from "firebase-admin/firestore";
import { ExampleEntityDal } from "../entities/ExampleEntity/dal.js";
import { createCourseRouter } from "../entities/Course/router.js";
import { CourseDal } from "../entities/Course/dal.js";
import { createGroupRouter } from "../entities/Group/router.js";
import { GroupDal } from "../entities/Group/dal.js";
import { createAssignmentRouter } from "../entities/Assignment/router.js";
import { AssignmentDal } from "../entities/Assignment/dal.js";
import { createSubmissionRouter } from "../entities/Submission/router.js";
import { SubmissionDal } from "../entities/Submission/dal.js";
import { createAuthRouter } from "./auth/router.js";
import { AuthService } from "./auth/AuthService.js";
import { UserDal } from "../entities/User/dal.js";
import { createUserRouter } from "../entities/User/router.js";
import cors from 'cors';

export const ServerConfigSchema = z.object({
    PORT: z.coerce.number().positive(),
    JWT_SECRET: z.string().min(32),
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
        this.app.use(cors())
    }

    private registerRoutes = (firestore: Firestore) => {
        // Initialize DALs
        const userDal = new UserDal(firestore);
        const courseDal = new CourseDal(firestore);
        const groupDal = new GroupDal(firestore);
        const assignmentDal = new AssignmentDal(firestore);
        const submissionDal = new SubmissionDal(firestore);
        const exampleEntityDal = new ExampleEntityDal(firestore);

        // Initialize Auth Service
        const authService = new AuthService(userDal, this.config.JWT_SECRET);

        // Register routes
        this.app.use('/api/auth', createAuthRouter(authService));
        this.app.use('/api/users', createUserRouter(userDal));
        this.app.use('/api/courses', createCourseRouter(courseDal, authService));
        this.app.use('/api/groups', createGroupRouter(groupDal, courseDal, authService));
        this.app.use('/api/assignments', createAssignmentRouter(assignmentDal, authService));
        this.app.use('/api/submissions', createSubmissionRouter(submissionDal, authService));
        this.app.use('/entities', createExampleEntityRouter(exampleEntityDal));

        this.app.get('/health', (_: Request, res: Response) => { res.sendStatus(StatusCodes.OK); });
        this.app.get('/secret', (_: Request, res: Response) => { res.redirect('https://youtu.be/dQw4w9WgXcQ')});
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