import admin from "firebase-admin";
import path from "path";

const serviceAccount = require(
  path.resolve(
    process.cwd(),
    "movies-b0c73-firebase-adminsdk-fbsvc-b5b6d9245f.json"
  )
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
