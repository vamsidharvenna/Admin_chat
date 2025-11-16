const admin = require("firebase-admin");
const serviceAccount = require("./vamsidharvennabot-firebase-adminsdk-fbsvc-2e00731471.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// List all documents in the "conversations" collection
db.collection("conversations")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  })
  .catch((error) => {
    console.error("Error getting documents: ", error);
  });
