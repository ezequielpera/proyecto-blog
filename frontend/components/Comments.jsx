import { useState, useEffect } from "react";
import axios from "axios";
import { ListGroup, Form, Button, Alert } from "react-bootstrap";

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]); 
  const [newComment, setNewComment] = useState(""); 
  const [commentError, setCommentError] = useState(""); 
  const [loading, setLoading] = useState(true); 

 
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`https://proyecto-blog-xwmd.onrender.com/api/posts/${postId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error("Error al obtener los comentarios:", error);
        setCommentError("Error al cargar los comentarios.");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    setCommentError("");

    if (!newComment.trim()) {
      setCommentError("El comentario no puede estar vacío.");
      return;
    }

    try {
      const response = await axios.post(
        `https://proyecto-blog-xwmd.onrender.com/api/posts/${postId}/comments`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (err) {
      setCommentError("Error al enviar el comentario.");
      console.error("Error al enviar el comentario:", err);
    }
  };

  if (loading) {
    return <p>Cargando comentarios...</p>;
  }

  return (
    <div className="mt-5">
      <h3>Comentarios</h3>

      {/* Formulario para enviar un nuevo comentario */}
      <Form onSubmit={handleSubmitComment} className="mb-4">
        <Form.Group>
          <Form.Control
            as="textarea"
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe tu comentario..."
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="mt-2">
          Enviar comentario
        </Button>
      </Form>

      {/* Mostrar errores al enviar comentarios */}
      {commentError && <Alert variant="danger">{commentError}</Alert>}

      {/* Lista de comentarios */}
      <ListGroup>
        {comments.map((comment) => (
          <ListGroup.Item key={comment._id} className="text-start">
            <strong>{comment.author.firstName} {comment.author.lastName}</strong>
            <p>{comment.content}</p>
            <small>
              {new Date(comment.createdAt).toLocaleDateString()}
            </small>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Comments;