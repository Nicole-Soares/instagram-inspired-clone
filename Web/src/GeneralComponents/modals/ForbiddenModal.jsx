import React from 'react';
import { useNavigate } from "react-router-dom";
import '../../style/generalComponents/UnauthorizedModal.css'; 

const ForbiddenModal = () => {
    const navigate = useNavigate(); 
    return(

  <div className="modalBloqueo">
    <div className="modalContenido">
      <h2>Acceso Denegado 🛑</h2>
      <p>No tienes permiso para realizar esta acción, ya que no eres el autor del post.</p>
      <button onClick={() => navigate("/home")}>Volver al Inicio</button>
    </div>
  </div>

  )
};

export default ForbiddenModal;