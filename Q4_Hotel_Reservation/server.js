/*
BYTEXL NIMBUS:
1. Create a Node.js workspace with package.json, server.js, .env and public/index.html.
2. Copy .env.example to .env and configure a working MongoDB URI.
3. Run npm install, then npm start.
4. Open the ByteXL application URL.
5. The API supports reservation insertion, listing, status update and deletion.
*/
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const reservationSchema = new mongoose.Schema({
  reservationId: { type: Number, required: true, unique: true },
  guestName: { type: String, required: true, trim: true },
  roomType: { type: String, required: true },
  status: { type: String, required: true, enum: ["Confirmed", "CheckedIn", "CheckedOut", "Cancelled"] }
});
const Reservation = mongoose.model("Reservation", reservationSchema);

app.get("/api/reservations", async (req, res) => {
  try { res.json(await Reservation.find()); }
  catch (error) { res.status(500).json({ error: "Unable to retrieve reservations" }); }
});

app.post("/api/reservations", async (req, res) => {
  try { res.status(201).json(await Reservation.create(req.body)); }
  catch (error) { res.status(400).json({ error: error.message }); }
});

app.patch("/api/reservations/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findOneAndUpdate(
      { reservationId: Number(req.params.id) },
      { $set: { status: req.body.status } },
      { new: true, runValidators: true }
    );
    if (!reservation) return res.status(404).json({ error: "Reservation not found" });
    res.json(reservation);
  } catch (error) { res.status(400).json({ error: error.message }); }
});

app.delete("/api/reservations/:id", async (req, res) => {
  try {
    const result = await Reservation.deleteOne({ reservationId: Number(req.params.id) });
    if (!result.deletedCount) return res.status(404).json({ error: "Reservation not found" });
    res.json({ message: "Reservation deleted successfully" });
  } catch (error) { res.status(500).json({ error: "Unable to delete reservation" }); }
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 3000, "0.0.0.0", () => console.log("Hotel Reservation server running"));
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}
startServer();