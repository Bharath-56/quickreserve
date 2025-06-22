const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
// 📧 Email validation regex

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


// 🔐 Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // 1️⃣ Email Format Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format" });
  }

  try {
    // 2️⃣ Check if email already exists
    const check = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (check.rows.length > 0) {
      return res.status(409).json({ success: false, message: "⚠️ Email already registered" });
    }

    // 3️⃣ Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const userResult = await db.query(
      "INSERT INTO users (name, email, password, is_verified) VALUES ($1, $2, $3, $4) RETURNING id",
      [name, email, hashedPassword, false]
    );
    const userId = userResult.rows[0].id;

    // 4️⃣ Generate verification token
    const token = crypto.randomBytes(32).toString("hex");
    await db.query("INSERT INTO email_tokens (user_id, token) VALUES ($1, $2)", [userId, token]);

    // 5️⃣ Send verification email
    const verifyLink = `https://quickreserve-dm48.onrender.com/auth/verify?token=${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email",
      html: `
        <h3>Verify your QuickReserve account</h3>
        <p>Click the link below to verify your email:</p>
        <a href="${verifyLink}">${verifyLink}</a>
        <p>If you did not register, you can ignore this message.</p>
      `
    });

    res.status(200).json({ success: true, message: "✅ Registered. Check your email to verify." });

  } catch (err) {
    console.error("❌ Registration error:", err);

    if (err.code === "23505") {
      res.status(409).json({ success: false, message: "⚠️ Email already exists" });
    } else {
      res.status(500).json({ success: false, message: "❌ Registration failed" });
    }
  }
});

// 🔓 Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // 🚫 Basic validation

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: "❌ User not found" });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!user.is_verified) {
  return res.status(403).json({ success: false, message: "⚠️ Please verify your email before logging in." });
  }

    // 🧠 Store session user
    req.session.userId = user.id;

    res.status(200).json({ success: true, redirect: "/search.html" });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: "❌ Login failed" });
  }
});

router.get("/verify", async (req, res) => {
  const { token } = req.query;

  try {
    const result = await db.query("SELECT * FROM email_tokens WHERE token = $1", [token]);

    if (result.rows.length === 0) {
      return res.send("❌ Invalid or expired token");
    }

    const userId = result.rows[0].user_id;

    await db.query("UPDATE users SET is_verified = true WHERE id = $1", [userId]);
    await db.query("DELETE FROM email_tokens WHERE user_id = $1", [userId]);

    res.send("✅ Email verified! You can now log in.");
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(500).send("Server error");
  }
});



// 🔍 Check if logged in (used by frontend)
router.get("/status", (req, res) => {
  res.json({ loggedIn: !!req.session.userId });
});

// 🚪 Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login.html");
  });
});

module.exports = router;
