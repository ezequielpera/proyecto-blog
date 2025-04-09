import Button from "react-bootstrap/Button";
import "./AddPub.css";
import { FaPlus } from "react-icons/fa"; // Importa el ícono de "más"
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../utils/AuthContext";

const AddPub = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Verifica si el usuario está autenticado cada vez que el componente se renderiza
  useEffect(() => {}, []);

  const handleClick = () => {
    if (user) {
      navigate("/newpub");
    } else {
      alert("Debes iniciar sesión para agregar una publicación");
    }
  };

  return (
    <div className="pub-container">
      <Button variant="secondary" className="fw-bold" onClick={handleClick}>
        <FaPlus size={20} className="me-2 icono-plus" />
        Agregar Publicación
      </Button>
    </div>
  );
};

export default AddPub;
