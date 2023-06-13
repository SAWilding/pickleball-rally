import { db, collection, getDocs, query, where } from "../../db/connect";

const collectionName = "rallies";

function haversineDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371; // Radius of the Earth in kilometers

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c; // Distance in kilometers

  return distance;
}

export default async function getRallies(req, res) {
  if (req.method === "GET") {
    try {
      const { latitude, longitude, distance } = req.query;
      const kilometersPerMile = 1.60934;
      const maxDistanceKilometers = parseFloat(distance) * kilometersPerMile;

      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef);

      const snapshot = await getDocs(q);
      const documents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const filteredDocuments = documents.filter((doc) => {
        const docLatitude = doc.location.latitude;
        const docLongitude = doc.location.longitude;

        const docDistance = haversineDistance(
          parseFloat(latitude),
          parseFloat(longitude),
          docLatitude,
          docLongitude
        );

        return docDistance <= maxDistanceKilometers;
      });

      res.status(200).json(filteredDocuments);
    } catch (error) {
      console.error("Error fetching collection:", error);
      res.status(500).json({ error: "Failed to fetch collection" });
    }
  }
}
