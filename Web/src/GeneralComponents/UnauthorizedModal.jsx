import React from 'react';
import '../../style/ModalBloqueo.css';

const UnauthorizedModal = () => (
  <div className="modalBloqueo">
    <div className="modalContenido">
      <h2>Acceso restringido 🔒</h2>
      <p>Debés iniciar sesión para ver este post.</p>
      <button onClick={() => window.location.href = '/login'}>Ir al login</button>
    </div>
  </div>
);

export default UnauthorizedModal;
