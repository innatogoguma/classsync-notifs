import express from "express";
import admin from "firebase-admin";
import cors from "cors";

// EXPRESS SETUP
const app = express();
app.use(cors());
app.use(express.json());

// FIREBASE ADMIN (ENV-BASED – required for Render)
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  })
});

// ROUTE: Send Push Notification
app.post("/send-notif", async (req, res) => {
  const { token, title, body } = req.body;

  try {
    const message = {
      notification: { title, body },
      token
    };

    const response = await admin.messaging().send(message);
    res.json({ success: true, response });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// SERVER (Render assigns PORT automatically)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
