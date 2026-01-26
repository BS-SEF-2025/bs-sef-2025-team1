import admin from "firebase-admin";
import { Firestore } from "firebase-admin/firestore";
import { isNil } from "ramda";
import z from "zod";
import { ServiceNotInitializedError } from "../utils/errors/types.js";
import { RunnableService } from "./types.js";

export const FirestoreConfigSchema = z.object({
  SERVICE_ACCOUNT_KEY_PATH: z.string(),
});

export type FirestoreConfig = z.infer<typeof FirestoreConfigSchema>;

export class FirestoreClient implements RunnableService {
  private db?: Firestore;

  constructor(
    private config: FirestoreConfig,
    private enableTestEmulator: boolean = false,
  ) {}

  start = () => {
    admin.initializeApp({
      credential: admin.credential.cert(this.config.SERVICE_ACCOUNT_KEY_PATH),
    });

    this.db = admin.firestore();

    if (this.enableTestEmulator) {
      this.db.settings({
        host: "localhost:8080",
        ssl: false,
      });
    }
  };

  getFirebase = (): Firestore => {
    if (isNil(this.db)) {
      throw new ServiceNotInitializedError("firestore");
    }

    return this.db;
  };
}
