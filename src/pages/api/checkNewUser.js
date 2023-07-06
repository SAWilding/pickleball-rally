import {
  auth,
  signInWithEmailAndPassword,
  addDoc,
  getDocs,
  where,
  query,
  collection,
  db,
} from "../../db/connect";

const collectionName = "users";

export default async function checkNewUser(req, res) {
  try {
    const { userId, email } = req.body;

    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("New Google user.");
      const dofRef = await addDoc(collectionRef, {
        email: email,
        userId: userId,
        rallies: [],
        timestamp: new Date().getTime(),
        lastRally: 0,
      });
    } else {
      console.log("Previous Google user.");
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.log("There was an error checking for new user account", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to check for new Google user." });
  }
}
