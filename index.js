import express from "express";
import admin from "firebase-admin";
import cors from "cors";
import { readFileSync } from "fs";

const app = express();
app.use(cors());
app.use(express.json());

// Load Firebase Admin key
const serviceAccount = JSON.parse(
  readFileSync("./serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Example route to send notif
app.post("/send-notif", async (req, res) => {
  const { token, title, body } = req.body;

  try {
    const message = {
      notification: { title, body },
      token: token
    };

    const response = await admin.messaging().send(message);
    res.json({ success: true, response });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Render will use this port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
