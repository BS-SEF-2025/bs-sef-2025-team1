import { CollectionReference, Firestore } from "firebase-admin/firestore";
import { Assignment, CreateAssignment, UpdateAssignment, Field } from "./schema";
import { EntityNotFoundError } from "../../utils/errors/client";
import { isEntityExists } from "../../utils/firestore.utils";

export const assignmentCollectionName = "assignments";

export class AssignmentDal {
  private collection: CollectionReference<Omit<Assignment, 'id'>>;

  constructor(private db: Firestore, private collectionName: string = assignmentCollectionName) {
    this.collection = this.db.collection(this.collectionName) as CollectionReference<Assignment>;
  }

  getAllAssignments = async (): Promise<Assignment[]> => {
    const res = await this.collection.get();
    return res.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Assignment[];
  };

  getAssignmentsByCourse = async (courseId: string): Promise<Assignment[]> => {
    const query = this.collection.where('courseId', '==', courseId);
    const res = await query.get();
    return res.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Assignment[];
  };

  getAssignmentsByCreator = async (creatorId: string): Promise<Assignment[]> => {
    const query = this.collection.where('createdBy', '==', creatorId);
    const res = await query.get();
    return res.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Assignment[];
  };

  getAssignmentById = async (id: string): Promise<Assignment> => {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      throw new EntityNotFoundError(id, 'Assignment');
    }
    return { id: doc.id, ...doc.data() } as Assignment;
  };

  addAssignment = async (assignmentData: CreateAssignment, createdBy: string): Promise<Assignment> => {
    // Validate fields
    this.validateFields(assignmentData.fields);

    const now = new Date();
    const deadline = typeof assignmentData.deadline === 'string'
      ? new Date(assignmentData.deadline)
      : assignmentData.deadline;

    if (deadline <= now) {
      throw new Error('Deadline must be in the future');
    }

    // Generate shareable link
    const shareableLink = `http://localhost:3000?assignment=${Date.now()}`; // TODO: Use proper link generation

    const assignment: Assignment = {
      id: '',
      ...assignmentData,
      deadline,
      shareableLink,
      createdBy,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await this.collection.add(assignment);

    return { ...assignment, id: docRef.id };
  };

  updateAssignment = async (id: string, updates: UpdateAssignment): Promise<Assignment> => {
    const doc = this.collection.doc(id);
    await this.assertAssignmentExists(id);

    if (updates.fields) {
      this.validateFields(updates.fields);
    }

    if (updates.deadline) {
      const deadline = typeof updates.deadline === 'string'
        ? new Date(updates.deadline)
        : updates.deadline;

      if (deadline <= new Date()) {
        throw new Error('Deadline must be in the future');
      }
      updates.deadline = deadline;
    }

    await doc.update({
      ...updates,
      updatedAt: new Date(),
    });

    return this.getAssignmentById(id);
  };

  deleteAssignment = async (id: string) => {
    const doc = this.collection.doc(id);
    await this.assertAssignmentExists(id);
    await doc.delete();
  };

  private validateFields = (fields: Field[]) => {
    const criteriaFields = fields.filter(f => f.weight > 0);
    const feedbackFields = fields.filter(f => f.weight === 0);

    if (criteriaFields.length === 0) {
      throw new Error('At least one criterion field (weight > 0) is required');
    }

    const totalWeight = criteriaFields.reduce((sum, f) => sum + f.weight, 0);
    if (totalWeight !== 100) {
      throw new Error('Sum of criterion weights must equal 100');
    }

    // All criteria must be scale type and required
    for (const field of criteriaFields) {
      if (field.type !== 'scale' || !field.required) {
        throw new Error('All criteria fields must be scale type and required');
      }
    }

    // All feedback fields must have weight 0
    for (const field of feedbackFields) {
      if (field.weight !== 0) {
        throw new Error('Feedback fields must have weight 0');
      }
    }
  };

  private assertAssignmentExists = async (id: string) => {
    const isExists = await isEntityExists(this.db, this.collectionName, id);
    if (!isExists) {
      throw new EntityNotFoundError(id, 'Assignment');
    }
  }
}