const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minlength: 3, maxlength: 30 },
  lastName: { type: String, required: true, minlength: 3, maxlength: 30 },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Por favor, ingresa un correo valido",
    ],
  },
  password: { type: String }, // Hacer el campo opcional
  provider: { type: String, enum: ["local", "google", "github"], default: "local" }, // Identificar el proveedor
  isVerified: { type: Boolean, default: false }, // Campo para verificar el correo
  verificationToken: { type: String }, // Token de verificación
  role: { type: String, enum: ["admin", "user"], default: "user" },
  createAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

// Generar un token de verificación antes de guardar el usuario
userSchema.pre("save", function (next) {
  if (this.provider === "local") {
    this.verificationToken = uuidv4(); // Generar un token único
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
