import { createDeleteCollection, createInsertMany } from "../../utils/firestore.utils.js";
import { FirestoreClient, FirestoreConfig } from "../firestore.js";

const config: FirestoreConfig = {
    'SERVICE_ACCOUNT_KEY_PATH': 'amiteam-64f5a-firebase-adminsdk-fbsvc-3f69e32121.json'
}

const testFirestoreClient = new FirestoreClient(config, true);
testFirestoreClient.start();

export const testFirestore = testFirestoreClient.getFirebase();

export const insertMany = createInsertMany(testFirestore);
export const deleteCollection = createDeleteCollection(testFirestore);