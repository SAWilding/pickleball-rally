import { db, collection, getDocs, query, where } from "../../db/connect";

const collectionName = "rallies";

export default async function getJoinedRallies(req, res) {
  if (req.method === "POST") {
    try {
      const { rallyIds } = req.body;

      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef);

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log("No rallies found.");
        res.status(404).json({ error: "Rallies not found" });
        return;
      }

      const rallyData = snapshot.docs
        .filter((doc) => rallyIds.includes(doc.id))
        .map((doc) => ({ id: doc.id, ...doc.data() }));

      res.status(200).json(rallyData);
    } catch (error) {
      console.error("Error fetching collection:", error);
      res.status(500).json({ error: "Failed to fetch collection" });
    }
  }
}
