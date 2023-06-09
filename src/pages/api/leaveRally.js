import {
  db,
  collection,
  where,
  query,
  updateDoc,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
} from "../../db/connect";

const collectionName = "users";

export default async function leaveRally(req, res) {
  if (req.method === "PUT") {
    try {
      const { userId, rallyId } = req.body;
      console.log(req.body);
      // Find the user document in Firestore
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, where("userId", "==", userId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log("There was an error leaving the rally. No user found.");
      } else {
        const userDoc = snapshot.docs[0]; // Assuming only one user document is found

        // Get the existing rallies array field
        const existingRallies = userDoc.data().rallies || [];

        // Check if the rallyId is already in the existingRallies array
        if (!existingRallies.includes(rallyId)) {
          console.log("The user has not joined this rally.");
        } else {
          // Remove the rallyId from the existing rallies array
          const updatedRallies = existingRallies.filter((id) => id !== rallyId);

          // Update the document with the new rallies array
          await updateDoc(userDoc.ref, { rallies: updatedRallies });
        }
      }

      // Decrement memberCount by 1
      try {
        const rallyCollectionRef = collection(db, "rallies");
        const rallyRef = doc(rallyCollectionRef, rallyId);

        const rallySnapshot = await getDoc(rallyRef);

        if (!rallySnapshot.exists()) {
          res.status(404).json({ error: "Rally not found" });
          return;
        }

        const rallyData = rallySnapshot.data();
        const newMemberCount = rallyData.memberCount - 1;
        const memberList = rallyData.members || [];

        const updatedMemberList = memberList.filter((id) => id !== userId);

        if (newMemberCount <= 0) {
          deleteDoc(rallyRef);
        } else {
          await updateDoc(rallyRef, {
            memberCount: newMemberCount,
            members: updatedMemberList,
          });
        }
      } catch (error) {
        console.log("There was an error decrementing the member count.", error);
        res.status(500).json({ error: "Failed to decrement member count" });
      }
      // Return the response
      res.status(204).end();
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).json({ error: "Failed to update document" });
    }
  }
}
