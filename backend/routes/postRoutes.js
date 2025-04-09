const express = require("express");
const router = express.Router();
const { createPost, getPosts, getPostById, updatePost, deletePost } = require("../controllers/postControllers");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload"); // Middleware para subir archivos
const {getComments, createComment} = require('../controllers/commentsControllers')

// Ruta para crear una publicación
router.post("/posts", auth, upload.single("image"), createPost);

// Ruta para obtener todas las publicaciones
router.get("/posts", getPosts);

// Ruta para obtener una publicación por ID
router.get("/posts/:id", getPostById);

// Ruta para actualizar una publicación
router.patch("/posts/:id", auth, updatePost);

// Ruta para eliminar una publicación
router.delete("/posts/:id", auth, deletePost);

// Ruta para obtener comentarios
router.get("/posts/:id/comments", getComments);

// Ruta para crear comentario
router.post("/posts/:id/comments", auth, createComment);

module.exports = router;