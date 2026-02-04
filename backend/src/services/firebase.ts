import admin from "firebase-admin";
import { Firestore } from "firebase-admin/firestore";
import { isNil } from "ramda";
import z from "zod";
import { ServiceNotInitializedError } from "../utils/errors/types.js";
import { RunnableService } from "./types.js";
import { Auth } from "firebase-admin/auth";

export const FirebaseConfigSchema = z.object({
  SERVICE_ACCOUNT_KEY_PATH: z.string(),
});

export type FirebaseConfig = z.infer<typeof FirebaseConfigSchema>;

export class FirebaseClient implements RunnableService {
  private auth?: Auth;
  private db?: Firestore;

  constructor(
    private config: FirebaseConfig,
    private enableTestEmulator: boolean = false,
  ) {}

  start = () => {
    admin.initializeApp({
      credential: admin.credential.cert(this.config.SERVICE_ACCOUNT_KEY_PATH),
    });

    this.db = admin.firestore();
    this.auth = admin.auth();

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

  getAuth = (): Auth => {
    if (isNil(this.auth)) {
      throw new ServiceNotInitializedError("auth");
    }

    return this.auth;
  };
}
