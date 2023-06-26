// import {
//   db,
//   collection,
//   getDocs,
//   query,
//   where,
//   updateDoc,
// } from "../../db/connect";

// import { isTimeoutOver } from "@/library/functions";

// export default async function getEmail(req, res) {
//   if (req.method === "POST") {
//     //  Test timeout
//     const { userIds, caller } = req.body;
//     try {
//       const usersCollection = collection(db, "users");
//       const q = query(usersCollection, where("userId", "==", caller));
//       const snapshot = await getDocs(q);
//       const userDoc = snapshot.docs[0];

//       if (snapshot.size === 0) {
//         console.log("There was an error getting the caller's document.");
//       } else {
//         const canContinue = isTimeoutOver(userDoc.lastRally, 10000);

//         if (!canContinue) {
//           res.status(500).json({ error: "The timeout has not finished." });
//           return;
//         } else {
//           await updateDoc(userDoc.ref, { lastRally: new Date().getTime() });
//         }
//       }
//     } catch (error) {
//       console.log("There was an error setting the lastRally field", error);
//     }

//     try {
//       // Get the list of user IDs from the request body
//       // Fetch the emails based on the user IDs
//       const emailPromises = userIds.map(async (userId) => {
//         const usersCollection = collection(db, "users");
//         const q = query(usersCollection, where("userId", "==", userId));
//         const querySnapshot = await getDocs(q);

//         if (!querySnapshot.empty) {
//           const userDoc = querySnapshot.docs[0];
//           const email = userDoc.data().email;
//           return email;
//         } else {
//           return null;
//         }
//       });

//       // Wait for all email promises to resolve
//       const emails = await Promise.all(emailPromises);

//       // Return the list of emails
//       res.status(200).json({ emails });
//     } catch (error) {
//       console.error("Error retrieving emails:", error);
//       res
//         .status(500)
//         .json({ error: "An error occurred while retrieving emails." });
//     }
//   } else {
//     res.status(405).json({ error: "Method not allowed" });
//   }
// }
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
