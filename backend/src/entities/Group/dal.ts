import { CollectionReference, Firestore } from "firebase-admin/firestore";
import { Group, CreateGroup, UpdateGroup } from "./schema.js";
import { EntityNotFoundError } from "../../utils/errors/client.js";
import { isEntityExists } from "../../utils/firestore.utils.js";

export const groupCollectionName = "groups";

export class GroupDal {
  private collection: CollectionReference<Omit<Group, 'id'>>;

  constructor(private db: Firestore, private collectionName: string = groupCollectionName) {
    this.collection = this.db.collection(this.collectionName) as CollectionReference<Group>;
  }

  getAllGroups = async (): Promise<Group[]> => {
    const res = await this.collection.get();
    return res.docs.map((doc) => ({
      ...doc.data(),
    })) as Group[];
  };

  getGroupsByCourse = async (courseId: string): Promise<Group[]> => {
    const query = this.collection.where('courseId', '==', courseId);
    const res = await query.get();
    return res.docs.map((doc) => ({
      ...doc.data(),
    })) as Group[];
  };

  getGroupById = async (id: string): Promise<Group> => {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      throw new EntityNotFoundError(id, 'Group');
    }
    return { id: doc.id, ...doc.data() } as Group;
  };

  addGroup = async (groupData: CreateGroup): Promise<Group> => {
    const now = new Date();
    const group: Group = {
      id: '',
      ...groupData,
      members: groupData.members || [],
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await this.collection.add(group);

    return { ...group, id: docRef.id };
  };

  updateGroup = async (id: string, updates: UpdateGroup): Promise<Group> => {
    const doc = this.collection.doc(id);
    await this.assertGroupExists(id);

    await doc.update({
      ...updates,
      updatedAt: new Date(),
    });

    return this.getGroupById(id);
  };

  deleteGroup = async (id: string) => {
    const doc = this.collection.doc(id);
    await this.assertGroupExists(id);
    await doc.delete();
  };

  private assertGroupExists = async (id: string) => {
    const isExists = await isEntityExists(this.db, this.collectionName, id);
    if (!isExists) {
      throw new EntityNotFoundError(id, 'Group');
    }
  }
}