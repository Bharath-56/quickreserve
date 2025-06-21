// models/Booking.js
const db = require("../db");

exports.createBooking = (userId, trainId) => {
  return db.query(
    "INSERT INTO bookings (user_id, train_id) VALUES ($1, $2)",
    [userId, trainId]
  );
};

exports.getUserBookings = (userId) => {
  return db.query(
    `SELECT b.id, t.name, t.source, t.destination, t.date
     FROM bookings b
     JOIN trains t ON b.train_id = t.id
     WHERE b.user_id = $1`,
    [userId]
  );
};
