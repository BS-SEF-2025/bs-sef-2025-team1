import { CollectionReference, Firestore } from "firebase-admin/firestore";
import { ExampleEntity } from "./schema.js";
import { EntityNotFoundError } from "../../utils/errors/client.js";

export const collectionName = 'exampleEntities';

export class ExampleEntityDal {
    private collection: CollectionReference;

    constructor(db: Firestore) {
        this.collection = db.collection(collectionName);
    }

    getAllExampleEntities = async () => {
        const res = await this.collection.get();

        return res.docs.map(doc => ({
            id: doc.id, 
            ...doc.data()
        }));
    }

    getById = async (id: string) => {
        const doc = await this.collection.doc(id).get();

        if (!doc.exists) 
            throw new EntityNotFoundError(id);

        return { id: doc.id, ...doc.data() } as ExampleEntity & { id: string };
    }

    addExampleEntity = async (exampleEntity: ExampleEntity) => {
        const res = await this.collection.add(exampleEntity);

        return res.id;
    }

    deleteExampleEntity = async (id: string) => this.collection.doc(id).delete();
}