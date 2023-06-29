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

async function updateLastRally(userDoc) {
  await updateDoc(userDoc.ref, { lastRally: new Date().getTime() });
}

export default async function getEmail(req, res) {
  if (req.method === "POST") {
    const { userIds, caller } = req.body;

    try {
      const callerDoc = await getUserByEmail(caller);

      if (!callerDoc) {
        return res.status(404).json({ error: "Caller not found." });
      }

      const canContinue = isTimeoutOver(callerDoc.data().lastRally, 10000);
      console.log(canContinue);
      if (!canContinue) {
        console.log("You cannont continue!");
        return res.status(403).json({ error: "The timeout has not finished." });
      }

      await updateLastRally(callerDoc);
    } catch (error) {
      console.error("Error setting the lastRally field:", error);
      return res.status(500).json({
        error: "An error occurred while setting the lastRally field.",
      });
    }

    try {
      const emailPromises = userIds.map(async (userId) => {
        const userDoc = await getUserByEmail(userId);

        if (userDoc) {
          const email = userDoc.data().email;
          return email;
        } else {
          return null;
        }
      });

      const emails = await Promise.all(emailPromises);

      res.status(200).json({ emails });
    } catch (error) {
      console.error("Error retrieving emails:", error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving emails." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
