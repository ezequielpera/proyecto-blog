import Welcome from "../components/Welcome";
import {useNavigate} from 'react-router-dom'

// Componente auxiliar para manejar la navegación en el botón "Continuar"
export function WelcomeWithNavigation() {
    const navigate = useNavigate();

    const handleContinue = () => {
      navigate("/main"); // Navega a la ruta "/main"
    };

    return <Welcome onContinue={handleContinue} />;
  }