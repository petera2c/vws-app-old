import { getDatabase, connectDatabaseEmulator } from "@firebase/database";
import { getFirestore, connectFirestoreEmulator } from "@firebase/firestore";
import { getAuth, connectAuthEmulator } from "@firebase/auth";
import firebaseApp from "./firebase_init";

const db = getFirestore(firebaseApp);
const db2 = getDatabase(firebaseApp);

//window.location.hostname === "localhost"
if (window.location.hostname === "localhost2") {
  connectFirestoreEmulator(db, "localhost", 8080);
  connectDatabaseEmulator(db2, "localhost", 9000);
  const auth = getAuth();
  connectAuthEmulator(auth, "http://localhost:9099");
}

export { db, db2 };
