const express = require("express");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");


const passport = require("./services/passport");

const app = express();

app.use(
  cors()
);

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use(passport.initialize());


// Rutas
app.use("/api", authRoutes);
app.use("/api", postRoutes);

// Configuración para servir archivos estáticos desde la carpeta "uploads"
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
