import z from "zod";
import { Server, ServerConfigSchema } from "./server";
import { StoppableService } from "./types";
import { FirestoreClient, FirestoreConfigSchema } from "./firestore";

export const SystemConfigSchema = z.object({
    server: ServerConfigSchema,
    firestore: FirestoreConfigSchema,
});

export type SystemConfig = z.infer<typeof SystemConfigSchema>;

export class System implements StoppableService {
    private server?: Server;
    private firestore: FirestoreClient;

    constructor(private config: SystemConfig) {
        this.firestore = new FirestoreClient(this.config.firestore);
    }

    start = () => {
        this.firestore.start();
        this.server = new Server(this.config.server, this.firestore.getFirebase());
        this.server.start();
    };

    stop = () => {
        this.server?.stop();
    };
}