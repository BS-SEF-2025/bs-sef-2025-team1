import z from "zod";
import { createValidate } from "../utils/validation";

export const ExampleEntitySchema = z.object({
    attribute1: z.string(),
    attribute2: z.number().default(42),
});

export type ExampleEntity = z.infer<typeof ExampleEntitySchema>;

export const validateExampleEntity = createValidate(ExampleEntitySchema);