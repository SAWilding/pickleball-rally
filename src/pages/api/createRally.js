import { db, collection, addDoc } from "../../db/connect";
import { GeoPoint } from "@firebase/firestore";

// Create a Rally

const collectionName = "rallies";

export default async function createDocument(req, res) {
  if (req.method === "POST") {
    try {
      const { name, memberCount, frequency, skillLevel, latitude, longitude } =
        req.body;
      // Create a new document in Firestore
      const docRef = await addDoc(collection(db, collectionName), {
        name,
        memberCount: parseInt(memberCount),
        frequency: parseInt(frequency),
        skillLevel,
        location: new GeoPoint(latitude, longitude),
        datestamp: new Date().getTime(),
      });

      // Return the document ID as the response
      const responseData = { id: docRef.id };
      res.status(201).json(responseData);
    } catch (error) {
      console.error("Error creating document:", error);
      res.status(500).json({ error: "Failed to create document" });
    }
  }
}
