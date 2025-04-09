const Comment = require("../models/Comment");

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id }).populate(
      "author",
      "firstName lastName"
    );
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los comentarios" });
  }
};

const createComment = async (req, res) => {
  const { content } = req.body;

  try {
    const comment = new Comment({
      content,
      post: req.params.id,
      author: req.user.id,
    });

    await comment.save();

    const populatedComment = await Comment.findById(comment._id).populate(
      "author",
      "firstName lastName"
    );
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el comentario" });
    console.error(error);
  }
};

module.exports = { getComments, createComment };
