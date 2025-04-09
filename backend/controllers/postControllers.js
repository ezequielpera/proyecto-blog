const Post = require("../models/Post");

const createPost = async (req, res) => {
  console.log("Datos recibidos:", req.body);
  console.log("Archivo recibido:", req.file);

  const { title, content, description } = req.body;
  const image = req.file ? req.file.path : null;
  const author = req.user.id;

  if (!title || !content || !description) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios." });
  }

  try {
    const post = new Post({
      title,
      content,
      description,
      image,
      author,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error("Error al crear la publicación:", error);
    res.status(500).json({ message: "Error al crear la publicación" });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "firstName lastName"); // Populate para obtener datos del autor
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las publicaciones" });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "firstName lastName"
    );
    if (!post) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la publicación" });
  }
};

const updatePost = async (req, res) => {
  const { title, content } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    // Verificar que el usuario autenticado es el autor de la publicación
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "No tienes permisos para actualizar esta publicación",
      });
    }

    post.title = title || post.title;
    post.content = content || post.content;

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la publicación" });
  }
};

const deletePost = async (req, res) => {
  try {
    console.log("ID de la publicación a borrar:", req.params.id); // Verifica el ID
    console.log("Usuario autenticado:", req.user.id); // Verifica el ID del usuario

    // Primero, busca la publicación sin borrarla
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    // Verificar que el usuario autenticado es el autor de la publicación
    if (post.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No tienes permisos para eliminar esta publicación" });
    }

    // Si el usuario es el autor, borrar la publicación
    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: "Publicación eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la publicación:", error); // Registra el error
    res.status(500).json({ message: "Error al eliminar la publicación" });
  }
};

module.exports = { createPost, getPosts, getPostById, updatePost, deletePost };
