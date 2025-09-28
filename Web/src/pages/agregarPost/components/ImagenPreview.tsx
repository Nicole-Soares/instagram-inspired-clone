import React from 'react';


const ImagenPreview = ({ imagen, onAgregarImagenClick, fileInputRef, onFileChange }) => (
  <div className="contenedorImagen">
    {imagen ? (
      <img src={imagen} alt="Preview" />
    ) : (
      <div onClick={onAgregarImagenClick}>
        <h2 className="agregarImagen">Agregar imagen</h2>
      </div>
    )}
    <input
      type="file"
      accept="image/*"
      ref={fileInputRef}
      style={{ display: 'none' }}
      onChange={onFileChange}
    />
  </div>
);

export default ImagenPreview;
