import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Spinner, Modal, Button, Form } from "react-bootstrap";
import { Editor } from "@tinymce/tinymce-react"; // Importa TinyMCE
import Comments from "../components/Comments";
import "./Post.css";
import { AuthContext } from "../utils/AuthContext";

const PostDetail = () => {
  const { id } = useParams(); // Obtener el ID de la publicación desde la URL
  const navigate = useNavigate(); // Para redirigir al usuario
  const [post, setPost] = useState(null); // Estado para almacenar la publicación
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const { user } = useContext(AuthContext);

  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal de confirmación para borrar
  const [showEditModal, setShowEditModal] = useState(false); // Modal de edición

  // Estado para manejar los campos editables
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Cargar los datos de la publicación al abrir el modal de edición
  const handleShowEdit = () => {
    setTitle(post.title); // Llenar el campo de título con el valor actual
    setContent(post.content); // Llenar el campo de contenido con el valor actual
    setShowEditModal(true); // Abrir el modal de edición
  };

  // Función para borrar la publicación
  const handleDeleteButton = async (id) => {
    try {
      await axios.delete(`https://proyecto-blog-xwmd.onrender.com/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Envía el token de autenticación
        },
      });
      navigate("/main"); // Redirigir al usuario a la página principal
    } catch (err) {
      setError("No se pudo borrar la publicación.");
      console.error("Error al borrar la publicación:", err);
    } finally {
      setShowDeleteModal(false); // Cerrar el modal de confirmación
    }
  };

  // Función para editar la publicación
  const handleEditButton = async () => {
    try {
      const updatedData = { title, content }; // Datos actualizados
      const response = await axios.patch(
        `https://proyecto-blog-xwmd.onrender.com/api/posts/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Envía el token de autenticación
          },
        }
      );
      setPost(response.data); // Actualizar el estado con los nuevos datos
      setShowEditModal(false); // Cerrar el modal de edición
    } catch (err) {
      setError("No se pudo editar la publicación.");
      console.error("Error al editar la publicación:", err);
    }
  };

  // Cargar la publicación al montar el componente
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `https://proyecto-blog-xwmd.onrender.com/api/posts/${id}`
        );
        setPost(response.data);
      } catch (error) {
        console.error("Error al obtener la publicación:", error);
        setError(
          "Error al cargar la publicación. Inténtalo de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <Spinner animation="border" variant="primary" className="m-auto" />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!post) {
    return <p>No se encontró la publicación.</p>;
  }

  return (
    <div className="w-100 text-center m-auto p-5 container-md post-content">
      <h1>{post.title}</h1>

      {post.image && (
        <img
          src={`https://proyecto-blog-xwmd.onrender.com/${post.image}`}
          alt={post.title}
          className="img-fluid mb-3"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      )}

      <div dangerouslySetInnerHTML={{ __html: post.content }} />

      <small className="d-block">
        Publicado el: {new Date(post.createdAt).toLocaleDateString()} por{" "}
        {post.author.firstName} {post.author.lastName}
      </small>
      {user && (
        <>
          <Button
            variant="danger"
            onClick={() => setShowDeleteModal(true)}
            className="m-3 fw-bold"
          >
            Borrar publicación
          </Button>

          <Button
            variant="success"
            onClick={handleShowEdit}
            className="m-3 fw-bold"
          >
            Editar publicación
          </Button>
        </>
      )}

      <Comments postId={id} />

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>¿Estás seguro?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Esta acción borrará la publicación permanentemente. ¿Deseas continuar?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-dark"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => handleDeleteButton(post._id)}>
            Borrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar publicación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contenido</Form.Label>

              <Editor
                apiKey="q9ebgqpa518yyi772azgby4sio85qf4wp7i16vw6lxh87v8q"
                value={content}
                onEditorChange={(newContent) => setContent(newContent)}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: "lists link image",
                  toolbar:
                    "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | link image | code",
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-dark"
            onClick={() => setShowEditModal(false)}
          >
            Cancelar
          </Button>
          <Button variant="success" onClick={handleEditButton}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PostDetail;
