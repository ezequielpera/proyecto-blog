import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Error al iniciar sesión");
      }

      login(data.token, data.user);

      navigate("/main");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/github";
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      login(token, null);

      navigate("/main");
    }
  }, [login, navigate]);

  return (
    <div className="login-container d-flex flex-column justify-content-center align-items-center">
      <h2 className="mb-4">Iniciar Sesión</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label className="fs-5">Correo electrónico</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Ingresa tu email"
            onChange={handleChange}
            value={formData.email}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label className="fs-5">Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Ingresa tu contraseña"
            onChange={handleChange}
            value={formData.password}
          />
        </Form.Group>
        {error && <div className="alert alert-danger">{error}</div>}
        <Button variant="dark" type="submit" className="m-auto">
          Iniciar Sesión
        </Button>
      </Form>

      {/* Botones de OAuth */}
      <div className="mt-4">
        <Button variant="danger" onClick={handleGoogleLogin} className="me-2">
          Iniciar sesión con Google
        </Button>
        <Button variant="dark" onClick={handleGitHubLogin}>
          Iniciar sesión con GitHub
        </Button>
      </div>
    </div>
  );
};

export default Login;
