const express = require("express");
const router = express.Router();
const TrialUser = require("../models/TrialUser");
const calculateEndDate = require("../utils/calculateEndDate");

router.post("/trial", async (req, res) => {
  const { firstName, lastName, email, startDate } = req.body;

  if (!firstName || !lastName || !email || !startDate) {
    return res.status(400).json({ message: "Alle Felder sind erforderlich." });
  }

  try {
    const existingUser = await TrialUser.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Diese E-Mail ist bereits registriert." });
    }

    const endDate = calculateEndDate(startDate);

    const newUser = new TrialUser({
      firstName,
      lastName,
      email,
      startDate,
      endDate,
    });

    await newUser.save();

    res.status(201).json({ message: "Erfolgreich registriert!" });
  } catch (error) {
    console.error("Fehler beim Speichern:", error);
    res.status(500).json({ message: "Interner Serverfehler." });
  }
});

router.get("/trial", async (req, res) => {
  try {
    const users = await TrialUser.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error("Fehler beim Abrufen:", error);
    res.status(500).json({ message: "Fehler beim Abrufen der Benutzer." });
  }
});

module.exports = router;
