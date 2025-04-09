const mongoose = require("mongoose");

// Definir el esquema de la publicación
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // El título es obligatorio
      trim: true, // Elimina espacios en blanco al inicio y final
    },
    content: {
      type: String,
      required: true, // El contenido es obligatorio
    },
    description: {
      type: String,
      required: true, // La descripción es obligatoria
      trim: true,
    },
    image: {
      type: String, // Guardamos la ruta de la imagen
      default: null, // Si no se sube una imagen, será null
    },
    author: {
      type: mongoose.Schema.Types.ObjectId, // Referencia al usuario que creó la publicación
      ref: "User", // Relación con el modelo User
      required: true, // El autor es obligatorio
    },
  },
  {
    timestamps: true, // Añade automáticamente `createdAt` y `updatedAt`
  }
);

// Crear el modelo Post
const Post = mongoose.model("Post", postSchema);

module.exports = Post;