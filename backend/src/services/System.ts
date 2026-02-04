import z from "zod";
import { Server, ServerConfigSchema } from "./server.js";
import { StoppableService } from "./types.js";
import { FirebaseClient, FirebaseConfigSchema } from "./firebase.js";

export const SystemConfigSchema = z.object({
  server: ServerConfigSchema,
  firestore: FirebaseConfigSchema,
});

export type SystemConfig = z.infer<typeof SystemConfigSchema>;

export class System implements StoppableService {
  private server?: Server;
  private firebase: FirebaseClient;

  constructor(private config: SystemConfig) {
    this.firebase = new FirebaseClient(this.config.firestore);
  }

  start = () => {
    this.firebase.start();
    this.server = new Server(
      this.config.server,
      this.firebase.getAuth(),
      this.firebase.getFirebase(),
    );
    this.server.start();
  };

  stop = () => {
    this.server?.stop();
  };
}
