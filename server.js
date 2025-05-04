const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const trialRoutes = require("./routes/trialRoutes");

const app = express();
const PORT = 5050;

app.use(cors());
app.use(express.json());

// Connecting DataBase MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/trialWorkoutDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("✅ Connected to MongoDB"));

//Routes
app.use("/api", trialRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
