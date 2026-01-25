import z from 'zod';
import { createValidate } from '../../utils/validation';

export const SubmissionAnswerSchema = z.object({
    fieldId: z.string(),
    value: z.union([z.string(), z.number()]),
});

export type SubmissionAnswer = z.infer<typeof SubmissionAnswerSchema>;

export const SubmissionSchema = z.object({
    id: z.string(),
    assignmentId: z.string(),
    studentId: z.string(),
    reviewedGroupId: z.string(),
    answers: z.array(SubmissionAnswerSchema),
    calculatedScore: z.number(),
    submittedAt: z.date(),
});

export type Submission = z.infer<typeof SubmissionSchema>;

export const validateSubmission = createValidate(SubmissionSchema);

export const CreateSubmissionSchema = z.object({
    assignmentId: z.string(),
    reviewedGroupId: z.string(),
    answers: z.array(SubmissionAnswerSchema),
});

export const validateCreateSubmission = createValidate(CreateSubmissionSchema);
export type CreateSubmission = z.infer<typeof CreateSubmissionSchema>;

export const UpdateSubmissionSchema = z.object({
    answers: z.array(SubmissionAnswerSchema),
});

export const validateUpdateSubmission = createValidate(UpdateSubmissionSchema);
export type UpdateSubmission = z.infer<typeof UpdateSubmissionSchema>;

export const SubmissionQuerySchema = z.object({
    assignmentId: z.string().optional(),
    studentId: z.string().optional(),
    reviewedGroupId: z.string().optional(),
    courseId: z.string().optional(),
});

export type SubmissionQuery = z.infer<typeof SubmissionQuerySchema>;