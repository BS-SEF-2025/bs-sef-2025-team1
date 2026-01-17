import { CollectionReference, Firestore } from "firebase-admin/firestore";
import { EntityWithId } from "../utils/types";
import { Course } from "./schema";

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
}
