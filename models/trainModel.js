// models/Train.js
const db = require("../db");

exports.addTrain = (name, source, destination, date, departure_time, arrival_time) => {
  return db.query(
    "INSERT INTO trains (name, source, destination, date, departure_time, arrival_time) VALUES ($1, $2, $3, $4, $5, $6)",
    [name, source, destination, date, departure_time, arrival_time]
  );
};

exports.getAllTrains = () => {
  return db.query("SELECT * FROM trains ORDER BY date ASC");
};

exports.searchTrains = (source, destination, date) => {
  return db.query(
    "SELECT * FROM trains WHERE source = $1 AND destination = $2 AND date = $3",
    [source, destination, date]
  );
};

exports.deleteTrainById = (id) => {
  return db.query("DELETE FROM trains WHERE id = $1", [id]);
};