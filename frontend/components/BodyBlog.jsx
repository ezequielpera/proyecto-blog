import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Spinner, Row, Col } from "react-bootstrap";
import "./BodyBlog.css";
import { useNavigate } from "react-router-dom";


const BodyBlog = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/posts`);
        setPosts(response.data);
      } catch (error) {
        console.error("Error al obtener las publicaciones:", error);
        setError(
          "Error al cargar las publicaciones. Inténtalo de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <Spinner animation="border" variant="primary" className="m-auto" />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleClickPosts = (postId) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <div className="text-center container-principal pt-3">
      {posts.length === 0 ? (
        <p>No hay blogs publicados aún.</p>
      ) : (
        <Container fluid>
          <Row>
            {posts.map((post) => (
              <Col
                sm={12}
                md={12}
                lg={4}
                key={post._id}
                className="m-4 py-3 container-post d-flex flex-column"
                onClick={() => handleClickPosts(post._id)}
              >
                {post.image && (
                  <img
                    src={`${apiUrl}/${post.image}`}
                    alt={post.title}
                    className="mb-3 img-fluid"
                  />
                )}
                <h2 className="h5">{post.title}</h2>
                <p
                  className="multiline-truncate"
                  style={{ maxWidth: "100%" }}
                >
                  {post.description}
                </p>
                <small className="mt-auto text-end">
                  Publicado el: {new Date(post.createdAt).toLocaleDateString()}{" "}
                  por {post.author.firstName} {post.author.lastName}
                </small>
              </Col>
            ))}
          </Row>
        </Container>
      )}
    </div>
  );
};

export default BodyBlog;
