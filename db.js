// db.js
const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

console.log("Connecting with:", process.env.DB_USER, process.env.DB_NAME);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
  ssl: {
    rejectUnauthorized: false, // ✅ Required by Render
  },
});

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ PostgreSQL connection error:", err));

module.exports = pool;
