import {
  CollectionReference,
  WriteBatch,
  Firestore,
  DocumentData,
} from "firebase-admin/firestore";

export const createInsertMany = (db: Firestore) => {
  return async <T extends DocumentData>(collectionName: string, data: T[], idField?: keyof T) => {
    const collectionRef = db.collection(collectionName);
    const batch = db.batch();

    data.forEach((item) => {
      const docId = idField ? (item[idField] as string | undefined) : undefined;
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

export const createDeleteCollection = (db: Firestore) => 
  (collectionName: string) =>
  db.recursiveDelete(db.collection(collectionName));

export const addTestPrefix = (str: string) => `test_${str}`;
