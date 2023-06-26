import {
  db,
  collection,
  addDoc,
  where,
  query,
  updateDoc,
  getDocs,
} from "../../db/connect";
import { GeoPoint } from "@firebase/firestore";

// Create a Rally

const collectionName = "rallies";

export default async function createRally(req, res) {
  if (req.method === "POST") {
    try {
      const {
        name,
        memberCount,
        members,
        frequency,
        skillLevel,
        latitude,
        longitude,
        address,
        creator,
      } = req.body;
      // Create a new document in Firestore
      const docRef = await addDoc(collection(db, collectionName), {
        creator,
        name,
        memberCount: parseInt(memberCount),
        members,
        frequency: parseInt(frequency),
        skillLevel,
        location: new GeoPoint(latitude, longitude),
        address,
        datestamp: new Date().getTime(),
      });

      // Join the just created rally
      try {
        const userId = creator;
        const rallyId = docRef.id;
        // Create a new document in Firestore
        const collectionRef = collection(db, "users");
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
      } catch (error) {
        console.error("Error creating document:", error);
        res.status(500).json({ error: "Failed to create document" });
      }

      // Return the document ID as the response
      const responseData = { id: docRef.id };
      res.status(201).json(responseData);
    } catch (error) {
      console.error("Error creating document:", error);
      res.status(500).json({ error: "Failed to create document" });
    }
  }
}
