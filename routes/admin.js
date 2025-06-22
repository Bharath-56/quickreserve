const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/add-train", async (req, res) => {
  const { name, source, destination, date, departure_time, arrival_time } = req.body;
  try {
    await db.query(
      "INSERT INTO trains (name, source, destination, date, departure_time, arrival_time) VALUES ($1, $2, $3, $4, $5, $6)",
      [name, source, destination, date, departure_time, arrival_time]
    );
    res.redirect("/admin.html");
  } catch (err) {
    console.error("Error adding train:", err);
    res.status(500).send("Failed to add train");
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await db.query("SELECT id, name, email, is_verified FROM users");
    res.json(users.rows);
  } catch (err) {
    console.error("❌ Fetch users error:", err);
    res.status(500).send("Failed to fetch users");
  }
});

router.get("/trains", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM trains ORDER BY date ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Fetch trains error:", err);
    res.status(500).send("Fetch trains error");
  }
});

router.get("/bookings", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT b.id, u.name AS user_name, u.email, t.name AS train_name,
             t.source, t.destination, t.date, b.seat_class, b.quantity
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN trains t ON b.train_id = t.id
      ORDER BY t.date
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Fetch bookings error:", err);
    res.status(500).send("Failed to fetch bookings");
  }
});

router.post("/delete-train/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM trains WHERE id = $1", [req.params.id]);
    res.status(200).send("Train deleted");
  } catch (err) {
    console.error("❌ Delete train error:", err);
    res.status(500).send("Delete train error");
  }
});

// 👥 Get all users
router.get("/users", async (req, res) => {
  try {
    const result = await db.query("SELECT id, name, email FROM users ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Fetch users error:", err);
    res.status(500).send("Error fetching users");
  }
});


// 🗑 Delete a user (admin only)
router.post("/delete-user/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM users WHERE id = $1", [req.params.id]);
    console.log(`✅ Deleted user ID ${req.params.id}`);
    res.redirect("/admin.html");
  } catch (err) {
    console.error("❌ Delete user error:", err);
    res.status(500).send("Delete user error");
  }
});


module.exports = router;
