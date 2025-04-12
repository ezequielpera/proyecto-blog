import React, { useContext, useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { AuthContext } from "../utils/AuthContext";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";

const NewPub = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateImage = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError("Solo se permiten imágenes en formato JPEG, PNG o GIF.");
      return false;
    }

    if (file.size > maxSize) {
      setError("La imagen no puede superar los 5 MB.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("Datos enviados:", { title, content, description, image });

    if (!title || !content || !description) {
      setError("Todos los campos son obligatorios.");
      setLoading(false);
      return;
    }

    // Validar la imagen si se subió
    if (image && !validateImage(image)) {
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("description", description);
    if (image) formData.append("image", image);
    formData.append("author", user.id);

    try {
      const response = await axios.post(
        `${apiUrl}/api/posts`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Publicación creada:", response.data);

      // Redirigir al usuario a la página de la publicación o al inicio
      navigate("/main");
    } catch (err) {
      setError("Error al subir la publicación. Inténtalo de nuevo.");
      console.error("Error del servidor:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h1 className="text-center">Agrega tu publicación</h1>
      <p>Rellena todos los campos para subir tu publicación.</p>

      {/* Formulario */}
      <Form onSubmit={handleSubmit}>
        {/* Título */}
        <Form.Group controlId="formTitle" className="mb-3">
          <Form.Label>Título de la publicación</Form.Label>
          <Form.Control
            type="text"
            placeholder="Título de la publicación"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formDescription" className="mb-3">
          <Form.Label>Descripción (SEO)</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            placeholder="Escribe una breve descripción para motores de búsqueda"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formContent" className="mb-3">
          <Form.Label>Cuerpo del contenido</Form.Label>
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

        {/* Imagen */}
        <Form.Group controlId="formImage" className="mb-3">
          <Form.Label>Agrega la imagen que irá en la cabecera</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/jpeg, image/jpg, image/png, image/gif, image/jpg"
          />
        </Form.Group>

        {/* Autor (solo lectura) */}
        <Form.Group controlId="formAuthor" className="mb-3">
          <Form.Label>Publicación hecha por</Form.Label>
          <Form.Control type="text" placeholder={user.firstName} readOnly />
        </Form.Group>

        {/* Mensaje de error */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Botón de envío */}
        <div className="d-flex justify-content-center mt-4">
          <Button
            variant="dark"
            className="fw-bold"
            size="lg"
            type="submit"
            disabled={loading}
          >
            {loading ? "Subiendo..." : "Subir publicación"}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default NewPub;
