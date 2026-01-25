import { CollectionReference, Firestore } from "firebase-admin/firestore";
import { Course, CreateCourse, UpdateCourse } from "./schema";
import { EntityNotFoundError } from "../../utils/errors/client";
import { isEntityExists, convertTimestampsToDates } from "../../utils/firestore.utils";

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
    await doc.delete();
  };

  private assertCourseExists = async (id: string) => {
    const isExists = await isEntityExists(this.db, this.collectionName, id);
    if (!isExists) {
      throw new EntityNotFoundError(id, 'Course');
    }
  }
}
