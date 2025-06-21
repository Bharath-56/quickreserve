// controllers/userController.js
const Train = require("../models/trainModel");
const Booking = require("../models/bookingModel");

exports.searchTrains = async (req, res) => {
  try {
    const { source, destination, date } = req.query;
    const result = await Train.searchTrains(source, destination, date);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Search error:", err);
    res.status(500).send("Failed to search trains");
  }
};

exports.bookTrain = async (req, res) => {
  const { userId } = req.session;
  const { train_id } = req.body;

  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  try {
    await Booking.createBooking(userId, train_id);
    res.redirect("/mybookings.html");
  } catch (err) {
    console.error("❌ Booking error:", err);
    res.status(500).send("Failed to book train");
  }
};

exports.getUserBookings = async (req, res) => {
  const { userId } = req.session;

  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const result = await Booking.getUserBookings(userId);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ My bookings error:", err);
    res.status(500).send("Failed to fetch bookings");
  }
};
