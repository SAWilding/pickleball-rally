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

export default async function login(req, res) {
  try {
    const { email, password } = req.body;

    const response = await signInWithEmailAndPassword(auth, email, password);
    const user = response.user;

    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where("userId", "==", user.uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("first time login");
      const dofRef = await addDoc(collectionRef, {
        userId: user.uid,
        rallies: [],
        timestamp: new Date().getTime(),
      });
    } else {
      console.log("Previous user");
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, error: "Failed to login" });
  }
}
