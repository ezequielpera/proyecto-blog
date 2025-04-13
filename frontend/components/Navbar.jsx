import "./Navbar.css";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../utils/AuthContext";
import Modal from "react-bootstrap/Modal";

function Nav() {
  const navigate = useNavigate();
  const { user, token, logout } = useContext(AuthContext);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };
  return (
    <Navbar
      expand="lg"
      className="navbar-custom d-flex align-items-center justify-content-between w-100 px-4"
    >
      <Navbar.Brand>
        <h1>Blog</h1>
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse
        id="responsive-navbar-nav"
        className="justify-content-end"
      >
        <div className="button-container pt-2">
          {token ? (
            <>
              <Button variant="dark" className="me-2 rounded-5">
                Hola {user && user.firstName}
              </Button>
              <Button variant="outline-dark" onClick={handleShow}>
                Cerrar sesión
              </Button>
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Cerrar Sesión</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  ¿Estás seguro de que deseas cerrar sesión?
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="dark" onClick={handleClose}>
                    No
                  </Button>
                  <Button variant="outline-dark" onClick={logout}>
                    Sí, estoy seguro
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          ) : (
            <>
              <Button variant="dark" className="me-2 rounded-5" onClick={handleLogin}>
                Iniciar Sesión
              </Button>
              <Button variant="outline-dark" className="me-2 rounded-0" onClick={handleSignup}>
                Registrarme
              </Button>
            </>
          )}
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Nav;
