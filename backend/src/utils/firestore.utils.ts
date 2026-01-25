import {
  CollectionReference,
  DocumentData,
  Firestore,
  WriteBatch,
  Timestamp,
} from "firebase-admin/firestore";
import { isNil } from "ramda";
import { EntityWithId } from "./types";

export const createInsertMany = (db: Firestore) => {
  return async <T extends EntityWithId<DocumentData>>(
    collectionName: string,
    data: T[],
  ) => {
    const collectionRef = db.collection(collectionName);
    const batch = db.batch();

    data.forEach((item) => {
      const docId = item.id;
      const docRef = docId ? collectionRef.doc(docId) : collectionRef.doc();
      batch.set(docRef, item);
    });

    await batch.commit();
  };
};

export const createDeleteMany = (db: Firestore) => {
  return async <T>(collectionRef: CollectionReference<T>, docIds: string[]) => {
    const batch: WriteBatch = db.batch();

    docIds.forEach((id) => {
      const docRef = collectionRef.doc(id);
      batch.delete(docRef);
    });

    await batch.commit();
  };
};

export const createDeleteCollection =
  (db: Firestore) => (collectionName: string) =>
    db.recursiveDelete(db.collection(collectionName));

export const addTestPrefix = (str: string) => `test_${str}`;

export const isEntityExists = (
  db: Firestore,
  collectionName: string,
  entityId?: string,
) => {
  const curriedEntityId = async (entityId: string) =>
    (await db.collection(collectionName).doc(entityId).get()).exists;

  if (isNil(entityId)) {
    return curriedEntityId;
  }

  return curriedEntityId(entityId);
};

export const convertTimestampsToDates = (obj: any): any => {
  if (obj instanceof Timestamp) {
    return obj.toDate();
  }
  if (Array.isArray(obj)) {
    return obj.map(convertTimestampsToDates);
  }
  if (obj && typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      result[key] = convertTimestampsToDates(obj[key]);
    }
    return result;
  }
  return obj;
};
