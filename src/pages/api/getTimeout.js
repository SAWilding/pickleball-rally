import {
  db,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "../../db/connect";
import { isTimeoutOver } from "@/library/functions";

async function getUserByEmail(userId) {
  const usersCollection = collection(db, "users");
  const q = query(usersCollection, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  const userDoc = snapshot.docs[0];
  return userDoc;
}

export default async function getEmail(req, res) {
  if (req.method === "POST") {
    const { caller } = req.body;

    try {
      const callerDoc = await getUserByEmail(caller);

      if (!callerDoc) {
        return res.status(404).json({ error: "Caller not found." });
      }

      const [canContinue, timeRemaining] = isTimeoutOver(
        callerDoc.data().lastRally,
        30 * 60 * 1000
      );
      if (!canContinue) {
        return res.json({ timeRemaining: timeRemaining });
      } else {
        return res.json({ timeRemaining: 0 });
      }
    } catch (error) {
      console.log("There was an error getting the timeout.", error);
    }
  }
}
