import { CollectionReference, Firestore } from "firebase-admin/firestore";
import { EntityWithId } from "../utils/types";
import { Course } from "./schema";
import { EntityNotFoundError } from "../utils/errors/client";

export const courseCollectionName = "courses";

export class CourseDal {
  private collection: CollectionReference<Course>;

  constructor(db: Firestore, collectionName: string = courseCollectionName) {
    this.collection = db.collection(collectionName) as CollectionReference<Course>;
  }

  getAllCourses = async (): Promise<EntityWithId<Course>[]> => {
    const res = await this.collection.get();

    return res.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  addCourse = async (course: Course): Promise<EntityWithId<Course>> => {
    const res = await this.collection.add(course);

    return {
      id: res.id,
      ...course
    };
  }

  renameCourse = async (id: string, newName: string) => {
    const doc = this.collection.doc(id);
    const isExists = (await doc.get()).exists;
    
    if (!isExists) {
      throw new EntityNotFoundError(id);
    }

    await doc.update({
      name: newName
    });
  }

  deleteCourse = async (id: string) => {
    const doc = this.collection.doc(id);
    const isExists = (await doc.get()).exists
    
    if (!isExists) {
      throw new EntityNotFoundError(id);
    }

    await doc.delete();
  }
}
