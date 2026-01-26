import { CollectionReference, Firestore } from "firebase-admin/firestore";
import { Course, CreateCourse, UpdateCourse } from "./schema.js";
import { EntityNotFoundError } from "../../utils/errors/client.js";
import { isEntityExists, convertTimestampsToDates } from "../../utils/firestore.utils.js";

export const courseCollectionName = "courses";

export class CourseDal {
  private collection: CollectionReference<Omit<Course, 'id'>>;

  constructor(private db: Firestore, private collectionName: string = courseCollectionName) {
    this.collection = this.db.collection(this.collectionName) as CollectionReference<Course>;
  }

  getAllCourses = async (): Promise<Course[]> => {
    const res = await this.collection.get();
    return res.docs.map((doc) => convertTimestampsToDates({
      ...doc.data(),
      id: doc.id,
    })) as Course[];
  };

  getCoursesByCreator = async (creatorId: string): Promise<Course[]> => {
    const query = this.collection.where('createdBy', '==', creatorId);
    const res = await query.get();
    return res.docs.map((doc) => convertTimestampsToDates({
      ...doc.data(),
      id: doc.id,
    })) as Course[];
  };

  getCoursesByEnrolledStudent = async (studentId: string): Promise<Course[]> => {
    const query = this.collection.where('enrolledStudents', 'array-contains', studentId);
    const res = await query.get();
    return res.docs.map((doc) => convertTimestampsToDates({
      ...doc.data(),
      id: doc.id,
    })) as Course[];
  };

  getCourseById = async (id: string): Promise<Course> => {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      throw new EntityNotFoundError(id, 'Course');
    }
    return convertTimestampsToDates({ ...doc.data(), id: doc.id }) as Course;
  };

  addCourse = async (courseData: CreateCourse, createdBy: string): Promise<Course> => {
    const now = new Date();
    const course: Omit<Course, 'id'> = {
      ...courseData,
      enrolledStudents: courseData.enrolledStudents || [],
      createdBy,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await this.collection.add(course);

    return { ...course, id: docRef.id } as Course;
  };

  updateCourse = async (id: string, updates: UpdateCourse): Promise<Course> => {
    const doc = this.collection.doc(id);
    await this.assertCourseExists(id);

    await doc.update({
      ...updates,
      updatedAt: new Date(),
    });

    return this.getCourseById(id);
  };

  deleteCourse = async (id: string) => {
    const doc = this.collection.doc(id);
    await this.assertCourseExists(id);

    // Get all related entities before deletion
    const groups = await this.getGroupsByCourse(id);
    const assignments = await this.getAssignmentsByCourse(id);
    
    // Delete all submissions for assignments in this course
    for (const assignment of assignments) {
      await this.deleteSubmissionsByAssignment(assignment.id);
    }
    
    // Delete all assignments for this course
    for (const assignment of assignments) {
      await this.deleteAssignment(assignment.id);
    }
    
    // Delete all groups for this course
    for (const group of groups) {
      await this.deleteGroup(group.id);
    }
    
    // Finally delete the course itself
    await doc.delete();
  };

  private assertCourseExists = async (id: string) => {
    const isExists = await isEntityExists(this.db, this.collectionName, id);
    if (!isExists) {
      throw new EntityNotFoundError(id, 'Course');
    }
  }

  // Helper methods for cascade deletion
  private getGroupsByCourse = async (courseId: string) => {
    const groupsCollection = this.db.collection('groups');
    const query = groupsCollection.where('courseId', '==', courseId);
    const res = await query.get();
    return res.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  private getAssignmentsByCourse = async (courseId: string) => {
    const assignmentsCollection = this.db.collection('assignments');
    const query = assignmentsCollection.where('courseId', '==', courseId);
    const res = await query.get();
    return res.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  private deleteGroup = async (groupId: string) => {
    const groupsCollection = this.db.collection('groups');
    await groupsCollection.doc(groupId).delete();
  };

  private deleteAssignment = async (assignmentId: string) => {
    const assignmentsCollection = this.db.collection('assignments');
    await assignmentsCollection.doc(assignmentId).delete();
  };

  private deleteSubmissionsByAssignment = async (assignmentId: string) => {
    const submissionsCollection = this.db.collection('submissions');
    const query = submissionsCollection.where('assignmentId', '==', assignmentId);
    const res = await query.get();
    
    const deletePromises = res.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
  };
}
