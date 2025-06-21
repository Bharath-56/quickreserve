// routes/adminAuth.js
const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM admins WHERE username = $1", [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: "❌ Admin not found" });
    }

    const admin = result.rows[0];

    if (admin.password === password) {
      req.session.adminId = admin.id;
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false, message: "❌ Incorrect password" });
    }
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/admin-login.html"));
});

module.exports = router;
