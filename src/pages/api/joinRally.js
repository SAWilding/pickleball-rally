import {
  db,
  collection,
  where,
  query,
  updateDoc,
  getDocs,
  doc,
  getDoc,
} from "../../db/connect";

const collectionName = "users";

export default async function joinRally(req, res) {
  if (req.method === "PUT") {
    try {
      const { userId, rallyId } = req.body;
      // Create a new document in Firestore
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, where("userId", "==", userId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log("There was an error joining the rally. No user found.");
      } else {
        const userDoc = snapshot.docs[0]; // Assuming only one user document is found

        // Get the existing rallies array field
        const existingRallies = userDoc.data().rallies || [];

        // Check if the rallyId is already in the existingRallies array
        if (existingRallies.includes(rallyId)) {
          console.log("The user has already joined this rally.");
        } else {
          // Append the new rallyId to the existing rallies array
          const updatedRallies = [...existingRallies, rallyId];

          // Update the document with the new rallies array
          await updateDoc(userDoc.ref, { rallies: updatedRallies });
        }
      }

      // Increment the member count by 1 and add user to members
      try {
        const rallyCollectionRef = collection(db, "rallies");
        const rallyRef = doc(rallyCollectionRef, rallyId);

        const rallySnapshot = await getDoc(rallyRef);

        if (!rallySnapshot.exists()) {
          res.status(404).json({ error: "Rally not found" });
          return;
        }

        const rallyData = rallySnapshot.data();
        const newMemberCount = rallyData.memberCount + 1;

        const memberList = rallyData.members || [];

        const updatedMemberList = [...memberList, userId];

        await updateDoc(rallyRef, {
          memberCount: newMemberCount,
          members: updatedMemberList,
        });
      } catch (error) {
        console.log("There was an error incrementing the member count.", error);
      }
      // Return the document ID as the response
      res.status(201).json();
    } catch (error) {
      console.error("Error creating document:", error);
      res.status(500).json({ error: "Failed to create document" });
    }
  }
}
