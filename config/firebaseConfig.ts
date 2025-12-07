import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

import * as serviceAccount from "../serviceAccountFile.json";

initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
});

const db: Firestore = getFirestore();

export { db };