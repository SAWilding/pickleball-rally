const db = require("../src/db/connect");

const collectionName = "rallies";

// Create a Rally
const createRally = async (data) => {
  try {
    const docRef = await db.collection(collectionName).add(data);
    console.log("Rally created with ID:", docRef.id);
  } catch (error) {
    console.error("Error creating Rally:", error);
  }
};

// Read all Rallys
const readRallys = async () => {
  try {
    const snapshot = await db.collection(collectionName).get();
    snapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  } catch (error) {
    console.error("Error reading Rallys:", error);
  }
};

// Update a Rally
const updateRally = async (docId, data) => {
  try {
    await db.collection(collectionName).doc(docId).update(data);
    console.log("Rally updated with ID:", docId);
  } catch (error) {
    console.error("Error updating Rally:", error);
  }
};

// Delete a Rally
const deleteRally = async (docId) => {
  try {
    await db.collection(collectionName).doc(docId).delete();
    console.log("Rally deleted with ID:", docId);
  } catch (error) {
    console.error("Error deleting Rally:", error);
  }
};

module.exports = {
  createRally,
  readRallys,
  updateRally,
  deleteRally,
};
