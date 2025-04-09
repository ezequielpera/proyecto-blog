import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, repeatPassword } = formData;

    if (password !== repeatPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Error al registrar el usuario");
      }

      // Aquí puedes redirigir al usuario o mostrar un mensaje de éxito
      alert("Usuario registrado con éxito, verifica tu correo");
      navigate("/main");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container d-flex flex-column justify-content-center align-items-center">
      <h2 className="mb-4">Regístrate</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Form.Label className="fs-5">Nombre Completo</Form.Label>
          <Col>
            <Form.Control
              name="firstName"
              placeholder="Nombre"
              onChange={handleChange}
              value={formData.firstName}
            />
          </Col>
          <Col>
            <Form.Control
              name="lastName"
              placeholder="Apellido"
              className="mb-3"
              onChange={handleChange}
              value={formData.lastName}
            />
          </Col>
        </Row>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label className="fs-5">Correo electrónico</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Ingresa tu email"
            onChange={handleChange}
            value={formData.email}
          />
          <Form.Text className="text-muted">
            Nunca compartiremos tus datos con nadie.
          </Form.Text>
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
        <Form.Group className="mb-4" controlId="formBasicPasswordRepeat">
          <Form.Label className="fs-5">Repetir contraseña</Form.Label>
          <Form.Control
            type="password"
            name="repeatPassword"
            placeholder="Ingresa tu contraseña"
            onChange={handleChange}
            value={formData.repeatPassword}
          />
        </Form.Group>
        {error && <div className="alert alert-danger">{error}</div>}
        <Button variant="dark" type="submit" className="m-auto">
          Registrarme
        </Button>
      </Form>
    </div>
  );
};

export default Signup;
