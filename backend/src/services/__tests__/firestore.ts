import { FirestoreClient, FirestoreConfig } from "../firestore";

const config: FirestoreConfig = {
    'SERVICE_ACCOUNT_KEY_PATH': 'amiteam-64f5a-firebase-adminsdk-fbsvc-3f69e32121.json'
}

export const testFirestoreClient = new FirestoreClient(config, true);
testFirestoreClient.start();