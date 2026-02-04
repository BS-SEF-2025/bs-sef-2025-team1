import {
  CollectionReference,
  Firestore,
  Query,
} from "firebase-admin/firestore";
import {
  Submission,
  CreateSubmission,
  UpdateSubmission,
  SubmissionQuery,
} from "./schema.js";
import { EntityNotFoundError } from "../../utils/errors/client.js";
import { isEntityExists } from "../../utils/firestore.utils.js";
import { Assignment } from "../Assignment/schema.js";

export const submissionCollectionName = "submissions";

export class SubmissionDal {
  private collection: CollectionReference;

  constructor(
    private db: Firestore,
    private collectionName: string = submissionCollectionName,
  ) {
    this.collection = this.db.collection(
      this.collectionName,
    ) as CollectionReference<Submission>;
  }

  getAllSubmissions = async (
    query?: SubmissionQuery,
  ): Promise<Submission[]> => {
    let firestoreQuery: Query = this.collection;

    if (query?.assignmentId) {
      firestoreQuery = firestoreQuery.where(
        "assignmentId",
        "==",
        query.assignmentId,
      );
    }
    if (query?.studentId) {
      firestoreQuery = firestoreQuery.where("studentId", "==", query.studentId);
    }
    if (query?.reviewedGroupId) {
      firestoreQuery = firestoreQuery.where(
        "reviewedGroupId",
        "==",
        query.reviewedGroupId,
      );
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
      throw new EntityNotFoundError(id, "Submission");
    }
    return { id: doc.id, ...doc.data() } as Submission;
  };

  addSubmission = async (
    submissionData: CreateSubmission,
    studentId: string,
    assignment: Assignment,
  ): Promise<Submission> => {
    const now = new Date();
    const calculatedScore = this.calculateScore(
      submissionData.answers,
      assignment,
    );

    const submission: Submission = {
      id: "",
      ...submissionData,
      studentId,
      calculatedScore,
      submittedAt: now,
    };

    const docRef = await this.collection.add(submission);

    return { ...submission, id: docRef.id };
  };

  updateSubmission = async (
    id: string,
    updates: UpdateSubmission,
    assignment: Assignment,
  ): Promise<Submission> => {
    const doc = this.collection.doc(id);
    await this.assertSubmissionExists(id);

    const calculatedScore = this.calculateScore(updates.answers, assignment);

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

  updateSubmissionsScore = async (assignment: Assignment) => {
    const submissions = await this.getAllSubmissions({
      assignmentId: assignment.id,
    });

    if (submissions.length === 0) return;

    const batch = this.db.batch();

    for (const submission of submissions) {
      const newScore = this.calculateScore(submission.answers, assignment);

      const docRef = this.collection.doc(submission.id);

      batch.update(docRef, {
        calculatedScore: newScore,
      });
    }

    await batch.commit();
  };

  getSubmissionStats = async (assignmentId: string) => {
    const submissions = await this.getAllSubmissions({ assignmentId });

    const totalSubmissions = submissions.length;
    const averageScore =
      totalSubmissions > 0
        ? submissions.reduce((sum, s) => sum + s.calculatedScore, 0) /
          totalSubmissions
        : 0;

    const groupStats = new Map<
      string,
      { count: number; totalScore: number; average: number }
    >();

    for (const submission of submissions) {
      const groupId = submission.reviewedGroupId;
      const existing = groupStats.get(groupId) || {
        count: 0,
        totalScore: 0,
        average: 0,
      };

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

  private calculateScore = (
    answers: { fieldId: string; value: string | number }[],
    assignment: Assignment,
  ): number => {
    const fieldsMap = new Map(assignment.fields.map((f) => [f.id, f]));

    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const answer of answers) {
      const field = fieldsMap.get(answer.fieldId);
      if (!field) continue;

      if (field.type !== "scale") continue;
      if (typeof answer.value !== "number") continue;
      if (field.scaleMin == null || field.scaleMax == null) continue;

      const { scaleMin, scaleMax, weight } = field;

      // Normalize value to 0..1
      const normalized = (answer.value - scaleMin) / (scaleMax - scaleMin);

      // Clamp in case someone sends invalid number
      const safeNormalized = Math.max(0, Math.min(1, normalized));

      totalWeightedScore += safeNormalized * weight;
      totalWeight += weight;
    }

    if (totalWeight === 0) return 0;

    // Convert to 0..100 final score
    return Math.round((totalWeightedScore / totalWeight) * 100);
  };

  private assertSubmissionExists = async (id: string) => {
    const isExists = await isEntityExists(this.db, this.collectionName, id);
    if (!isExists) {
      throw new EntityNotFoundError(id, "Submission");
    }
  };
}
