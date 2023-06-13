import {
  auth,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from "../../db/connect";

export default async function login(req, res) {
  try {
    const { email, password } = req.body;

    const response = await signInWithEmailAndPassword(auth, email, password);
    const user = response.user;

    // Access the user information from the response
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, error: "Failed to login" });
  }
}
