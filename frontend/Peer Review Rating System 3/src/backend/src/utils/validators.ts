import Joi from 'joi';
import { Field } from '../types';

// User validation schemas
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('staff', 'student').required(),
  groupId: Joi.string().optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Course validation schemas
export const createCourseSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  enrolledStudents: Joi.array().items(Joi.string()).default([]),
});

export const updateCourseSchema = Joi.object({
  name: Joi.string().min(2).max(200).optional(),
  enrolledStudents: Joi.array().items(Joi.string()).optional(),
});

// Group validation schemas
export const createGroupSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  courseId: Joi.string().required(),
  members: Joi.array().items(Joi.string()).min(1).required(),
});

export const updateGroupSchema = Joi.object({
  name: Joi.string().min(2).max(200).optional(),
  members: Joi.array().items(Joi.string()).min(1).optional(),
});

// Field validation schema
const fieldSchema = Joi.object({
  id: Joi.string().optional(), // Auto-generated if not provided
  name: Joi.string().min(2).max(200).required(),
  type: Joi.string().valid('text', 'scale').required(),
  required: Joi.boolean().required(),
  weight: Joi.number().min(0).max(100).required(),
  scaleMin: Joi.number().when('type', {
    is: 'scale',
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  scaleMax: Joi.number().when('type', {
    is: 'scale',
    then: Joi.required().greater(Joi.ref('scaleMin')),
    otherwise: Joi.forbidden(),
  }),
  description: Joi.string().max(500).optional(),
});

// Assignment validation schemas
export const createAssignmentSchema = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  description: Joi.string().max(2000).required(),
  courseId: Joi.string().required(),
  deadline: Joi.date().iso().greater('now').required(),
  fields: Joi.array().items(fieldSchema).min(1).required(),
});

export const updateAssignmentSchema = Joi.object({
  title: Joi.string().min(2).max(200).optional(),
  description: Joi.string().max(2000).optional(),
  deadline: Joi.date().iso().greater('now').optional(),
  fields: Joi.array().items(fieldSchema).min(1).optional(),
});

// Submission validation schema
export const createSubmissionSchema = Joi.object({
  assignmentId: Joi.string().required(),
  reviewedGroupId: Joi.string().required(),
  answers: Joi.array()
    .items(
      Joi.object({
        fieldId: Joi.string().required(),
        value: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
      })
    )
    .min(1)
    .required(),
});

/**
 * Business Rule: Validate assignment fields
 * - At least one criterion (weight > 0, type = scale, required = true)
 * - All criterions must have weight > 0
 * - All feedback fields must have weight = 0
 * - Sum of criterion weights must equal 100%
 */
export function validateAssignmentFields(fields: Field[]): { valid: boolean; error?: string } {
  // Check if there's at least one criterion
  const criterions = fields.filter(f => f.weight > 0);
  if (criterions.length === 0) {
    return { valid: false, error: 'Assignment must have at least one criterion (weight > 0)' };
  }

  // Validate each criterion
  for (const criterion of criterions) {
    if (criterion.type !== 'scale') {
      return {
        valid: false,
        error: `Criterion "${criterion.name}" must be of type "scale"`,
      };
    }
    if (!criterion.required) {
      return {
        valid: false,
        error: `Criterion "${criterion.name}" must be required`,
      };
    }
    if (!criterion.scaleMin || !criterion.scaleMax) {
      return {
        valid: false,
        error: `Criterion "${criterion.name}" must have scaleMin and scaleMax`,
      };
    }
  }

  // Check sum of weights
  const totalWeight = criterions.reduce((sum, f) => sum + f.weight, 0);
  if (Math.abs(totalWeight - 100) > 0.01) {
    // Allow small floating point errors
    return {
      valid: false,
      error: `Sum of criterion weights must equal 100% (current: ${totalWeight}%)`,
    };
  }

  // Validate feedback fields (weight = 0)
  const feedbacks = fields.filter(f => f.weight === 0);
  for (const feedback of feedbacks) {
    if (feedback.weight !== 0) {
      return {
        valid: false,
        error: `Feedback field "${feedback.name}" must have weight = 0`,
      };
    }
  }

  return { valid: true };
}

/**
 * Business Rule: Check if deadline has passed
 */
export function isDeadlinePassed(deadline: Date): boolean {
  return new Date(deadline) < new Date();
}

/**
 * Calculate score based on answers and field weights
 */
export function calculateScore(answers: { fieldId: string; value: string | number }[], fields: Field[]): number {
  let totalScore = 0;

  // Only consider criterion fields (weight > 0)
  const criterions = fields.filter(f => f.weight > 0);

  for (const criterion of criterions) {
    const answer = answers.find(a => a.fieldId === criterion.id);
    if (answer && typeof answer.value === 'number') {
      const normalizedScore = ((answer.value - (criterion.scaleMin || 0)) / 
        ((criterion.scaleMax || 10) - (criterion.scaleMin || 0))) * 100;
      totalScore += (normalizedScore * criterion.weight) / 100;
    }
  }

  return Math.round(totalScore * 100) / 100; // Round to 2 decimal places
}

/**
 * Validate submission answers against assignment fields
 */
export function validateSubmissionAnswers(
  answers: { fieldId: string; value: string | number }[],
  fields: Field[]
): { valid: boolean; error?: string } {
  // Check all required fields are answered
  const requiredFields = fields.filter(f => f.required);
  for (const field of requiredFields) {
    const answer = answers.find(a => a.fieldId === field.id);
    if (!answer) {
      return { valid: false, error: `Required field "${field.name}" is missing` };
    }
    if (answer.value === '' || answer.value === null || answer.value === undefined) {
      return { valid: false, error: `Required field "${field.name}" cannot be empty` };
    }
  }

  // Validate scale values are within range
  for (const answer of answers) {
    const field = fields.find(f => f.id === answer.fieldId);
    if (!field) {
      return { valid: false, error: `Invalid field ID: ${answer.fieldId}` };
    }

    if (field.type === 'scale' && typeof answer.value === 'number') {
      const min = field.scaleMin || 0;
      const max = field.scaleMax || 10;
      if (answer.value < min || answer.value > max) {
        return {
          valid: false,
          error: `Value for "${field.name}" must be between ${min} and ${max}`,
        };
      }
    }

    if (field.type === 'text' && typeof answer.value !== 'string') {
      return {
        valid: false,
        error: `Value for "${field.name}" must be text`,
      };
    }
  }

  return { valid: true };
}
