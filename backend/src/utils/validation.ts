import { ZodType } from "zod";
import { ValidationError } from "./errors/client.js";

export const createValidate = <T>(schema: ZodType<T>) =>
    (val: unknown): T => {
        const {error, success, data} = schema.safeParse(val);

        if (!success) {
            throw new ValidationError(error.message);
        }

        return data;
    }