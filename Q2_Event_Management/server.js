/*
BYTEXL NIMBUS:
1. Create a Node.js workspace with this project structure.
2. Copy .env.example to .env and configure MongoDB.
3. Run npm install, then npm start.
4. Open the URL provided by ByteXL.
5. Add an event using POST /api/events.
6. For deployment, configure MONGODB_URI in host environment settings.

GIT:
git init
git switch -c event-management_v1
git add .
git commit -m "Implement event management"
*/
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  date: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, default: "" }
});
const Event = mongoose.model("Event", eventSchema);

app.get("/api/events", async (req, res) => {
  try { res.json(await Event.find()); }
  catch (error) { res.status(500).json({ error: "Unable to retrieve events" }); }
});

app.get("/api/events/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: "Invalid event ID" });
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (error) { res.status(500).json({ error: "Unable to retrieve event" }); }
});

app.post("/api/events", async (req, res) => {
  try { res.status(201).json(await Event.create(req.body)); }
  catch (error) { res.status(400).json({ error: error.message }); }
});

app.get("/api/health", (req, res) => res.json({ status: "Server running" }));

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 3000, "0.0.0.0", () => console.log("Event server running"));
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}
startServer();