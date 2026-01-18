import { CollectionReference, Firestore } from "firebase-admin/firestore";
import { Course } from "./schema";
import { EntityNotFoundError } from "../utils/errors/client";
import { isEntityExists } from "../utils/firestore.utils";

export const courseCollectionName = "courses";

export class CourseDal {
  private collection: CollectionReference<Course>;

  constructor(private db: Firestore, private collectionName: string = courseCollectionName) {
    this.collection = this.db.collection(this.collectionName) as CollectionReference<Course>;
  }

  getAllCourses = async (): Promise<Course[]> => {
    const res = await this.collection.get();

    return res.docs.map((doc) => ({
      ...doc.data(),
    }));
  };

  addCourse = async (course: Course): Promise<Course> => {
    await this.collection.add(course);

    return course;
  }

  renameCourse = async (id: string, newName: string) => {
    const doc = this.collection.doc(id);
    
    await this.assertCourseExists(id);

    await doc.update({
      name: newName
    });
  }

  deleteCourse = async (id: string) => {
    const doc = this.collection.doc(id);
    
    await this.assertCourseExists(id)

    await doc.delete();
  }

  private assertCourseExists = async (id: string) => {
    const isExists = await isEntityExists(this.db, this.collectionName, id);

    if (!isExists) {
      throw new EntityNotFoundError(id, 'Course')
    }
  }
}
