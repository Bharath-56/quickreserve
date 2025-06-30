const express = require("express");
const router = express.Router();
const db = require("../db");
const nodemailer = require("nodemailer");

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 🔍 Search Trains
router.get("/search", async (req, res) => {
  const { source, destination, date } = req.query;

  if (!source || !destination || !date) {
    return res.status(400).json({ success: false, message: "Missing required search parameters" });
  }

  try {
    const result = await db.query(
      "SELECT * FROM trains WHERE source = $1 AND destination = $2 AND date = $3",
      [source, destination, date]
    );
    res.status(200).json({ success: true, trains: result.rows });
  } catch (err) {
    console.error("❌ Search error:", err);
    res.status(500).json({ success: false, message: "Search failed" });
  }
});

// 🎟 Book a Train
router.post("/book", async (req, res) => {
  const { userId } = req.session;
  const { train_id, seat_class, quantity } = req.body;

  if (!userId) return res.status(401).json({ success: false, message: "Unauthorized. Please login." });

  try {
    const userRes = await db.query("SELECT email, is_verified FROM users WHERE id = $1", [userId]);
    const user = userRes.rows[0];

    if (!user.is_verified) {
      return res.status(403).json({ success: false, message: "❌ Please verify your email before booking." });
    }

    const trainResult = await db.query("SELECT * FROM trains WHERE id = $1", [train_id]);
    const train = trainResult.rows[0];

    await db.query(
      "INSERT INTO bookings (user_id, train_id, seat_class, quantity) VALUES ($1, $2, $3, $4)",
      [userId, train_id, seat_class, quantity]
    );

    // ✅ Send booking confirmation email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "🎟 QuickReserve Booking Confirmation",
      html: `
        <h2>Booking Confirmed</h2>
        <p>Dear ${user.email},</p>
        <p>Your ticket for <strong>${train.name}</strong> has been confirmed.</p>
        <p><strong>${train.source}</strong> ➡ <strong>${train.destination}</strong></p>
        <p>Date: ${train.date} | Departure: ${train.departure_time} | Arrival: ${train.arrival_time}</p>
        <p>Class: ${seat_class} | Tickets: ${quantity}</p>
        <br>
        <p>Thank you for using QuickReserve!</p>
      `
    });

    res.status(200).json({ success: true, message: "✅ Booking successful and confirmation email sent" });
  } catch (err) {
    console.error("❌ Booking error:", err);
    res.status(500).json({ success: false, message: "Booking failed" });
  }
});

// 📦 View My Bookings
router.get("/mybookings", async (req, res) => {
  const { userId } = req.session;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized. Please login." });
  }

  try {
    const result = await db.query(
      `SELECT b.id, t.name, t.source, t.destination, t.date, t.departure_time, t.arrival_time, b.seat_class, b.quantity
       FROM bookings b
       JOIN trains t ON b.train_id = t.id
       WHERE b.user_id = $1
       ORDER BY t.date, t.departure_time`,
      [userId]
    );
    res.status(200).json({ success: true, bookings: result.rows });
  } catch (err) {
    console.error("❌ My bookings error:", err);
    res.status(500).json({ success: false, message: "Could not fetch bookings" });
  }
});

// ❌ Cancel Booking
router.post("/cancel/:bookingId", async (req, res) => {
  const { userId } = req.session;
  const bookingId = req.params.bookingId;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized. Please login." });
  }

  try {
    await db.query("DELETE FROM bookings WHERE id = $1 AND user_id = $2", [bookingId, userId]);
    res.status(200).json({ success: true, message: "❌ Booking cancelled" });
  } catch (err) {
    console.error("❌ Cancel booking error:", err);
    res.status(500).json({ success: false, message: "Cancellation failed" });
  }
});

// 🔍 Autocomplete station search
router.get("/stations", async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 1) return res.json([]);

  try {
    const result = await db.query(
      `SELECT DISTINCT source AS name FROM trains WHERE source ILIKE $1
       UNION
       SELECT DISTINCT destination AS name FROM trains WHERE destination ILIKE $1
       ORDER BY name LIMIT 10`,
      [`${q}%`]
    );
    res.json(result.rows.map(r => r.name));
  } catch (err) {
    console.error("❌ Station search error:", err);
    res.status(500).json([]);
  }
});


module.exports = router;
