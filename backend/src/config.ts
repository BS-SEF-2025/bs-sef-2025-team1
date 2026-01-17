import z from "zod";
import { ServerConfigSchema } from "./services/server";
import { SystemConfig } from "./services/System";
import { createValidate } from "./utils/validation";
import { FirestoreConfigSchema } from "./services/firestore";

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
        },
        firestore: {
            SERVICE_ACCOUNT_KEY_PATH: validated.SERVICE_ACCOUNT_KEY_PATH,
        }
    };
};