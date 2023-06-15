import { db, collection, getDocs, query, where } from "../../db/connect";

const collectionName = "users";

export default async function getJoinedRallyIds(req, res) {
  if (req.method === "POST") {
    try {
      const { userId } = req.body;

      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, where("userId", "==", userId));

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log("No user found.");
        res.status(404).json({ error: "User not found" });
        return;
      }

      const userData = snapshot.docs[0].data();
      const joinedRallyIds = userData.rallies || [];

      res.status(200).json(joinedRallyIds);
    } catch (error) {
      console.error("Error fetching collection:", error);
      res.status(500).json({ error: "Failed to fetch collection" });
    }
  }
}
