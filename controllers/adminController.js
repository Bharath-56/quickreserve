// controllers/adminController.js
const Train = require("../models/trainModel");

exports.addTrain = async (req, res) => {
  try {
    const { name, source, destination, date, departure_time, arrival_time } = req.body;
    await Train.addTrain(name, source, destination, date, departure_time, arrival_time);
    res.redirect("/admin.html");
  } catch (err) {
    console.error("❌ Error adding train:", err);
    res.status(500).send("Failed to add train");
  }
};

exports.getAllTrains = async (req, res) => {
  try {
    const trains = await Train.getAllTrains();
    res.json(trains.rows);
  } catch (err) {
    console.error("❌ Fetch trains error:", err);
    res.status(500).send("Failed to fetch trains");
  }
};

exports.deleteTrain = async (req, res) => {
  try {
    const trainId = req.params.id;
    await Train.deleteTrainById(trainId);
    res.redirect("/admin.html");
  } catch (err) {
    console.error("❌ Delete train error:", err);
    res.status(500).send("Failed to delete train");
  }
};
