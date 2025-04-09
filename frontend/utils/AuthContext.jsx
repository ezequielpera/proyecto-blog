// AuthContext.js
import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Cambio aquí: importación nombrada

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const isTokenExpired = (token) => {
    if (!token) return true;

    try {
      const decoded = jwtDecode(token); // Decodificar el token
      const currentTime = Date.now() / 1000; // Tiempo actual en segundos

      // Si la fecha de expiración es menor que el tiempo actual, el token ha expirado
      return decoded.exp < currentTime;
    } catch (error) {
      console.error("Error al decodificar el token: ", error);
      return true;
    }
  };

  // Función para obtener los datos del usuario desde el backend
  const fetchUserData = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los datos del usuario");
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  // Verificar si hay un token en localStorage al cargar la aplicación
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && !isTokenExpired(storedToken)) {
      // Obtener los datos del usuario desde el backend
      fetchUserData(storedToken).then((userData) => {
        if (userData) {
          setUser(userData);
        }
      });
    } else {
      logout();
    }
  }, []);

  // Función para iniciar sesión
  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("token", newToken); // Guardar el token en localStorage
    localStorage.setItem("user", JSON.stringify(userData)); // Guardar los datos del usuario en localStorage
  };

  // Función para cerrar sesión
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token"); // Eliminar el token de localStorage
    localStorage.removeItem("user"); // Eliminar los datos del usuario de localStorage
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};