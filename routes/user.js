const express = require("express");
const router = express.Router();
const db = require("../db");

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

  const userRes = await db.query("SELECT is_verified FROM users WHERE id = $1", [userId]);
if (!userRes.rows[0].is_verified) {
  return res.status(403).json({ success: false, message: "❌ Verify your email before booking." });
}

  console.log("🧾 Booking request:", { userId, train_id, seat_class, quantity });

  if (!userId) {
    console.warn("⚠️ Unauthorized booking attempt");
    return res.status(401).json({ success: false, message: "Unauthorized. Please login." });
  }

  if (!train_id || !seat_class || !quantity) {
    return res.status(400).json({ success: false, message: "Missing booking details" });
  }

  try {
    await db.query(
      "INSERT INTO bookings (user_id, train_id, seat_class, quantity) VALUES ($1, $2, $3, $4)",
      [userId, train_id, seat_class, quantity]
    );
    res.status(200).json({ success: true, message: "✅ Booking successful" });
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

module.exports = router;
