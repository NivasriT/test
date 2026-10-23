# Question 4 — Hotel Reservation Management

## ByteXL execution
1. Create a Node.js workspace with this folder structure.
2. Copy `.env.example` to `.env`, and set a working MongoDB URI.
3. Run `npm install`, then `npm start`.
4. Open the ByteXL application URL.
5. Use `POST /api/reservations` to add a reservation.

## Required operations
Insert:
`await Reservation.create({ reservationId: 202, guestName: "Priya", roomType: "Deluxe", status: "Confirmed" });`

Update:
`await Reservation.updateOne({ reservationId: 201 }, { $set: { status: "CheckedOut" } });`

Delete:
`await Reservation.deleteOne({ reservationId: 203 });`

REST endpoints: `GET /api/reservations`, `POST /api/reservations`, `PATCH /api/reservations/:id`, `DELETE /api/reservations/:id`.
