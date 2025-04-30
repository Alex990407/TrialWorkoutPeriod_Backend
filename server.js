const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const TrialUser = require("./models/TrialUser");

const app = express();
const PORT = 5050;

// Middleware

app.use(cors());

app.use(express.json());

// Подключение к MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/trialWorkoutDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("✅ Connected to MongoDB");
});

// Расчет даты окончания
function calculateEndDate(startDate) {
  const date = new Date(startDate);
  date.setDate(date.getDate() + 14); // 14 дней пробного периода
  return date.toISOString().split("T")[0];
}

// POST /api/trial — регистрация нового пользователя
app.post("/api/trial", async (req, res) => {
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

// GET /api/trial — список всех пользователей (для админки)
app.get("/api/trial", async (req, res) => {
  try {
    const users = await TrialUser.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error("Fehler beim Abrufen:", error);
    res.status(500).json({ message: "Fehler beim Abrufen der Benutzer." });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
