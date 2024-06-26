import { getDatabase, connectDatabaseEmulator } from "@firebase/database";
import { getFirestore, connectFirestoreEmulator } from "@firebase/firestore";
import { getAuth, connectAuthEmulator } from "@firebase/auth";
import firebaseApp from "./firebase_init";
import { canUseWindow } from "@/misc/util";

const db = getFirestore(firebaseApp);
const db2 = getDatabase(firebaseApp);

if (canUseWindow() && window.location.hostname === "localhost") {
  connectFirestoreEmulator(db, "localhost", 8080);
  connectDatabaseEmulator(db2, "localhost", 9000);
  const auth = getAuth();
  connectAuthEmulator(auth, "http://localhost:9099");
}

export { db, db2 };
