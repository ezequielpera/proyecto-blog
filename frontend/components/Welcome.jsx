import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import './Welcome.css';

const Welcome = ({onContinue}) => {
  return (
    <Container className="welcome">
      <h1>
        Este es un blog donde puedes publicar artículos, permitiendo a los
        usuarios comentar y dar "me gusta".
      </h1>
      <p>
        <strong>Tecnologias que usare:</strong> React.js (frontend), Node.js
        (backend), MongoDB (base de datos).
      </p>
      <p><strong>Caracteristicas:</strong></p>
      <ol>
      <li>CRUD (Crear, Leer, Actualizar, Eliminar) para artículos.</li>
      <li>Sistema de
      comentarios.</li>
      <li>Autenticación de usuarios.</li>
      <li>Diseño atractivo con CSS.</li>
      <li>Animaciones.</li>
      </ol>

      <Button className="welcome-button" variant="outline-dark" onClick={onContinue}>Continuar</Button>
    </Container>
  );
};

export default Welcome;
