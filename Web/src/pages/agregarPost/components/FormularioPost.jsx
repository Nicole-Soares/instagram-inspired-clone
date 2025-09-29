import React from 'react';


const FormularioPost = ({ url, descripcion, onUrlChange, onDescripcionChange, onSubmit }) => (
  <div className="contenedorImputs">
    <input
      id="url-input"
      type="text"
      placeholder="Url de la imagen"
      value={url}
      onChange={onUrlChange}
    />
    <textarea
      id="descripcion-input"
      placeholder="Agrega descripcion"
      value={descripcion}
      onChange={onDescripcionChange}
    />
    <button onClick={onSubmit} className="botonAgregarPost">Publicar</button>
  </div>
);

export default FormularioPost;
