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


router.get("/trains", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM trains ORDER BY date ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Fetch trains error:", err);
    res.status(500).send("Fetch trains error");
  }
});

router.post("/delete-train/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM trains WHERE id = $1", [req.params.id]);
    res.redirect("/admin.html");
  } catch (err) {
    console.error("❌ Delete train error:", err);
    res.status(500).send("Delete train error");
  }
});

module.exports = router;
