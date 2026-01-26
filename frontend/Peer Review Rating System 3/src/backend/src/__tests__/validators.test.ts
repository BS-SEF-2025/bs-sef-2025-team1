import {
  validateAssignmentFields,
  isDeadlinePassed,
  calculateScore,
  validateSubmissionAnswers,
} from '../utils/validators';
import { Field } from '../types';

describe('Validators', () => {
  describe('validateAssignmentFields', () => {
    it('should validate valid fields with criterions and feedbacks', () => {
      const fields: Field[] = [
        {
          id: 'f1',
          name: 'Quality',
          type: 'scale',
          required: true,
          weight: 60,
          scaleMin: 1,
          scaleMax: 10,
        },
        {
          id: 'f2',
          name: 'Innovation',
          type: 'scale',
          required: true,
          weight: 40,
          scaleMin: 1,
          scaleMax: 10,
        },
        {
          id: 'f3',
          name: 'Comments',
          type: 'text',
          required: false,
          weight: 0,
        },
      ];

      const result = validateAssignmentFields(fields);
      expect(result.valid).toBe(true);
    });

    it('should reject fields with no criterions', () => {
      const fields: Field[] = [
        {
          id: 'f1',
          name: 'Comments',
          type: 'text',
          required: false,
          weight: 0,
        },
      ];

      const result = validateAssignmentFields(fields);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at least one criterion');
    });

    it('should reject fields with weights not summing to 100', () => {
      const fields: Field[] = [
        {
          id: 'f1',
          name: 'Quality',
          type: 'scale',
          required: true,
          weight: 50,
          scaleMin: 1,
          scaleMax: 10,
        },
        {
          id: 'f2',
          name: 'Innovation',
          type: 'scale',
          required: true,
          weight: 30,
          scaleMin: 1,
          scaleMax: 10,
        },
      ];

      const result = validateAssignmentFields(fields);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('100%');
    });

    it('should reject criterion that is not required', () => {
      const fields: Field[] = [
        {
          id: 'f1',
          name: 'Quality',
          type: 'scale',
          required: false, // Should be true for criterion
          weight: 100,
          scaleMin: 1,
          scaleMax: 10,
        },
      ];

      const result = validateAssignmentFields(fields);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('must be required');
    });

    it('should reject criterion that is not scale type', () => {
      const fields: Field[] = [
        {
          id: 'f1',
          name: 'Quality',
          type: 'text', // Should be scale for criterion
          required: true,
          weight: 100,
        },
      ];

      const result = validateAssignmentFields(fields);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('must be of type "scale"');
    });
  });

  describe('isDeadlinePassed', () => {
    it('should return true for past deadline', () => {
      const pastDate = new Date(Date.now() - 1000 * 60 * 60); // 1 hour ago
      expect(isDeadlinePassed(pastDate)).toBe(true);
    });

    it('should return false for future deadline', () => {
      const futureDate = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now
      expect(isDeadlinePassed(futureDate)).toBe(false);
    });
  });

  describe('calculateScore', () => {
    it('should calculate score correctly based on weights', () => {
      const fields: Field[] = [
        {
          id: 'f1',
          name: 'Quality',
          type: 'scale',
          required: true,
          weight: 60,
          scaleMin: 1,
          scaleMax: 10,
        },
        {
          id: 'f2',
          name: 'Innovation',
          type: 'scale',
          required: true,
          weight: 40,
          scaleMin: 1,
          scaleMax: 10,
        },
      ];

      const answers = [
        { fieldId: 'f1', value: 10 }, // 100% * 60% = 60
        { fieldId: 'f2', value: 5.5 }, // 50% * 40% = 20
      ];

      const score = calculateScore(answers, fields);
      expect(score).toBe(80); // 60 + 20
    });

    it('should ignore feedback fields in score calculation', () => {
      const fields: Field[] = [
        {
          id: 'f1',
          name: 'Quality',
          type: 'scale',
          required: true,
          weight: 100,
          scaleMin: 1,
          scaleMax: 10,
        },
        {
          id: 'f2',
          name: 'Comments',
          type: 'text',
          required: false,
          weight: 0,
        },
      ];

      const answers = [
        { fieldId: 'f1', value: 10 },
        { fieldId: 'f2', value: 'Great work!' },
      ];

      const score = calculateScore(answers, fields);
      expect(score).toBe(100);
    });
  });

  describe('validateSubmissionAnswers', () => {
    it('should validate correct answers', () => {
      const fields: Field[] = [
        {
          id: 'f1',
          name: 'Quality',
          type: 'scale',
          required: true,
          weight: 100,
          scaleMin: 1,
          scaleMax: 10,
        },
      ];

      const answers = [{ fieldId: 'f1', value: 8 }];

      const result = validateSubmissionAnswers(answers, fields);
      expect(result.valid).toBe(true);
    });

    it('should reject missing required field', () => {
      const fields: Field[] = [
        {
          id: 'f1',
          name: 'Quality',
          type: 'scale',
          required: true,
          weight: 100,
          scaleMin: 1,
          scaleMax: 10,
        },
      ];

      const answers: any[] = [];

      const result = validateSubmissionAnswers(answers, fields);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('missing');
    });

    it('should reject value outside scale range', () => {
      const fields: Field[] = [
        {
          id: 'f1',
          name: 'Quality',
          type: 'scale',
          required: true,
          weight: 100,
          scaleMin: 1,
          scaleMax: 10,
        },
      ];

      const answers = [{ fieldId: 'f1', value: 15 }]; // Outside range

      const result = validateSubmissionAnswers(answers, fields);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('between');
    });

    it('should reject invalid field ID', () => {
      const fields: Field[] = [
        {
          id: 'f1',
          name: 'Quality',
          type: 'scale',
          required: true,
          weight: 100,
          scaleMin: 1,
          scaleMax: 10,
        },
      ];

      const answers = [{ fieldId: 'invalid-id', value: 8 }];

      const result = validateSubmissionAnswers(answers, fields);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid field ID');
    });
  });
});
