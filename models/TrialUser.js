const mongoose = require("mongoose");

const TrialUserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  startDate: String,
  endDate: String,
});

module.exports = mongoose.model("TrialUser", TrialUserSchema);
