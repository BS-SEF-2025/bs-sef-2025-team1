import z from "zod";
import { ServerConfigSchema } from "./services/server.js";
import { SystemConfig } from "./services/System.js";
import { createValidate } from "./utils/validation.js";
import { FirestoreConfigSchema } from "./services/firestore.js";

export const SystemEnvSchema = z.object({
    ...ServerConfigSchema.shape,
    ...FirestoreConfigSchema.shape,
});

export const validateSystemEnv = createValidate(SystemEnvSchema);

export const createSystemConfig = (env: NodeJS.ProcessEnv): SystemConfig => {
    const validated = validateSystemEnv(env);

    return {
        server: {
            PORT: validated.PORT,
            JWT_SECRET: validated.JWT_SECRET,
        },
        firestore: {
            SERVICE_ACCOUNT_KEY_PATH: validated.SERVICE_ACCOUNT_KEY_PATH,
        }
    };
};