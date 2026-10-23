# Question 3 — Online Food Ordering

## ByteXL execution
1. Create a Node.js workspace.
2. Copy `.env.example` to `.env` and set a reachable MongoDB URI.
3. Run `npm install`, then `npm start`.
4. Open the ByteXL application URL.
5. The initial `OR01` sample order is created if it does not exist.

## Native Driver statements
Insert:
`await orders.insertOne({ orderId: "OR02", customerName: "Priya", amount: 1500, orderType: "Online" });`

Update:
`await orders.updateOne({ orderId: "OR01" }, { $set: { orderType: "Takeaway" } });`

Delete:
`await orders.deleteOne({ orderId: "OR03" });`

REST endpoints: `GET /api/orders`, `POST /api/orders`, `PATCH /api/orders/:orderId`, `DELETE /api/orders/:orderId`.
