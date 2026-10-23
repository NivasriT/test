/*
BYTEXL NIMBUS:
1. Create a Node.js workspace with package.json, server.js, .env and public/index.html.
2. Copy .env.example to .env and configure a working MongoDB URI.
3. Run npm install, then npm start.
4. Open the ByteXL application URL.
5. This example uses the MongoDB Native Driver, not Mongoose.
*/
const express = require("express");
const { MongoClient } = require("mongodb");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let orders;

app.get("/api/orders", async (req, res) => {
  try { res.json(await orders.find({}).toArray()); }
  catch (error) { res.status(500).json({ error: "Unable to retrieve orders" }); }
});

app.get("/api/orders/:orderId", async (req, res) => {
  try {
    const order = await orders.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (error) { res.status(500).json({ error: "Unable to retrieve order" }); }
});

app.post("/api/orders", async (req, res) => {
  try {
    const { orderId, customerName, amount, orderType } = req.body;
    if (!orderId || !customerName || !Number.isFinite(amount) || amount < 0 ||
        !["Online", "Takeaway", "Dine-in"].includes(orderType)) {
      return res.status(400).json({ error: "Invalid order details" });
    }
    if (await orders.findOne({ orderId })) return res.status(409).json({ error: "Order ID already exists" });
    await orders.insertOne({ orderId, customerName, amount, orderType });
    res.status(201).json({ message: "Order inserted successfully" });
  } catch (error) { res.status(500).json({ error: "Unable to insert order" }); }
});

app.patch("/api/orders/:orderId", async (req, res) => {
  try {
    const { orderType } = req.body;
    if (!["Online", "Takeaway", "Dine-in"].includes(orderType)) return res.status(400).json({ error: "Invalid order type" });
    const result = await orders.updateOne({ orderId: req.params.orderId }, { $set: { orderType } });
    if (!result.matchedCount) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order updated successfully" });
  } catch (error) { res.status(500).json({ error: "Unable to update order" }); }
});

app.delete("/api/orders/:orderId", async (req, res) => {
  try {
    const result = await orders.deleteOne({ orderId: req.params.orderId });
    if (!result.deletedCount) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (error) { res.status(500).json({ error: "Unable to delete order" }); }
});

async function startServer() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    orders = client.db("restaurantDB").collection("orders");
    await orders.updateOne({ orderId: "OR01" }, { $setOnInsert: { orderId: "OR01", customerName: "Arun", amount: 800, orderType: "Online" } }, { upsert: true });
    app.listen(process.env.PORT || 3000, "0.0.0.0", () => console.log("Food Ordering server running"));
  } catch (error) {
    console.error("Startup failed:", error.message);
    await client.close();
    process.exit(1);
  }
}
startServer();