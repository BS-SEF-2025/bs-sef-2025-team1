import { CollectionReference, Firestore, Query } from "firebase-admin/firestore";
import { Submission, CreateSubmission, UpdateSubmission, SubmissionQuery } from "./schema";
import { EntityNotFoundError } from "../../utils/errors/client";
import { isEntityExists } from "../../utils/firestore.utils";

export const submissionCollectionName = "submissions";

export class SubmissionDal {
  private collection: CollectionReference<Omit<Submission, 'id'>>;

  constructor(private db: Firestore, private collectionName: string = submissionCollectionName) {
    this.collection = this.db.collection(this.collectionName) as CollectionReference<Submission>;
  }

  getAllSubmissions = async (query?: SubmissionQuery): Promise<Submission[]> => {
    let firestoreQuery: Query = this.collection;

    if (query?.assignmentId) {
      firestoreQuery = firestoreQuery.where('assignmentId', '==', query.assignmentId);
    }
    if (query?.studentId) {
      firestoreQuery = firestoreQuery.where('studentId', '==', query.studentId);
    }
    if (query?.reviewedGroupId) {
      firestoreQuery = firestoreQuery.where('reviewedGroupId', '==', query.reviewedGroupId);
    }

    const res = await firestoreQuery.get();
    return res.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Submission[];
  };

  getSubmissionById = async (id: string): Promise<Submission> => {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      throw new EntityNotFoundError(id, 'Submission');
    }
    return { id: doc.id, ...doc.data() } as Submission;
  };

  addSubmission = async (submissionData: CreateSubmission, studentId: string): Promise<Submission> => {
    const now = new Date();
    const calculatedScore = this.calculateScore(submissionData.answers);

    const submission: Submission = {
      id: '',
      ...submissionData,
      studentId,
      calculatedScore,
      submittedAt: now,
    };

    const docRef = await this.collection.add(submission);

    return { ...submission, id: docRef.id };
  };

  updateSubmission = async (id: string, updates: UpdateSubmission): Promise<Submission> => {
    const doc = this.collection.doc(id);
    await this.assertSubmissionExists(id);

    const calculatedScore = this.calculateScore(updates.answers);

    await doc.update({
      ...updates,
      calculatedScore,
    });

    return this.getSubmissionById(id);
  };

  deleteSubmission = async (id: string) => {
    const doc = this.collection.doc(id);
    await this.assertSubmissionExists(id);
    await doc.delete();
  };

  getSubmissionStats = async (assignmentId: string) => {
    const submissions = await this.getAllSubmissions({ assignmentId });

    const totalSubmissions = submissions.length;
    const averageScore = totalSubmissions > 0
      ? submissions.reduce((sum, s) => sum + s.calculatedScore, 0) / totalSubmissions
      : 0;

    const groupStats = new Map<string, { count: number; totalScore: number; average: number }>();

    for (const submission of submissions) {
      const groupId = submission.reviewedGroupId;
      const existing = groupStats.get(groupId) || { count: 0, totalScore: 0, average: 0 };

      existing.count++;
      existing.totalScore += submission.calculatedScore;
      existing.average = existing.totalScore / existing.count;

      groupStats.set(groupId, existing);
    }

    return {
      totalSubmissions,
      averageScore,
      groupStats: Array.from(groupStats.entries()).map(([groupId, stats]) => ({
        groupId,
        ...stats,
      })),
    };
  };

  private calculateScore = (answers: { fieldId: string; value: string | number }[]): number => {
    // This is a simplified calculation. In reality, we'd need the field definitions
    // to calculate properly based on weights and scales.
    // For now, return a basic score.
    return answers.reduce((sum, answer) => {
      if (typeof answer.value === 'number') {
        return sum + answer.value;
      }
      return sum;
    }, 0);
  };

  private assertSubmissionExists = async (id: string) => {
    const isExists = await isEntityExists(this.db, this.collectionName, id);
    if (!isExists) {
      throw new EntityNotFoundError(id, 'Submission');
    }
  }
}